"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { CalendarIcon, ArrowLeftIcon, PlusIcon, Trash2Icon, SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  type: string
  user_email: string
  created_at: string
}

export default function SchedulePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)

  if (!session) {
    router.push("/login")
    return null
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteEvent = async (eventId: number) => {
    try {
      const response = await fetch(`/api/events?id=${eventId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setEvents(events.filter(event => event.id !== eventId))
        toast({
          title: "일정이 삭제되었습니다",
          description: "선택한 일정이 성공적으로 삭제되었습니다.",
        })
      }
    } catch (error) {
      toast({
        title: "오류가 발생했습니다",
        description: "일정 삭제에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  const getEventTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      personal: 'green',
      work: 'blue',
      health: 'red',
      study: 'purple',
      social: 'yellow',
      ai_recommended: 'amber'
    }
    return colors[type] || 'gray'
  }

  const getEventTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      personal: '개인 일정',
      work: '업무',
      health: '건강/운동',
      study: '학습',
      social: '사교/모임',
      ai_recommended: 'AI 추천'
    }
    return labels[type] || type
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5)
  }

  const getAiRecommendations = async () => {
    setIsLoadingRecommendations(true)
    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.recommendations) {
          toast({
            title: "AI 추천 일정이 생성되었습니다!",
            description: `${data.recommendations.length}개의 맞춤 일정을 추천합니다.`,
          })
          // 추천 일정을 실제로 추가하는 로직은 여기서 구현
          // 지금은 토스트 메시지만 표시
        }
      }
    } catch (error) {
      toast({
        title: "AI 추천 생성 실패",
        description: "일정 추천을 생성하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingRecommendations(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/50 to-background dark:from-violet-950/30 dark:to-background flex flex-col">
      {/* Header */}
      <header className="flex items-center px-5 py-4 bg-background border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="mr-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 flex-1">
          <CalendarIcon className="h-6 w-6 text-violet-600" />
          <span className="font-bold text-foreground text-lg">일정 관리</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 overflow-y-auto mb-16">
        <div className="mb-4 space-y-3">
          <Link href="/schedule/new">
            <Button className="w-full flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              새로운 일정 추가하기
            </Button>
          </Link>
          
          <Button 
            onClick={getAiRecommendations}
            disabled={isLoadingRecommendations}
            variant="outline"
            className="w-full flex items-center gap-2 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20"
          >
            <SparklesIcon className="h-4 w-4" />
            {isLoadingRecommendations ? "AI가 추천 중..." : "AI 맞춤 일정 추천"}
          </Button>
        </div>

        {isLoading ? (
          <Card className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">일정을 불러오는 중...</p>
          </Card>
        ) : events.length === 0 ? (
          <Card className="p-6 text-center">
            <CalendarIcon className="h-16 w-16 text-violet-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">일정이 없습니다</h2>
            <p className="text-muted-foreground mb-4">
              첫 번째 일정을 추가해보세요!
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {events.map((event) => {
              const colorClass = getEventTypeColor(event.type)
              return (
                <Card key={event.id} className={`p-4 bg-${colorClass}-50 dark:bg-gray-700/50 border-${colorClass}-200 dark:border-gray-600`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium text-${colorClass}-700 dark:text-${colorClass}-300`}>
                      {formatDate(event.date)} {formatTime(event.time)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs text-muted-foreground bg-${colorClass}-100 dark:bg-${colorClass}-900/40 px-2 py-1 rounded`}>
                        {getEventTypeLabel(event.type)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteEvent(event.id)}
                        className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2Icon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-sm font-medium text-${colorClass}-700 dark:text-${colorClass}-300`}>
                      {event.title}
                    </span>
                  </div>
                  {event.description && (
                    <div className="text-xs text-muted-foreground">
                      {event.description}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <NavBar activeTab="schedule" />
    </div>
  )
}