"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { CalendarIcon, ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  type: string
  user_email: string
  created_at: string
}

interface Reflection {
  id: number
  title: string
  content: string
  emotion: string
  intensity: string
  created_at: string
}

export default function CalendarPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  if (!session) {
    router.push("/login")
    return null
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return events.filter(event => event.date === dateString)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5)
  }

  const getEventTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      personal: 'bg-green-500',
      work: 'bg-blue-500',
      health: 'bg-red-500',
      study: 'bg-purple-500',
      social: 'bg-yellow-500',
      ai_recommended: 'bg-amber-500'
    }
    return colors[type] || 'bg-gray-500'
  }

  const days = getDaysInMonth(currentDate)
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []

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
          <CalendarIcon className="h-6 w-6 text-violet-600" />
          <span className="font-bold text-foreground text-lg">캘린더</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 overflow-y-auto mb-16">
        {isLoading ? (
          <Card className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">캘린더를 불러오는 중...</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Calendar Header */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold">{formatDate(currentDate)}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  if (!day) {
                    return <div key={index} className="h-12"></div>
                  }

                  const dayEvents = getEventsForDate(day)
                  const isToday = day.toDateString() === new Date().toDateString()
                  const isSelected = selectedDate?.toDateString() === day.toDateString()

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`h-12 flex flex-col items-center justify-center rounded-lg text-sm transition-colors relative ${
                        isToday
                          ? 'bg-violet-500 text-white'
                          : isSelected
                          ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <span>{day.getDate()}</span>
                      {dayEvents.length > 0 && (
                        <div className="absolute bottom-1 flex gap-0.5">
                          {dayEvents.slice(0, 3).map((event, eventIndex) => (
                            <div
                              key={eventIndex}
                              className={`w-1.5 h-1.5 rounded-full ${getEventTypeColor(event.type)}`}
                            />
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          )}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </Card>

            {/* Selected Date Events */}
            {selectedDate && selectedEvents.length > 0 && (
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-3">
                  {selectedDate.toLocaleDateString('ko-KR', {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  })} 일정
                </h3>
                <div className="space-y-2">
                  {selectedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                    >
                      <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`} />
                      <div className="flex-1">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatTime(event.time)}
                          {event.description && ` • ${event.description}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {selectedDate && selectedEvents.length === 0 && (
              <Card className="p-4 text-center">
                <CalendarIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  {selectedDate.toLocaleDateString('ko-KR', {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  })}에는 일정이 없습니다.
                </p>
                <Link href="/schedule/new">
                  <Button variant="outline" className="mt-2">
                    일정 추가하기
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <NavBar activeTab="calendar" />
    </div>
  )
}