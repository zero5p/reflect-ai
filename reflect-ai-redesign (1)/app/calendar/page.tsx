"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, CalendarIcon } from "lucide-react"
import Link from "next/link"
import { NavBar } from "@/components/nav-bar"

// Days of the week in Korean
const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"]

// Mock data for calendar entries with emotions
const calendarData = {
  1: "😊",
  2: "🤔",
  3: "😄",
  9: "😉",
  12: "😊",
  15: "😐",
  16: "😊",
  19: "😊",
  21: "😊",
  28: "😕",
  30: "😐",
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(3) // April
  const [currentYear, setCurrentYear] = useState(2025)

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

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 bg-white/50 rounded-lg"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const hasEmotion = day in calendarData

      days.push(
        <div
          key={`day-${day}`}
          className={`h-12 flex flex-col items-center justify-center rounded-lg ${
            hasEmotion ? "border border-violet-200 bg-white" : "bg-white/50"
          }`}
        >
          <div className="text-sm font-medium text-violet-900">{day}</div>
          {hasEmotion && <div className="text-lg">{calendarData[day as keyof typeof calendarData]}</div>}
        </div>,
      )
    }

    return days
  }

  // Handle month navigation
  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Get month name in Korean
  const getMonthName = (month: number) => {
    return `${month}월`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex flex-col">
      {/* Header */}
      <Card className="mx-5 mt-5 mb-4 bg-emerald-100/70 border-emerald-200">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-6 w-6 text-emerald-600" />
            <div>
              <h1 className="text-lg font-bold text-emerald-900">캘린더</h1>
              <p className="text-xs text-emerald-700">일정과 감정을 기록, 나만의 성장을 추적해보세요.</p>
            </div>
          </div>
          <Link href="/calendar/new">
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
              새 일정
            </Button>
          </Link>
        </div>
      </Card>

      {/* Calendar */}
      <Card className="mx-5 mb-20">
        <div className="p-4">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeftIcon className="h-5 w-5 text-emerald-500" />
            </Button>
            <h2 className="text-lg font-semibold text-violet-900">
              {currentYear}년 {getMonthName(currentMonth)}
            </h2>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRightIcon className="h-5 w-5 text-emerald-500" />
            </Button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {daysOfWeek.map((day, index) => (
              <div key={day} className="text-center text-xs font-medium text-violet-700">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">{generateCalendarDays()}</div>
        </div>
      </Card>

      {/* Floating action button */}
      <Link href="/calendar/new" className="fixed bottom-20 right-5">
        <Button size="icon" className="h-12 w-12 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-lg">
          <PlusIcon className="h-6 w-6" />
        </Button>
      </Link>

      {/* Bottom Navigation */}
      <NavBar activeTab="calendar" />
    </div>
  )
}
