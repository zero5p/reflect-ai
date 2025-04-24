"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeftIcon, SaveIcon, CalendarIcon, ClockIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { createCalendarEvent } from "@/app/lib/api"

/**
 * 새 일정 추가 페이지
 * - 필수 항목 검증, 에러/로딩 안내, 실제 API 연동
 * - 사용자 입력값 실시간 검증 및 UX 강화
 */
export default function NewCalendarEventPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [description, setDescription] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 입력값 검증
  const validate = () => {
    if (!title.trim()) return "제목을 입력하세요."
    if (!date) return "날짜를 선택하세요."
    if (!startTime) return "시작 시간을 선택하세요."
    return null
  }

  // 저장 핸들러
  const handleSave = async () => {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setIsSaving(true)
    setError(null)
    try {
      await createCalendarEvent({
        title,
        date,
        startTime,
        endTime: endTime || undefined,
        category: undefined,
        reflectionId: undefined,
        isRecommended: false,
      })
      setIsSaving(false)
      router.push("/calendar")
    } catch {
      setIsSaving(false)
      setError("일정 저장에 실패했습니다. 다시 시도해 주세요.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-violet-100 p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeftIcon className="h-5 w-5 text-emerald-700" />
        </Button>
        <h1 className="text-lg font-bold text-emerald-900">새 일정 추가</h1>
        <Button variant="ghost" size="icon" className="invisible">
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 space-y-4">
        {/* Title */}
        <Card className="p-4">
          <h2 className="text-sm font-medium text-emerald-900 mb-2">일정 제목</h2>
          <Input placeholder="일정 제목을 입력하세요" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Card>

        {/* Date and Time */}
        <Card className="p-4">
          <h2 className="text-sm font-medium text-emerald-900 mb-3">날짜 및 시간</h2>

          <div className="flex items-center gap-2 mb-3">
            <CalendarIcon className="h-4 w-4 text-emerald-600" />
            <h3 className="text-xs font-medium text-emerald-800">날짜</h3>
          </div>
          <Input type="date" className="mb-4" value={date} onChange={(e) => setDate(e.target.value)} />

          <div className="flex items-center gap-2 mb-3">
            <ClockIcon className="h-4 w-4 text-emerald-600" />
            <h3 className="text-xs font-medium text-emerald-800">시간</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-emerald-700 mb-1 block">시작 시간</label>
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-emerald-700 mb-1 block">종료 시간 (선택)</label>
              <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
        </Card>

        {/* Description */}
        <Card className="p-4">
          <h2 className="text-sm font-medium text-emerald-900 mb-2">설명 (선택)</h2>
          <Textarea placeholder="일정에 대한 설명을 입력하세요" value={description} onChange={(e) => setDescription(e.target.value)} />
        </Card>
        {error && <div className="text-red-500 text-sm text-center pt-2">{error}</div>}
      </div>

      {/* Save Button */}
      <div className="p-5">
        <Button onClick={handleSave} disabled={isSaving} className="w-full bg-emerald-600 hover:bg-emerald-700">
          <SaveIcon className="h-4 w-4 mr-2" /> 저장하기
        </Button>
      </div>
    </div>
  )
}
