"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react"
import Link from "next/link"
import { NavBar } from "@/components/nav-bar"
import { fetchCalendarEvents } from "@/app/lib/api"

// Days of the week in Korean
const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"]

interface CalendarEvent {
  id: string
  date: string
  emotion?: string
  title?: string
  startTime?: string
  endTime?: string
}

/**
 * 캘린더 페이지 - 월별 일정 및 감정 이모지 표시
 * - 실제 API에서 데이터를 불러옴
 * - 로딩/에러/빈 데이터 처리
 */
export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(3) // April
  const [currentYear] = useState(2025)
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch events for the current month
  useEffect(() => {
    setLoading(true)
    fetchCalendarEvents()
      .then((data) => {
        setCalendarEvents(data)
        setLoading(false)
      })
      .catch(() => {
        setError("일정 데이터를 불러오지 못했습니다. 새로고침 해주세요.")
        setLoading(false)
      })
  }, [currentMonth])

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  }

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)

  // Map events by day
  const eventsByDay: Record<number, CalendarEvent[]> = {}
  calendarEvents.forEach(ev => {
    const day = Number(ev.date.split("-")[2])
    if (!eventsByDay[day]) eventsByDay[day] = []
    eventsByDay[day].push(ev)
  })

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 bg-white/50 rounded-lg"></div>)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const events = eventsByDay[day] || []
      const emotion = events[0]?.emotion
      days.push(
        <div
          key={`day-${day}`}
          className={`h-12 flex flex-col items-center justify-center rounded-lg ${emotion ? "bg-emerald-100/70 border border-emerald-200" : "bg-white/50"}`}
        >
          <span className="font-semibold text-emerald-900">{day}</span>
          {emotion && <span className="text-xl">{emotion}</span>}
        </div>
      )
    }
    return days
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
      {/* Header */}
      <Card className="mx-5 mt-5 mb-4 bg-emerald-100/70 border-emerald-200">
        <div className="p-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(m => m === 1 ? 12 : m - 1)}>
            <ChevronLeftIcon className="h-5 w-5 text-emerald-700" />
          </Button>
          <div className="text-lg font-bold text-emerald-900">
            {currentYear}년 {currentMonth}월
          </div>
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(m => m === 12 ? 1 : m + 1)}>
            <ChevronRightIcon className="h-5 w-5 text-emerald-700" />
          </Button>
        </div>
      </Card>

      {/* Calendar grid */}
      <div className="mx-5 mb-4 bg-white/60 rounded-lg shadow p-4">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {daysOfWeek.map((d) => (
            <div key={d} className="text-xs font-bold text-emerald-700 text-center">
              {d}
            </div>
          ))}
        </div>
        {loading ? (
          <div className="text-center py-8 text-emerald-500">불러오는 중...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : calendarEvents.length === 0 ? (
          <div className="text-center py-8 text-emerald-400">등록된 일정이 없습니다.</div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {generateCalendarDays()}
          </div>
        )}
      </div>

      {/* Floating action button */}
      <Link href="/calendar/new" className="fixed bottom-20 right-5">
        <Button size="icon" className="h-12 w-12 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg">
          <PlusIcon className="h-6 w-6" />
        </Button>
      </Link>

      {/* Bottom Navigation */}
      <NavBar activeTab="calendar" />
    </div>
  )
}
