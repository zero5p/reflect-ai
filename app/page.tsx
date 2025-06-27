"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon, CalendarDaysIcon, BrainCircuitIcon, TargetIcon, BookOpenIcon, CheckCircleIcon, CircleIcon } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function HomePage() {
  const { data: session, status } = useSession()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarData, setCalendarData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [recentGoals, setRecentGoals] = useState<any[]>([])
  const [recentReflections, setRecentReflections] = useState<any[]>([])
  const [dailyTasks, setDailyTasks] = useState<any[]>([])
  const [loadingTasks, setLoadingTasks] = useState<Set<number>>(new Set())

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

      setIsLoading(true)
      console.log('홈 페이지 데이터 로드 시작...', session.user.email)

      try {
        const monthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`
        
        // 모든 데이터 병렬 로딩
        const [calendarResponse, statsResponse, goalsResponse, reflectionsResponse, dailyTasksResponse] = await Promise.all([
          fetch(`/api/calendar?month=${monthStr}`).then(res => res.json()),
          fetch(`/api/profile/stats?email=${session.user.email}`).then(res => res.json()),
          fetch('/api/goals').then(res => res.json()),
          fetch('/api/reflections').then(res => res.json()),
          fetch('/api/daily-tasks').then(res => res.json())
        ])

        console.log('API 응답 상태:', {
          calendar: calendarResponse.success,
          stats: statsResponse.success,
          goals: goalsResponse.success,
          reflections: reflectionsResponse.success,
          dailyTasks: dailyTasksResponse.success
        })

        if (calendarResponse.success) {
          const calendarDataFormatted = processCalendarData(calendarResponse.data)
          setCalendarData(calendarDataFormatted)
        } else {
          console.error('캘린더 데이터 로드 실패:', calendarResponse)
        }
        
        if (statsResponse.success) {
          setStats(statsResponse.data)
        } else {
          console.error('통계 데이터 로드 실패:', statsResponse)
        }

        if (goalsResponse.success) {
          setRecentGoals(goalsResponse.data.slice(0, 3)) // 최근 3개
        } else {
          console.error('목표 데이터 로드 실패:', goalsResponse)
          setRecentGoals([]) // 빈 배열로 설정
        }

        if (reflectionsResponse.success) {
          setRecentReflections(reflectionsResponse.data.slice(0, 3)) // 최근 3개
        } else {
          console.error('성찰 데이터 로드 실패:', reflectionsResponse)
          setRecentReflections([]) // 빈 배열로 설정
        }

        if (dailyTasksResponse.success) {
          setDailyTasks(dailyTasksResponse.data || [])
        } else {
          console.error('일일 할 일 데이터 로드 실패:', dailyTasksResponse)
          setDailyTasks([])
        }

      } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.email) {
      fetchData()
    }
  }, [session?.user?.email, currentDate, status])

  // 캘린더 API 데이터를 페이지 형식으로 변환
  const processCalendarData = (data: any) => {
    const dateMap = new Map()
    
    // 성찰 데이터 처리
    if (data.reflections) {
      data.reflections.forEach((reflection: any) => {
        const date = new Date(reflection.created_at).toISOString().split('T')[0]
        if (!dateMap.has(date)) {
          dateMap.set(date, { date, events: [] })
        }
        const dayData = dateMap.get(date)
        dayData.reflection = reflection.title
        dayData.emotion = reflection.emotion
      })
    }
    
    // 이벤트 데이터 처리
    if (data.events) {
      data.events.forEach((event: any) => {
        if (!dateMap.has(event.date)) {
          dateMap.set(event.date, { date: event.date, events: [] })
        }
        const dayData = dateMap.get(event.date)
        dayData.events.push(event)
      })
    }
    
    return Array.from(dateMap.values())
  }

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

  const toggleDailyTask = useCallback(async (taskId: number, isCompleted: boolean) => {
    // 이미 처리 중인 태스크는 무시
    if (loadingTasks.has(taskId)) return
    
    setLoadingTasks(prev => new Set([...prev, taskId]))
    
    // 낙관적 업데이트 - UI 즉시 변경
    const newStatus = !isCompleted
    setDailyTasks(prev => {
      const taskIndex = prev.findIndex(task => task.id === taskId)
      if (taskIndex === -1) return prev
      
      const newTasks = [...prev]
      newTasks[taskIndex] = { ...newTasks[taskIndex], is_completed: newStatus }
      return newTasks
    })
    
    try {
      const response = await fetch('/api/daily-tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          isCompleted: newStatus
        })
      })
      
      if (!response.ok) {
        // 실패 시 상태 롤백
        setDailyTasks(prev => {
          const taskIndex = prev.findIndex(task => task.id === taskId)
          if (taskIndex === -1) return prev
          
          const newTasks = [...prev]
          newTasks[taskIndex] = { ...newTasks[taskIndex], is_completed: isCompleted }
          return newTasks
        })
        console.error('API 응답 실패:', response.status)
      }
    } catch (error) {
      // 에러 시 상태 롤백
      setDailyTasks(prev => {
        const taskIndex = prev.findIndex(task => task.id === taskId)
        if (taskIndex === -1) return prev
        
        const newTasks = [...prev]
        newTasks[taskIndex] = { ...newTasks[taskIndex], is_completed: isCompleted }
        return newTasks
      })
      console.error('할 일 상태 업데이트 실패:', error)
    } finally {
      setLoadingTasks(prev => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })
    }
  }, [loadingTasks])

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

  // 로딩 중일 때
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-mumu-cream-light to-mumu-warm dark:from-mumu-cream-dark dark:to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <img src="/mumu_mascot.png" alt="무무" className="w-full h-full object-contain animate-spin-reverse" />
          </div>
          <p className="text-mumu-brown">로딩 중...</p>
        </div>
      </div>
    )
  }

  // 로그인되지 않았을 때
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-mumu-cream-light to-mumu-warm dark:from-mumu-cream-dark dark:to-background flex items-center justify-center">
        <Card className="p-8 text-center bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent">
          <div className="w-16 h-16 mx-auto mb-4">
            <img src="/mumu_mascot.png" alt="무무" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl font-bold mb-4 text-mumu-brown-dark">무무노트에 오신 것을 환영합니다</h2>
          <p className="text-mumu-brown mb-4">로그인하여 성찰과 목표 관리를 시작해보세요</p>
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
    <div className="min-h-screen bg-gradient-to-b from-mumu-cream-light to-mumu-warm dark:from-mumu-cream-dark dark:to-background">
        {/* Header */}
        <header className="flex items-center px-5 py-4 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 backdrop-blur-sm border-b border-mumu-accent">
          <div className="flex items-center gap-2 flex-1">
            <div className="h-8 w-8 rounded-lg bg-mumu-brown flex items-center justify-center">
              <img 
                src="/mumu_mascot.png" 
                alt="무무" 
                className="w-6 h-6 object-contain"
              />
            </div>
            <span className="font-bold text-mumu-brown-dark text-lg">무무노트</span>
          </div>
          <ThemeToggle />
        </header>

        <main className="px-5 py-6 pb-20">
          {/* 통계 카드들 */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Card className="p-3 bg-mumu-accent/60 dark:bg-mumu-brown-light/30 border-mumu-brown-light">
              <div className="flex items-center gap-2 mb-1">
                <BrainCircuitIcon className="w-4 h-4 text-mumu-brown" />
                <span className="text-xs font-medium text-mumu-brown-dark">총 성찰</span>
              </div>
              <div className="text-lg font-bold text-mumu-brown-dark">
                {isLoading ? "..." : stats?.totalReflections || 0}
              </div>
            </Card>

            <Card className="p-3 bg-mumu-brown-light/40 dark:bg-mumu-brown/30 border-mumu-accent">
              <div className="flex items-center gap-2 mb-1">
                <CalendarDaysIcon className="w-4 h-4 text-mumu-brown" />
                <span className="text-xs font-medium text-mumu-brown-dark">연속일</span>
              </div>
              <div className="text-lg font-bold text-mumu-brown-dark">
                {isLoading ? "..." : stats?.currentStreak || 0}
              </div>
            </Card>

            <Card className="p-3 bg-gradient-to-r from-mumu-brown/20 to-mumu-accent/40 border-mumu-brown">
              <div className="flex items-center gap-2 mb-1">
                <TargetIcon className="w-4 h-4 text-mumu-brown" />
                <span className="text-xs font-medium text-mumu-brown-dark">목표</span>
              </div>
              <div className="text-lg font-bold text-mumu-brown-dark">
                {isLoading ? "..." : recentGoals.length}
              </div>
            </Card>
          </div>

          {/* 로딩 상태 */}
          {isLoading && (
            <Card className="p-6 text-center bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent backdrop-blur-sm mb-6">
              <div className="w-16 h-16 mx-auto mb-4">
                <img src="/mumu_mascot.png" alt="무무" className="w-full h-full object-contain animate-spin-reverse" />
              </div>
              <p className="text-mumu-brown">데이터를 불러오고 있어요...</p>
            </Card>
          )}

          {/* 오늘의 할 일 체크리스트 */}
          {!isLoading && dailyTasks.length > 0 && (
            <Card className="p-4 bg-gradient-to-r from-green-100/80 to-green-50/80 dark:from-green-900/40 dark:to-green-900/20 border-green-200 dark:border-green-700 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-bold text-green-800 dark:text-green-200">🗓️ 매일 할 일 체크리스트</h3>
                  <span className="px-2 py-1 bg-green-200 dark:bg-green-800 rounded-full text-xs text-green-700 dark:text-green-300">
                    일일 루틴
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-green-600 dark:text-green-300">
                    {dailyTasks.filter(task => task.is_completed).length}/{dailyTasks.length} 완료
                  </div>
                  <div className="text-lg font-bold text-green-800 dark:text-green-200">
                    {Math.round((dailyTasks.filter(task => task.is_completed).length / dailyTasks.length) * 100)}%
                  </div>
                </div>
              </div>
              
              {/* 진행률 바 */}
              <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2 mb-4">
                <div 
                  className="bg-green-600 dark:bg-green-400 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.round((dailyTasks.filter(task => task.is_completed).length / dailyTasks.length) * 100)}%` 
                  }}
                ></div>
              </div>

              <div className="space-y-3">
                {dailyTasks.slice(0, 5).map((task: any) => (
                  <div 
                    key={task.id} 
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/60 dark:bg-green-800/30 hover:bg-white/80 dark:hover:bg-green-800/50 transition-all duration-200 border border-transparent hover:border-green-300 dark:hover:border-green-600"
                  >
                    {/* 체크박스 */}
                    <button
                      onClick={() => toggleDailyTask(task.id, task.is_completed)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mt-0.5 ${
                        task.is_completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-green-300 hover:border-green-500'
                      }`}
                    >
                      {task.is_completed && <CheckCircleIcon className="w-3 h-3" />}
                    </button>
                    
                    {/* 할일 내용 */}
                    <div className="flex-1">
                      <div className={`font-medium ${
                        task.is_completed 
                          ? 'text-green-600/70 dark:text-green-300/70 line-through' 
                          : 'text-green-800 dark:text-green-200'
                      }`}>
                        {task.title}
                      </div>
                      {task.description && (
                        <div className={`text-sm mt-1 ${
                          task.is_completed 
                            ? 'text-green-500/60 dark:text-green-400/60' 
                            : 'text-green-600 dark:text-green-300'
                        }`}>
                          {task.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {dailyTasks.length > 5 && (
                  <div className="text-center">
                    <Link href="/daily-tasks">
                      <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-800">
                        +{dailyTasks.length - 5}개 더 보기
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          )}


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
              {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-mumu-brown p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* 캘린더 그리드 - 간소화된 버전 */}
            <div className="grid grid-cols-7 gap-1">
              {generateCalendarGrid().map((cell, index) => (
                <div
                  key={index}
                  className={`
                    h-8 flex items-center justify-center text-xs relative rounded
                    ${cell?.isToday ? 'bg-mumu-brown text-mumu-cream font-bold' : 'hover:bg-mumu-accent/50'}
                  `}
                >
                  {cell && (
                    <>
                      <span className={`${cell.isToday ? 'text-mumu-cream' : 'text-mumu-brown-dark'}`}>
                        {cell.day}
                      </span>
                      {cell.emotion && (
                        <div className="absolute -top-1 -right-1 text-xs">
                          {getEmotionEmoji(cell.emotion)}
                        </div>
                      )}
                      {cell.events.length > 0 && (
                        <div className="absolute bottom-0 right-1 w-1 h-1 bg-mumu-brown rounded-full" />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </Card>


          {/* 최근 성찰 */}
          {!isLoading && recentReflections.length > 0 && (
            <Card className="p-4 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent backdrop-blur-sm mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-mumu-brown-dark">최근 성찰</h3>
                <Link href="/reflection">
                  <Button variant="ghost" size="sm" className="text-mumu-brown hover:bg-mumu-accent">
                    더보기
                  </Button>
                </Link>
              </div>
              <div className="space-y-2">
                {recentReflections.slice(0, 2).map((reflection: any) => (
                  <div key={reflection.id} className="flex items-center gap-3 p-2 rounded-lg bg-mumu-accent/20">
                    <span className="text-lg">
                      {getEmotionEmoji(reflection.emotion)}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-mumu-brown-dark">{reflection.title}</div>
                      <div className="text-xs text-mumu-brown">
                        {new Date(reflection.created_at).toLocaleDateString('ko-KR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* 최근 목표 */}
          {!isLoading && recentGoals.length > 0 && (
            <Card className="p-4 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-mumu-brown-dark">진행 중인 목표</h3>
                <Link href="/goals">
                  <Button variant="ghost" size="sm" className="text-mumu-brown hover:bg-mumu-accent">
                    더보기
                  </Button>
                </Link>
              </div>
              <div className="space-y-2">
                {recentGoals.slice(0, 2).map((goal: any) => (
                  <div key={goal.id} className="flex items-center gap-3 p-2 rounded-lg bg-mumu-brown-light/20">
                    <TargetIcon className="w-4 h-4 text-mumu-brown" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-mumu-brown-dark">{goal.title}</div>
                      <div className="text-xs text-mumu-brown">진행률: {goal.progress || 0}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

        </main>

        <NavBar activeTab="home" />
    </div>
  )
}