"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { BookOpenIcon, ArrowLeftIcon, PlusIcon, SparklesIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
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
  const [expandedReflection, setExpandedReflection] = useState<number | null>(null)

  useEffect(() => {
    fetchReflections()
  }, [])

  if (!session) {
    router.push("/login")
    return null
  }

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

  const formatAiResponse = (response: string) => {
    // 마크다운 포맷 제거 및 섹션별 분리
    const cleaned = response
      .replace(/##\s*/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/^\d+\.\s*/gm, '')
      .trim()

    const sections = cleaned.split('\n\n').filter(section => section.trim())
    
    // 감정 관련 키워드를 찾아서 하이라이트할 섹션 구분
    return sections.map(section => {
      const trimmed = section.trim()
      if (trimmed.includes('공감') || trimmed.includes('인정') || trimmed.includes('마음')) {
        return { type: 'empathy', content: trimmed }
      } else if (trimmed.includes('통찰') || trimmed.includes('관점') || trimmed.includes('생각')) {
        return { type: 'insight', content: trimmed }
      } else if (trimmed.includes('조언') || trimmed.includes('실천') || trimmed.includes('방법')) {
        return { type: 'advice', content: trimmed }
      } else if (trimmed.includes('격려') || trimmed.includes('응원') || trimmed.includes('믿')) {
        return { type: 'encouragement', content: trimmed }
      } else {
        return { type: 'general', content: trimmed }
      }
    })
  }

  const toggleExpanded = (reflectionId: number) => {
    setExpandedReflection(expandedReflection === reflectionId ? null : reflectionId)
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
                    감정: {getEmotionLabel(reflection.emotion)}
                  </div>
                  {reflection.ai_response && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(reflection.id)}
                      className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 h-6 px-2"
                    >
                      <SparklesIcon className="h-3 w-3" />
                      <span>AI 응답</span>
                      {expandedReflection === reflection.id ? (
                        <ChevronUpIcon className="h-3 w-3" />
                      ) : (
                        <ChevronDownIcon className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </div>
                
                {expandedReflection === reflection.id && reflection.ai_response && (
                  <div className="mt-4 pt-4 border-t border-violet-200 dark:border-violet-700">
                    <div className="space-y-4">
                      {/* 사용자 성찰 원문 요약 */}
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{getEmotionEmoji(reflection.emotion)}</span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">나의 성찰</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {reflection.content.length > 200 
                            ? reflection.content.substring(0, 200) + "..." 
                            : reflection.content}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>감정: {getEmotionLabel(reflection.emotion)}</span>
                        </div>
                      </div>

                      {/* AI 상담사 응답 */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <SparklesIcon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                          <span className="text-sm font-medium text-violet-700 dark:text-violet-300">AI 상담사의 따뜻한 응답</span>
                        </div>
                        <div className="space-y-3">
                          {formatAiResponse(reflection.ai_response).map((section, index) => (
                            <div key={index} className={`p-3 rounded-lg leading-relaxed text-sm ${
                              section.type === 'empathy' ? 'bg-pink-50 dark:bg-pink-900/20 border-l-4 border-pink-300 dark:border-pink-700' :
                              section.type === 'insight' ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-300 dark:border-blue-700' :
                              section.type === 'advice' ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-300 dark:border-green-700' :
                              section.type === 'encouragement' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-300 dark:border-yellow-700' :
                              'bg-gray-50 dark:bg-gray-800/50'
                            }`}>
                              <p className="text-gray-700 dark:text-gray-300">
                                {section.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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