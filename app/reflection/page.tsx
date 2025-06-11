"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { BookOpenIcon, ArrowLeftIcon, PlusIcon, SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Reflection {
  id: number
  title: string
  content: string
  emotion: string
  intensity: string
  ai_response?: string
  created_at: string
}

export default function ReflectionPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  if (!session) {
    router.push("/login")
    return null
  }

  useEffect(() => {
    fetchReflections()
  }, [])

  const fetchReflections = async () => {
    try {
      const response = await fetch('/api/reflections')
      if (response.ok) {
        const data = await response.json()
        setReflections(data.reflections || [])
      }
    } catch (error) {
      console.error('Error fetching reflections:', error)
    } finally {
      setIsLoading(false)
    }
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

  const getEmotionLabel = (emotion: string) => {
    const labels: { [key: string]: string } = {
      happy: '기쁨',
      sad: '슬픔',
      angry: '분노',
      anxious: '불안',
      excited: '흥분',
      calm: '평온',
      confused: '혼란',
      grateful: '감사'
    }
    return labels[emotion] || emotion
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
          <BookOpenIcon className="h-6 w-6 text-violet-600" />
          <span className="font-bold text-foreground text-lg">성찰 일기</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 overflow-y-auto mb-16">
        <div className="mb-4">
          <Link href="/reflection/new">
            <Button className="w-full flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              새로운 성찰 작성하기
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <Card className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">성찰 목록을 불러오는 중...</p>
          </Card>
        ) : reflections.length === 0 ? (
          <Card className="p-6 text-center">
            <BookOpenIcon className="h-16 w-16 text-violet-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">성찰 일기 목록</h2>
            <p className="text-muted-foreground mb-4">
              아직 작성된 성찰 일기가 없습니다. 첫 번째 성찰을 시작해보세요!
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {reflections.map((reflection) => (
              <Card key={reflection.id} className="p-4 bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-violet-700 dark:text-violet-300">{reflection.title}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(reflection.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{getEmotionEmoji(reflection.emotion)}</span>
                  <span className="text-sm text-violet-700 dark:text-violet-300 line-clamp-2">
                    {reflection.content.substring(0, 100)}...
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    감정: {getEmotionLabel(reflection.emotion)} | 강도: {reflection.intensity}
                  </div>
                  {reflection.ai_response && (
                    <div className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400">
                      <SparklesIcon className="h-3 w-3" />
                      <span>AI 응답</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <NavBar activeTab="reflection" />
    </div>
  )
}