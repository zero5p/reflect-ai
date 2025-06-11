"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { BookOpenIcon, ArrowLeftIcon, SaveIcon } from "lucide-react"
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

  if (!session) {
    router.push("/login")
    return null
  }

  const handleSave = () => {
    // TODO: 실제 저장 로직 구현
    alert("성찰이 저장되었습니다!")
    router.push("/reflection")
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

            <Button onClick={handleSave} className="w-full flex items-center gap-2">
              <SaveIcon className="h-4 w-4" />
              성찰 저장하기
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}