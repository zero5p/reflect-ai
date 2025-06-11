"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeftIcon, SaveIcon, CalendarIcon, ClockIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NewCalendarEventPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [description, setDescription] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    if (!title || !date || !startTime) {
      alert("제목, 날짜, 시작 시간은 필수 입력 항목입니다.")
      return
    }

    setIsSaving(true)

    // Simulate saving
    setTimeout(() => {
      setIsSaving(false)
      router.push("/calendar")
    }, 1500)
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
          <h2 className="text-sm font-medium text-emerald-900 mb-2">일정 설명 (선택)</h2>
          <Textarea
            placeholder="일정에 대한 추가 정보를 입력하세요"
            className="min-h-[100px] resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Card>

        {/* Save Button */}
        <Button
          className="w-full flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
          onClick={handleSave}
          disabled={isSaving || !title || !date || !startTime}
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              저장 중...
            </>
          ) : (
            <>
              <SaveIcon className="h-4 w-4" />
              일정 저장하기
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
