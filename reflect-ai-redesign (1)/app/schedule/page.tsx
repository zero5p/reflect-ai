"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlusIcon, CalendarIcon, ClockIcon, CheckIcon, XIcon, SparklesIcon } from "lucide-react"
import Link from "next/link"
import { NavBar } from "@/components/nav-bar"
import { AIRecommendation } from "@/components/ai-recommendation"

// Mock schedule data
const scheduleData = [
  {
    id: 1,
    title: "김정희 회의",
    date: "2023년 6월 15일",
    time: "오전 10:30",
    completed: false,
  },
  {
    id: 2,
    title: "프로젝트 기획 미팅",
    date: "2023년 6월 15일",
    time: "오후 2:00",
    completed: true,
  },
  {
    id: 3,
    title: "주간 팀 미팅",
    date: "2023년 6월 16일",
    time: "오전 9:00",
    completed: false,
  },
  {
    id: 4,
    title: "클라이언트 미팅",
    date: "2023년 6월 17일",
    time: "오후 3:30",
    completed: false,
  },
]

export default function SchedulePage() {
  const [schedules, setSchedules] = useState(scheduleData)
  const [showAIRecommendation, setShowAIRecommendation] = useState(false)

  // Toggle completion status
  const toggleCompletion = (id: number) => {
    setSchedules(
      schedules.map((schedule) => (schedule.id === id ? { ...schedule, completed: !schedule.completed } : schedule)),
    )
  }

  // Handle AI recommendation acceptance
  const handleAcceptRecommendation = (recommendation: string) => {
    // In a real app, this would parse the recommendation and create a proper schedule
    const newId = Math.max(...schedules.map((s) => s.id)) + 1
    const newSchedule = {
      id: newId,
      title: recommendation.split(".")[0], // Just use the first sentence as the title
      date: "2023년 6월 20일", // Example date
      time: "오전 10:00", // Example time
      completed: false,
    }

    setSchedules([...schedules, newSchedule])
    setShowAIRecommendation(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/50 to-background dark:from-violet-950/30 dark:to-background flex flex-col">
      {/* Header */}
      <Card className="mx-5 mt-5 mb-4 bg-blue-100/70 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-lg font-bold text-blue-900 dark:text-blue-100">일정 관리</h1>
              <p className="text-xs text-blue-700 dark:text-blue-300">오늘의 일정을 확인하고 관리하세요.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white/80 dark:bg-blue-950/50"
              onClick={() => setShowAIRecommendation(!showAIRecommendation)}
            >
              <SparklesIcon className="h-4 w-4 mr-1 text-blue-500" />
              AI 추천
            </Button>
            <Link href="/calendar/new">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                새 일정
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* AI Recommendation */}
      {showAIRecommendation && (
        <div className="px-5 mb-4">
          <AIRecommendation onAccept={handleAcceptRecommendation} onReject={() => setShowAIRecommendation(false)} />
        </div>
      )}

      {/* Schedule List */}
      <div className="px-5 mb-20 space-y-3">
        <h2 className="text-sm font-medium text-blue-900 dark:text-blue-100 ml-1">다가오는 일정</h2>

        {schedules.filter((s) => !s.completed).length > 0 ? (
          schedules
            .filter((schedule) => !schedule.completed)
            .map((schedule) => (
              <Card key={schedule.id} className="p-4 bg-card">
                <div className="flex items-start">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full border border-blue-200 dark:border-blue-700 mr-3 mt-1"
                    onClick={() => toggleCompletion(schedule.id)}
                  >
                    <CheckIcon className="h-4 w-4 text-blue-400 dark:text-blue-500" />
                  </Button>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{schedule.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <CalendarIcon className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                      <span className="text-xs text-blue-600 dark:text-blue-300">{schedule.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <ClockIcon className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                      <span className="text-xs text-blue-600 dark:text-blue-300">{schedule.time}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
        ) : (
          <div className="text-center py-6 text-blue-500 dark:text-blue-400">다가오는 일정이 없습니다.</div>
        )}

        <h2 className="text-sm font-medium text-blue-900 dark:text-blue-100 ml-1 mt-6">완료된 일정</h2>

        {schedules.filter((s) => s.completed).length > 0 ? (
          schedules
            .filter((schedule) => schedule.completed)
            .map((schedule) => (
              <Card key={schedule.id} className="p-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-start">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 mr-3 mt-1"
                    onClick={() => toggleCompletion(schedule.id)}
                  >
                    <XIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </Button>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground line-through opacity-70">{schedule.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <CalendarIcon className="h-3 w-3 text-blue-500 dark:text-blue-400 opacity-70" />
                      <span className="text-xs text-blue-600 dark:text-blue-300 opacity-70">{schedule.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <ClockIcon className="h-3 w-3 text-blue-500 dark:text-blue-400 opacity-70" />
                      <span className="text-xs text-blue-600 dark:text-blue-300 opacity-70">{schedule.time}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
        ) : (
          <div className="text-center py-6 text-blue-500 dark:text-blue-400">완료된 일정이 없습니다.</div>
        )}
      </div>

      {/* Floating action button */}
      <Link href="/calendar/new" className="fixed bottom-20 right-5">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 shadow-lg"
        >
          <PlusIcon className="h-6 w-6" />
        </Button>
      </Link>

      {/* Bottom Navigation */}
      <NavBar activeTab="schedule" />
    </div>
  )
}
