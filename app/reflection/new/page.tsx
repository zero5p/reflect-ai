"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { BookOpenIcon, ArrowLeftIcon, SaveIcon, SparklesIcon, HomeIcon, CalendarPlusIcon, HeartIcon, StarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import { getRandomQuote } from "@/lib/quotes"

export default function NewReflectionPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState("")
  const [showAiResponse, setShowAiResponse] = useState(false)
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false)
  const [showCustomRequest, setShowCustomRequest] = useState(false)
  const [customRequest, setCustomRequest] = useState("")
  const [currentQuote, setCurrentQuote] = useState(getRandomQuote())

  // 로딩 시작 시 랜덤 명언 선택
  useEffect(() => {
    if (isLoading) {
      setCurrentQuote(getRandomQuote())
    }
  }, [isLoading])

  if (!session) {
    router.push("/login")
    return null
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/reflections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        if (data.aiResponse) {
          setAiResponse(data.aiResponse)
          setShowAiResponse(true)
        } else {
          alert(data.message || "성찰이 저장되었습니다!")
          router.push("/reflection")
        }
      } else {
        throw new Error(data.error || "저장에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error saving reflection:", error)
      alert("저장 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateSchedule = async (userRequest?: string) => {
    setIsGeneratingSchedule(true)
    try {
      const response = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userRequest: userRequest || customRequest
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // 일정 페이지로 이동하면서 추천 데이터 전달
        sessionStorage.setItem('aiRecommendations', JSON.stringify(data.recommendations))
        router.push("/schedule/new?from=ai")
      } else {
        throw new Error(data.error || "일정 추천 생성에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error generating schedule recommendations:", error)
      alert("일정 추천 생성 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsGeneratingSchedule(false)
      setShowCustomRequest(false)
      setCustomRequest("")
    }
  }

  // 로딩 화면
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50/50 to-background dark:from-violet-950/30 dark:to-background flex flex-col items-center justify-center px-5">
        <Card className="p-8 max-w-md w-full text-center bg-card dark:bg-card border-border bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 border-violet-200 dark:border-violet-800">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-200 dark:border-violet-800"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-500 border-t-transparent absolute top-0"></div>
              <SparklesIcon className="h-6 w-6 text-violet-600 absolute top-5 left-5" />
            </div>
          </div>
          
          <h2 className="text-lg font-bold text-violet-700 dark:text-violet-300 mb-2">
            AI가 당신의 마음을 분석하고 있습니다
          </h2>
          <p className="text-sm text-violet-600 dark:text-violet-400 mb-6">
            감정을 파악하고 맞춤형 상담을 준비하는 중...
          </p>

          <div className="bg-white/70 dark:bg-gray-700/80 rounded-lg p-4 min-h-[120px] flex flex-col justify-center">
            <div className="flex items-center justify-center mb-3">
              <HeartIcon className="h-5 w-5 text-pink-500 mr-2" />
              <StarIcon className="h-4 w-4 text-yellow-500" />
            </div>
            <blockquote className="text-sm text-gray-700 dark:text-gray-300 italic text-center leading-relaxed">
              "{currentQuote.text}"
            </blockquote>
            <cite className="text-xs text-gray-500 dark:text-gray-400 mt-3 block">
              - {currentQuote.author}
            </cite>
          </div>
        </Card>
      </div>
    )
  }

  if (showAiResponse) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50/50 to-background dark:from-violet-950/30 dark:to-background flex flex-col">
        {/* Header */}
        <header className="flex items-center px-5 py-4 bg-background border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className="mr-2"
          >
            <HomeIcon className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <SparklesIcon className="h-6 w-6 text-violet-600" />
            <span className="font-bold text-foreground text-lg">AI 성찰 응답</span>
          </div>
          <ThemeToggle />
        </header>

        {/* AI Response */}
        <main className="flex-1 px-5 py-6 overflow-y-auto">
          <Card className="p-6 bg-card dark:bg-card border-border bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 border-violet-200 dark:border-violet-800">
            <div className="flex items-center gap-2 mb-4">
              <SparklesIcon className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-bold text-card-foreground text-violet-700 dark:text-violet-300">당신의 성찰에 대한 AI 응답</h2>
            </div>
            
            <div className="space-y-4 text-sm leading-relaxed">
              {aiResponse.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="text-card-foreground">{paragraph}</p>
                )
              ))}
            </div>

            <div className="space-y-3 mt-6">
              {!showCustomRequest ? (
                <div className="space-y-3">
                  <Button
                    onClick={() => handleGenerateSchedule()}
                    disabled={isGeneratingSchedule}
                    className="w-full flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                  >
                    {isGeneratingSchedule ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        AI 일정 추천 생성 중...
                      </>
                    ) : (
                      <>
                        <CalendarPlusIcon className="h-4 w-4" />
                        성찰 기반 AI 일정 추천 받기
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => setShowCustomRequest(true)}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                    disabled={isGeneratingSchedule}
                  >
                    <SparklesIcon className="h-4 w-4" />
                    맞춤형 AI 일정 추천 받기
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 p-4 bg-blue-50 dark:bg-gray-700/50 rounded-lg border border-blue-200 dark:border-gray-600">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-blue-700 dark:text-blue-300">어떤 일정을 원하시나요?</h3>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    구체적으로 설명해주시면 성찰 내용과 함께 분석하여 더 정확한 추천을 드릴 수 있습니다.
                  </p>
                  <Textarea
                    placeholder="예: 운동하는 습관을 만들고 싶어요, 새로운 취미를 시작하고 싶어요, 스트레스 관리 방법을 배우고 싶어요..."
                    value={customRequest}
                    onChange={(e) => setCustomRequest(e.target.value)}
                    rows={3}
                    className="w-full"
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setShowCustomRequest(false)
                        setCustomRequest("")
                      }}
                      variant="outline"
                      className="flex-1"
                      disabled={isGeneratingSchedule}
                    >
                      취소
                    </Button>
                    <Button
                      onClick={() => handleGenerateSchedule()}
                      disabled={isGeneratingSchedule || !customRequest.trim()}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {isGeneratingSchedule ? "추천 생성 중..." : "AI 추천 받기"}
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push("/reflection")}
                  variant="outline"
                  className="flex-1"
                  disabled={isGeneratingSchedule}
                >
                  성찰 목록으로
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="flex-1"
                  disabled={isGeneratingSchedule}
                >
                  홈으로
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    )
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
          <span className="font-bold text-foreground text-lg">새로운 성찰</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 overflow-y-auto">
        <Card className="p-6 bg-card dark:bg-card border-border">
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                placeholder="오늘의 성찰 제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                placeholder="오늘 어떤 일이 있었나요? 어떤 감정을 느꼈나요? 자유롭게 작성해보세요."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-2 min-h-[200px]"
              />
            </div>

            <div className="bg-blue-50 dark:bg-gray-700/50 rounded-lg p-4 border border-blue-200 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI 감정 분석</span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                AI가 당신의 성찰 내용을 분석하여 감정과 강도를 자동으로 파악하고 맞춤형 상담을 제공합니다.
              </p>
            </div>

            <Button 
              onClick={handleSave} 
              className="w-full flex items-center gap-2"
              disabled={isLoading}
            >
              <SaveIcon className="h-4 w-4" />
              {isLoading ? "저장 중..." : "성찰 저장하기"}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}