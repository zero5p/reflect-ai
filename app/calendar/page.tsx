"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { CalendarIcon, ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cachedFetch } from "@/lib/cache"
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

interface Reflection {
  id: number
  title: string
  content: string
  emotion: string
  intensity: string
  created_at: string
}

function CalendarPageContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [events, setEvents] = useState<Event[]>([])
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)

  // 캐시된 데이터 가져오기
  const fetchData = useCallback(async () => {
    if (!session?.user?.email) return
    
    setIsLoading(true)
    try {
      const month = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
      const data = await cachedFetch(`/api/calendar?month=${month}`, undefined, 2)
      
      if (data.success) {
        setEvents(data.data.events || [])
        setReflections(data.data.reflections || [])
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.email, currentDate])

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session, fetchData])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50/50 to-background dark:from-violet-950/30 dark:to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }


  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    if (!Array.isArray(events)) return []
    const dateString = date.toISOString().split('T')[0]
    return events.filter(event => event?.date === dateString)
  }

  const getReflectionForDate = (date: Date) => {
    if (!Array.isArray(reflections)) return null
    const dateString = date.toISOString().split('T')[0]
    return reflections.find(reflection => 
      reflection?.created_at?.split('T')[0] === dateString
    )
  }

  const getEmotionEmoji = (emotion: string) => {
    const emotions: { [key: string]: string } = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      anxious: '😰',
      excited: '🤩',
      calm: '😌',
      confused: '🤔',
      grateful: '🙏'
    }
    return emotions[emotion] || '😐'
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5)
  }

  const getEventTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      personal: 'bg-green-500',
      work: 'bg-blue-500',
      health: 'bg-red-500',
      study: 'bg-purple-500',
      social: 'bg-yellow-500',
      ai_recommended: 'bg-amber-500'
    }
    return colors[type] || 'bg-gray-500'
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
          // 데이터 새로고침
          fetchData()
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

  const days = getDaysInMonth(currentDate)
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []

  return (
    <div className="min-h-screen bg-gradient-to-b from-mumu-cream-light to-mumu-warm dark:from-mumu-cream-dark dark:to-background flex flex-col relative overflow-hidden">
      {/* 무무 마스코트 떠다니는 장식 */}
      <div className="absolute top-20 right-4 w-16 h-16 animate-mumu-float opacity-30 pointer-events-none z-0">
        <img 
          src="/mumu_mascot.png" 
          alt="무무" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Header */}
      <header className="flex items-center px-5 py-4 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 backdrop-blur-sm border-b border-mumu-accent relative z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="mr-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 flex-1">
          <div className="h-8 w-8 rounded-lg bg-mumu-brown flex items-center justify-center">
            <img 
              src="/mumu_mascot.png" 
              alt="무무" 
              className="w-6 h-6 object-contain"
            />
          </div>
          <span className="font-bold text-mumu-brown-dark text-lg">캘린더 & 일정</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 overflow-y-auto mb-16">
        {isLoading ? (
          <Card className="p-6 text-center bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-4 animate-mumu-float">
                <img 
                  src="/mumu_mascot.png" 
                  alt="무무" 
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-mumu-brown">무무가 캘린더를 준비하고 있어요...</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* 일정 관리 버튼들 */}
            <div className="grid grid-cols-2 gap-3">
              <Link href="/schedule/new">
                <Button className="w-full flex items-center gap-2 bg-violet-600 hover:bg-violet-700">
                  <PlusIcon className="h-4 w-4" />
                  새 일정 추가
                </Button>
              </Link>
              
              <Button 
                onClick={getAiRecommendations}
                disabled={isLoadingRecommendations}
                variant="outline"
                className="w-full flex items-center gap-2 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20"
              >
                <SparklesIcon className="h-4 w-4" />
                {isLoadingRecommendations ? "AI 추천 중..." : "AI 일정 추천"}
              </Button>
            </div>
            {/* Calendar Header */}
            <Card className="p-4 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold text-foreground">{formatDate(currentDate)}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-foreground/80 dark:text-foreground/90 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  if (!day) {
                    return <div key={index} className="h-12"></div>
                  }

                  const dayEvents = getEventsForDate(day)
                  const dayReflection = getReflectionForDate(day)
                  const isToday = day.toDateString() === new Date().toDateString()
                  const isSelected = selectedDate?.toDateString() === day.toDateString()

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`h-12 flex flex-col items-center justify-center rounded-lg text-sm transition-colors relative ${
                        isToday
                          ? 'bg-violet-500 text-white font-semibold'
                          : isSelected
                          ? 'bg-violet-100 dark:bg-violet-800/50 text-violet-700 dark:text-violet-100 font-medium border-2 border-violet-300 dark:border-violet-600'
                          : 'hover:bg-muted text-foreground hover:bg-violet-50 dark:hover:bg-violet-900/30'
                      }`}
                    >
                      <span>{day.getDate()}</span>
                      <div className="absolute bottom-1 flex items-center gap-0.5">
                        {/* 감정 이모지 표시 */}
                        {dayReflection && (
                          <span className="text-xs leading-none">
                            {getEmotionEmoji(dayReflection.emotion)}
                          </span>
                        )}
                        {/* 일정 점 표시 */}
                        {dayEvents.length > 0 && (
                          <div className="flex gap-0.5">
                            {dayEvents.slice(0, 2).map((event, eventIndex) => (
                              <div
                                key={eventIndex}
                                className={`w-1.5 h-1.5 rounded-full ${getEventTypeColor(event.type)}`}
                              />
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </Card>

            {/* Selected Date Events */}
            {selectedDate && selectedEvents.length > 0 && (
              <Card className="p-4 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-3 text-card-foreground">
                  {selectedDate.toLocaleDateString('ko-KR', {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  })} 일정
                </h3>
                <div className="space-y-2">
                  {selectedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 p-3 bg-muted/70 dark:bg-muted/50 rounded-lg border border-border/50"
                    >
                      <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`} />
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{event.title}</div>
                        <div className="text-sm text-muted-foreground dark:text-muted-foreground/90">
                          {formatTime(event.time)}
                          {event.description && ` • ${event.description}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {selectedDate && selectedEvents.length === 0 && (
              <Card className="p-4 text-center bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent backdrop-blur-sm">
                <CalendarIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  {selectedDate.toLocaleDateString('ko-KR', {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  })}에는 일정이 없습니다.
                </p>
                <Link href="/schedule/new">
                  <Button variant="outline" className="mt-2">
                    일정 추가하기
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <NavBar activeTab="calendar" />
    </div>
  )
}

export default function CalendarPage() {
  return <CalendarPageContent />
}