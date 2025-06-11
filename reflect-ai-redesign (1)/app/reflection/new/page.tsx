"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeftIcon, SaveIcon } from "lucide-react"
import { useRouter } from "next/navigation"

// Emotion options
const emotions = [
  { emoji: "😊", label: "행복" },
  { emoji: "😡", label: "화남" },
  { emoji: "🤔", label: "고민" },
  { emoji: "😢", label: "슬픔" },
  { emoji: "😴", label: "피곤" },
  { emoji: "😎", label: "자신감" },
]

export default function NewReflectionPage() {
  const router = useRouter()
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [reflectionText, setReflectionText] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    if (!selectedEmotion || !reflectionText.trim()) {
      alert("감정과 내용을 모두 입력해주세요.")
      return
    }

    setIsSaving(true)

    // Simulate saving
    setTimeout(() => {
      setIsSaving(false)
      router.push("/reflection")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-violet-100 p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeftIcon className="h-5 w-5 text-violet-700" />
        </Button>
        <h1 className="text-lg font-bold text-violet-900">새 성찰 작성</h1>
        <Button variant="ghost" size="icon" className="invisible">
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 space-y-4">
        {/* Date */}
        <div className="text-sm text-violet-700 font-medium">
          {new Date().toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>

        {/* Emotion Selector */}
        <Card className="p-4">
          <h2 className="text-sm font-medium text-violet-900 mb-3">오늘의 감정</h2>
          <div className="grid grid-cols-6 gap-2">
            {emotions.map((emotion) => (
              <button
                key={emotion.emoji}
                className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                  selectedEmotion === emotion.emoji
                    ? "bg-violet-100 border-2 border-violet-400"
                    : "bg-white border border-violet-100 hover:bg-violet-50"
                }`}
                onClick={() => setSelectedEmotion(emotion.emoji)}
              >
                <span className="text-2xl mb-1">{emotion.emoji}</span>
                <span className="text-xs text-violet-700">{emotion.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Reflection Text */}
        <Card className="p-4">
          <h2 className="text-sm font-medium text-violet-900 mb-3">오늘의 성찰</h2>
          <Textarea
            placeholder="오늘 하루는 어땠나요? 생각과 감정을 자유롭게 기록해보세요."
            className="min-h-[200px] resize-none"
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
          />
        </Card>

        {/* Save Button */}
        <Button
          className="w-full flex items-center gap-2"
          onClick={handleSave}
          disabled={isSaving || !selectedEmotion || !reflectionText.trim()}
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              저장 중...
            </>
          ) : (
            <>
              <SaveIcon className="h-4 w-4" />
              저장하기
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
