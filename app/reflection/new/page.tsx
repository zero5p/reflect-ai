"use client"

import { useState, useEffect, Suspense } from "react"
import { useSession } from "next-auth/react"
import { BookOpenIcon, ArrowLeftIcon, SaveIcon, SparklesIcon, HomeIcon, CalendarPlusIcon, HeartIcon, StarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter, useSearchParams } from "next/navigation"
import { getRandomQuote } from "@/lib/quotes"

function NewReflectionContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState("")
  const [showAiResponse, setShowAiResponse] = useState(false)
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false)
  const [showCustomRequest, setShowCustomRequest] = useState(false)
  const [customRequest, setCustomRequest] = useState("")
  const [currentQuote, setCurrentQuote] = useState(getRandomQuote())
  const [errorMessage, setErrorMessage] = useState("")
  const [retryCount, setRetryCount] = useState(0)
  const [selectedDate, setSelectedDate] = useState<string>("")

  // URL에서 날짜 파라미터 처리
  useEffect(() => {
    const dateParam = searchParams.get('date')
    if (dateParam) {
      setSelectedDate(dateParam)
      // 날짜에 따른 기본 제목 설정
      const date = new Date(dateParam)
      const dateStr = date.toLocaleDateString('ko-KR', { 
        month: 'long', 
        day: 'numeric' 
      })
      setTitle(`${dateStr}의 하루`)
    }
  }, [searchParams])

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

  const handleSave = async (retry = false) => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.")
      return
    }

    if (!retry) {
      setRetryCount(0)
      setErrorMessage("")
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
        if (data.aiResponse && !data.aiResponse.includes("실패")) {
          setAiResponse(data.aiResponse)
          setShowAiResponse(true)
        } else if (data.aiResponse && data.aiResponse.includes("실패")) {
          // AI 분석은 실패했지만 성찰은 저장됨
          setErrorMessage(data.aiResponse)
          // 3초 후 성찰 목록으로 이동
          setTimeout(() => {
            router.push("/reflection")
          }, 3000)
        } else {
          alert(data.message || "성찰이 저장되었습니다!")
          router.push("/reflection")
        }
      } else {
        throw new Error(data.error || data.details || "저장에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error saving reflection:", error)
      const errorMsg = error instanceof Error ? error.message : "저장 중 오류가 발생했습니다."
      
      // 네트워크 에러나 일시적 오류인 경우 재시도 제안
      if (errorMsg.includes("network") || errorMsg.includes("fetch") || errorMsg.includes("잠시 후")) {
        setErrorMessage(`${errorMsg} (재시도 ${retryCount + 1}/3)`)
        if (retryCount < 2) {
          setRetryCount(prev => prev + 1)
        }
      } else {
        setErrorMessage(errorMsg)
        alert(errorMsg)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    handleSave(true)
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
      <div className="min-h-screen bg-gradient-to-b from-mumu-cream-light to-mumu-warm dark:from-mumu-cream-dark dark:to-background flex flex-col items-center justify-center px-5">
        <Card className="p-8 max-w-md w-full text-center bg-mumu-cream/90 dark:bg-mumu-cream-dark/90 border-mumu-accent backdrop-blur-sm">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              {/* 무무 마스코트 */}
              <div className="w-20 h-20 mb-4 animate-mumu-thinking">
                <img 
                  src="/mumu_mascot.png" 
                  alt="무무가 생각하고 있어요" 
                  className="w-full h-full object-contain filter drop-shadow-lg"
                />
              </div>
              {/* 사고 버블 애니메이션 */}
              <div className="absolute -top-2 -right-2 animate-pulse">
                <div className="w-3 h-3 bg-mumu-brown rounded-full opacity-60"></div>
              </div>
              <div className="absolute -top-4 -right-6 animate-pulse delay-300">
                <div className="w-2 h-2 bg-mumu-brown rounded-full opacity-40"></div>
              </div>
            </div>
          </div>
          
          <h2 className="text-lg font-bold text-mumu-brown-dark mb-2">
            무무가 당신의 마음을 분석하고 있어요
          </h2>
          <p className="text-sm text-mumu-brown mb-6">
            감정을 읽고 따뜻한 조언을 준비하는 중...
          </p>

          <div className="bg-mumu-cream-light/80 backdrop-blur-sm rounded-lg p-4 min-h-[120px] flex flex-col justify-center border border-mumu-accent">
            <div className="flex items-center justify-center mb-3">
              <HeartIcon className="h-5 w-5 text-mumu-brown mr-2" />
              <StarIcon className="h-4 w-4 text-mumu-brown-light" />
            </div>
            <blockquote className="text-sm text-mumu-brown-dark italic text-center leading-relaxed">
              "{currentQuote.text}"
            </blockquote>
            <cite className="text-xs text-mumu-brown mt-3 block">
              - {currentQuote.author}
            </cite>
          </div>

          {/* 로딩 진행 표시 */}
          <div className="mt-4 w-full bg-mumu-accent rounded-full h-2">
            <div className="bg-mumu-brown h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </Card>
      </div>
    )
  }

  if (showAiResponse) {
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
            onClick={() => router.push("/")}
            className="mr-2"
          >
            <HomeIcon className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <div className="h-8 w-8 rounded-lg bg-mumu-brown flex items-center justify-center">
              <img 
                src="/mumu_mascot.png" 
                alt="무무" 
                className="w-6 h-6 object-contain"
              />
            </div>
            <span className="font-bold text-mumu-brown-dark text-lg">AI 성찰 응답</span>
          </div>
          <ThemeToggle />
        </header>

        {/* AI Response */}
        <main className="flex-1 px-5 py-6 overflow-y-auto">
          <Card className="p-6 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <SparklesIcon className="h-5 w-5 text-mumu-brown-dark" />
              <h2 className="text-lg font-bold text-mumu-brown-dark">당신의 성찰에 대한 AI 응답</h2>
            </div>
            
            <div className="space-y-4 text-sm leading-relaxed">
              {aiResponse.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="text-mumu-brown-dark">{paragraph}</p>
                )
              ))}
            </div>

            <div className="space-y-3 mt-6">
              {!showCustomRequest ? (
                <div className="space-y-3">
                  <Button
                    onClick={() => handleGenerateSchedule()}
                    disabled={isGeneratingSchedule}
                    className="w-full flex items-center gap-2 bg-mumu-brown hover:bg-mumu-brown-dark text-mumu-cream"
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
          <span className="font-bold text-mumu-brown-dark text-lg">새로운 성찰</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 overflow-y-auto">
        <Card className="p-6 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent backdrop-blur-sm">
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

            <div className="bg-mumu-accent/50 dark:bg-mumu-brown/20 rounded-lg p-4 border border-mumu-brown-light">
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="h-5 w-5 text-mumu-brown-dark" />
                <span className="text-sm font-medium text-mumu-brown-dark">AI 감정 분석</span>
              </div>
              <p className="text-xs text-mumu-brown">
                AI가 당신의 성찰 내용을 분석하여 감정과 강도를 자동으로 파악하고 맞춤형 상담을 제공합니다.
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-1">저장 중 문제가 발생했습니다</p>
                    <p className="text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
                  </div>
                </div>
                {retryCount < 2 && errorMessage.includes("재시도") && (
                  <div className="mt-3 flex gap-2">
                    <Button
                      onClick={handleRetry}
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-700 hover:bg-red-50"
                    >
                      다시 시도
                    </Button>
                    <Button
                      onClick={() => setErrorMessage("")}
                      size="sm"
                      variant="ghost"
                      className="text-red-600"
                    >
                      닫기
                    </Button>
                  </div>
                )}
                {errorMessage.includes("실패") && !errorMessage.includes("재시도") && (
                  <div className="mt-3">
                    <p className="text-xs text-red-500 dark:text-red-400">성찰은 저장되었습니다. 3초 후 성찰 목록으로 이동합니다...</p>
                  </div>
                )}
              </div>
            )}

            <Button 
              onClick={() => handleSave()} 
              className="w-full flex items-center gap-2 bg-mumu-brown hover:bg-mumu-brown-dark text-mumu-cream"
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

export default function NewReflectionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-mumu-cream-light to-mumu-warm dark:from-mumu-cream-dark dark:to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <img src="/mumu_mascot.png" alt="무무" className="w-full h-full object-contain animate-spin" />
          </div>
          <p className="text-mumu-brown">로딩 중...</p>
        </div>
      </div>
    }>
      <NewReflectionContent />
    </Suspense>
  )
}