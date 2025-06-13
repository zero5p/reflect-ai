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

function CalendarPageContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session])

  useEffect(() => {
    if (!session) {
      router.push("/login")
    }
  }, [session, router])

  if (!session) {
    return <div>Loading...</div>
  }

  const fetchData = async () => {
    try {
      const [eventsResponse, reflectionsResponse] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/reflections')
      ])
      
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json()
        setEvents(Array.isArray(eventsData) ? eventsData : eventsData.events || [])
      } else {
        console.error('Failed to fetch events:', eventsResponse.status)
        setEvents([])
      }
      
      if (reflectionsResponse.ok) {
        const reflectionsData = await reflectionsResponse.json()
        setReflections(Array.isArray(reflectionsData) ? reflectionsData : reflectionsData.reflections || [])
      } else {
        console.error('Failed to fetch reflections:', reflectionsResponse.status)
        setReflections([])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setEvents([])
      setReflections([])
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
    if (!Array.isArray(events)) return []
    const dateString = date.toISOString().split('T')[0]
    return events.filter(event => event?.date === dateString)
  }

  const getReflectionForDate = (date: Date) => {
    if (!Array.isArray(reflections)) return null
    const dateString = date.toISOString().split('T')[0]
    return reflections.find(reflection => 
      reflection?.created_at?.split('T')[0] === dateString
    )
  }

  const getEmotionEmoji = (emotion: string) => {
    const emotions: { [key: string]: string } = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      anxious: '😰',
      excited: '🤩',
      calm: '😌',
      confused: '🤔',
      grateful: '🙏'
    }
    return emotions[emotion] || '😐'
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
                <h2 className="text-lg font-semibold text-foreground">{formatDate(currentDate)}</h2>
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
                  <div key={day} className="text-center text-sm font-semibold text-foreground/80 dark:text-foreground/90 py-2">
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
                  const dayReflection = getReflectionForDate(day)
                  const isToday = day.toDateString() === new Date().toDateString()
                  const isSelected = selectedDate?.toDateString() === day.toDateString()

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`h-12 flex flex-col items-center justify-center rounded-lg text-sm transition-colors relative ${
                        isToday
                          ? 'bg-violet-500 text-white font-semibold'
                          : isSelected
                          ? 'bg-violet-100 dark:bg-violet-800/50 text-violet-700 dark:text-violet-100 font-medium border-2 border-violet-300 dark:border-violet-600'
                          : 'hover:bg-muted text-foreground hover:bg-violet-50 dark:hover:bg-violet-900/30'
                      }`}
                    >
                      <span>{day.getDate()}</span>
                      <div className="absolute bottom-1 flex items-center gap-0.5">
                        {/* 감정 이모지 표시 */}
                        {dayReflection && (
                          <span className="text-xs leading-none">
                            {getEmotionEmoji(dayReflection.emotion)}
                          </span>
                        )}
                        {/* 일정 점 표시 */}
                        {dayEvents.length > 0 && (
                          <div className="flex gap-0.5">
                            {dayEvents.slice(0, 2).map((event, eventIndex) => (
                              <div
                                key={eventIndex}
                                className={`w-1.5 h-1.5 rounded-full ${getEventTypeColor(event.type)}`}
                              />
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            )}
                          </div>
                        )}
                      </div>
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
                      className="flex items-center gap-3 p-3 bg-muted/70 dark:bg-muted/50 rounded-lg border border-border/50"
                    >
                      <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`} />
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{event.title}</div>
                        <div className="text-sm text-muted-foreground dark:text-muted-foreground/90">
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

export default function CalendarPage() {
  return <CalendarPageContent />
}