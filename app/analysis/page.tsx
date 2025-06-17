"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { cachedFetch } from "@/lib/cache"
import { AnimatedPage } from "@/components/page-transition"
import { ArrowLeftIcon, ArrowRightIcon, TrendingUpIcon, CalendarDaysIcon, BrainCircuitIcon } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function AnalysisPage() {
  const { data: session } = useSession()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarData, setCalendarData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)

  // 현재 월의 시작과 끝 날짜 계산
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const today = new Date()

  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.email) {
        setIsLoading(false)
        return
      }

      try {
        // 캘린더 데이터와 통계 동시 로딩
        const [calendarResponse, statsResponse] = await Promise.all([
          cachedFetch(`/api/calendar?month=${currentDate.getMonth() + 1}&year=${currentDate.getFullYear()}`, undefined, 2),
          cachedFetch(`/api/profile/stats?email=${session.user.email}`, undefined, 5)
        ])

        if (calendarResponse.success) {
          setCalendarData(calendarResponse.data)
        }
        if (statsResponse.success) {
          setStats(statsResponse.data)
        }
      } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [session?.user?.email, currentDate])

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // 캘린더 그리드 생성
  const generateCalendarGrid = () => {
    const firstDay = startOfMonth.getDay()
    const daysInMonth = endOfMonth.getDate()
    const grid = []

    // 빈 칸 채우기
    for (let i = 0; i < firstDay; i++) {
      grid.push(null)
    }

    // 날짜 채우기
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dateStr = date.toISOString().split('T')[0]
      const dayData = calendarData.find(item => item.date === dateStr)
      
      grid.push({
        day,
        date: dateStr,
        isToday: date.toDateString() === today.toDateString(),
        reflection: dayData?.reflection,
        emotion: dayData?.emotion,
        events: dayData?.events || []
      })
    }

    return grid
  }

  const getEmotionEmoji = (emotion: string) => {
    switch (emotion) {
      case 'happy': return '😊'
      case 'sad': return '😢'
      case 'angry': return '😠'
      case 'excited': return '😆'
      case 'nervous': return '😰'
      default: return '😐'
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-mumu-cream-light to-mumu-warm dark:from-mumu-cream-dark dark:to-background flex items-center justify-center">
        <Card className="p-8 text-center bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent">
          <h2 className="text-xl font-bold mb-4 text-mumu-brown-dark">로그인이 필요합니다</h2>
          <Link href="/login">
            <Button className="bg-mumu-brown hover:bg-mumu-brown-dark text-mumu-cream">
              로그인하기
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-b from-mumu-cream-light to-mumu-warm dark:from-mumu-cream-dark dark:to-background">
        {/* Header */}
        <header className="flex items-center px-5 py-4 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 backdrop-blur-sm border-b border-mumu-accent">
          <div className="flex items-center gap-2 flex-1">
            <div className="h-8 w-8 rounded-lg bg-mumu-brown flex items-center justify-center">
              <TrendingUpIcon className="w-5 h-5 text-mumu-cream" />
            </div>
            <span className="font-bold text-mumu-brown-dark text-lg">분석</span>
          </div>
          <ThemeToggle />
        </header>

        <main className="px-5 py-6 pb-20">
          {/* 통계 카드들 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="p-4 bg-mumu-accent/60 dark:bg-mumu-brown-light/30 border-mumu-brown-light">
              <div className="flex items-center gap-2 mb-2">
                <BrainCircuitIcon className="w-5 h-5 text-mumu-brown" />
                <span className="text-sm font-medium text-mumu-brown-dark">총 성찰</span>
              </div>
              <div className="text-2xl font-bold text-mumu-brown-dark">
                {isLoading ? "..." : stats?.totalReflections || 0}
              </div>
              <div className="text-xs text-mumu-brown">개의 기록</div>
            </Card>

            <Card className="p-4 bg-mumu-brown-light/40 dark:bg-mumu-brown/30 border-mumu-accent">
              <div className="flex items-center gap-2 mb-2">
                <CalendarDaysIcon className="w-5 h-5 text-mumu-brown" />
                <span className="text-sm font-medium text-mumu-brown-dark">연속 일수</span>
              </div>
              <div className="text-2xl font-bold text-mumu-brown-dark">
                {isLoading ? "..." : stats?.currentStreak || 0}
              </div>
              <div className="text-xs text-mumu-brown">일 연속</div>
            </Card>
          </div>

          {/* 캘린더 */}
          <Card className="p-4 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent backdrop-blur-sm mb-6">
            {/* 월 네비게이션 */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-mumu-accent"
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
              
              <h2 className="text-lg font-bold text-mumu-brown-dark">
                {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
              </h2>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNextMonth}
                className="p-2 hover:bg-mumu-accent"
              >
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                <div key={day} className="text-center text-sm font-medium text-mumu-brown p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* 캘린더 그리드 */}
            <div className="grid grid-cols-7 gap-1">
              {generateCalendarGrid().map((cell, index) => (
                <div
                  key={index}
                  className={`
                    aspect-square flex flex-col items-center justify-center text-sm relative
                    ${cell ? 'hover:bg-mumu-accent/30 rounded-lg cursor-pointer' : ''}
                    ${cell?.isToday ? 'bg-mumu-brown text-mumu-cream rounded-lg' : ''}
                  `}
                >
                  {cell && (
                    <>
                      <span className={`font-medium ${cell.isToday ? 'text-mumu-cream' : 'text-mumu-brown-dark'}`}>
                        {cell.day}
                      </span>
                      {cell.emotion && (
                        <span className="text-xs absolute bottom-0">
                          {getEmotionEmoji(cell.emotion)}
                        </span>
                      )}
                      {cell.events.length > 0 && (
                        <div className="absolute top-0 right-0 w-2 h-2 bg-mumu-brown rounded-full" />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* 무무의 시간여행 - 간격 반복 */}
          <Card className="p-4 bg-gradient-to-r from-mumu-accent/30 to-mumu-brown-light/20 dark:from-mumu-brown/40 dark:to-mumu-brown-dark/30 border-mumu-accent">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6">
                <img 
                  src="/mumu_mascot.png" 
                  alt="무무" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-lg font-bold text-mumu-brown-dark">무무의 시간여행</h2>
              <span className="text-xs text-mumu-brown bg-mumu-cream/50 px-2 py-1 rounded-full">망각곡선 보완</span>
            </div>
            
            <div className="text-sm text-mumu-brown mb-2">
              과거의 나와 현재의 나를 연결해보세요
            </div>
            
            <Link href="/reflection">
              <Button variant="outline" size="sm" className="border-mumu-brown text-mumu-brown hover:bg-mumu-brown hover:text-mumu-cream">
                과거 기록 탐색하기
              </Button>
            </Link>
          </Card>
        </main>

        <NavBar activeTab="analysis" />
      </div>
    </AnimatedPage>
  )
}