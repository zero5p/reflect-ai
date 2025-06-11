"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { BookOpenIcon, ArrowLeftIcon, SaveIcon, SparklesIcon, HomeIcon, CalendarPlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"

export default function NewReflectionPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [emotion, setEmotion] = useState("")
  const [intensity, setIntensity] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState("")
  const [showAiResponse, setShowAiResponse] = useState(false)
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false)

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
          emotion,
          intensity,
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

  const handleGenerateSchedule = async () => {
    setIsGeneratingSchedule(true)
    try {
      const response = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    }
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
          <Card className="p-6 bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 border-violet-200 dark:border-violet-800">
            <div className="flex items-center gap-2 mb-4">
              <SparklesIcon className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-bold text-violet-700 dark:text-violet-300">당신의 성찰에 대한 AI 응답</h2>
            </div>
            
            <div className="space-y-4 text-sm leading-relaxed">
              {aiResponse.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="text-foreground">{paragraph}</p>
                )
              ))}
            </div>

            <div className="space-y-3 mt-6">
              <Button
                onClick={handleGenerateSchedule}
                disabled={isGeneratingSchedule}
                className="w-full flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                <CalendarPlusIcon className="h-4 w-4" />
                {isGeneratingSchedule ? "AI 일정 추천 생성 중..." : "성찰 기반 AI 일정 추천 받기"}
              </Button>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => router.push("/reflection")}
                  variant="outline"
                  className="flex-1"
                >
                  성찰 목록으로
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="flex-1"
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
        <Card className="p-6">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>감정</Label>
                <Select value={emotion} onValueChange={setEmotion}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="감정을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="happy">😊 기쁨</SelectItem>
                    <SelectItem value="sad">😢 슬픔</SelectItem>
                    <SelectItem value="angry">😠 분노</SelectItem>
                    <SelectItem value="anxious">😰 불안</SelectItem>
                    <SelectItem value="excited">🤩 흥분</SelectItem>
                    <SelectItem value="calm">😌 평온</SelectItem>
                    <SelectItem value="confused">🤔 혼란</SelectItem>
                    <SelectItem value="grateful">🙏 감사</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>강도</Label>
                <Select value={intensity} onValueChange={setIntensity}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="강도를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">낮음</SelectItem>
                    <SelectItem value="medium">보통</SelectItem>
                    <SelectItem value="high">높음</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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