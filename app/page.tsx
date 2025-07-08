"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon, CalendarDaysIcon, BrainCircuitIcon, TargetIcon, BookOpenIcon, CheckCircleIcon, CircleIcon } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { data: session, status } = useSession()
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // 디버깅용 로그
  console.log("🔍 HomePage Debug:", { status, session, userEmail: session?.user?.email })
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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <img src="/mumu_mascot.png" alt="무무" className="w-full h-full object-contain animate-pulse" />
          </div>
          <p className="text-amber-800 font-medium">로딩 중...</p>
        </div>
      </div>
    )
  }

  // 로그인되지 않았을 때
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center px-4">
        <Card className="p-8 text-center bg-white shadow-xl border-0 rounded-2xl max-w-sm">
          <div className="w-20 h-20 mx-auto mb-6">
            <img src="/mumu_mascot.png" alt="무무" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-amber-900">무무노트에 오신 것을 환영합니다</h2>
          <p className="text-amber-700 mb-6 leading-relaxed">AI와 함께하는 스마트한<br />성찰과 목표 관리를 시작해보세요</p>
          <Link href="/login">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all">
              시작하기
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        {/* Header */}
        <header className="flex items-center px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-amber-100 shadow-sm">
          <div className="flex items-center gap-3 flex-1">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
              <img 
                src="/mumu_mascot.png" 
                alt="무무" 
                className="w-7 h-7 object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-amber-900 text-xl">무무노트</span>
              <div className="text-xs text-amber-600">AI 성찰 도우미</div>
            </div>
          </div>
        </header>

        <main className="px-6 py-6 pb-24">
          {/* 통계 카드들 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="p-4 bg-white border-0 shadow-lg rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BrainCircuitIcon className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {isLoading ? "..." : stats?.totalReflections || 0}
              </div>
              <div className="text-sm text-gray-600">총 성찰</div>
            </Card>

            <Card className="p-4 bg-white border-0 shadow-lg rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CalendarDaysIcon className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {isLoading ? "..." : stats?.currentStreak || 0}일
              </div>
              <div className="text-sm text-gray-600">연속 기록</div>
            </Card>

            <Card className="p-4 bg-white border-0 shadow-lg rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TargetIcon className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {isLoading ? "..." : recentGoals.length}개
              </div>
              <div className="text-sm text-gray-600">진행 목표</div>
            </Card>
          </div>

          {/* 로딩 상태 */}
          {isLoading && (
            <Card className="p-8 text-center bg-white shadow-lg rounded-2xl border-0 mb-8">
              <div className="w-16 h-16 mx-auto mb-4">
                <img src="/mumu_mascot.png" alt="무무" className="w-full h-full object-contain animate-pulse" />
              </div>
              <p className="text-gray-700 font-medium">데이터를 불러오고 있어요...</p>
            </Card>
          )}

          {/* 오늘의 할 일 체크리스트 */}
          {!isLoading && (
            dailyTasks.length > 0 ? (
            <Card className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-0 shadow-lg rounded-2xl mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">오늘의 할 일</h3>
                    <span className="text-sm text-gray-600">매일 루틴 체크리스트</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">
                    {dailyTasks.filter(task => task.is_completed).length}/{dailyTasks.length} 완료
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">
                    {Math.round((dailyTasks.filter(task => task.is_completed).length / dailyTasks.length) * 100)}%
                  </div>
                </div>
              </div>
              
              {/* 진행률 바 */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${Math.round((dailyTasks.filter(task => task.is_completed).length / dailyTasks.length) * 100)}%` 
                  }}
                ></div>
              </div>

              <div className="space-y-3">
                {dailyTasks.slice(0, 5).map((task: any) => (
                  <div 
                    key={task.id} 
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/80 hover:bg-white transition-all duration-200 border border-gray-100 hover:border-emerald-200 hover:shadow-md"
                  >
                    {/* 체크박스 */}
                    <button
                      onClick={() => toggleDailyTask(task.id, task.is_completed)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mt-0.5 ${
                        task.is_completed 
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' 
                          : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50'
                      }`}
                    >
                      {task.is_completed && <CheckCircleIcon className="w-4 h-4" />}
                    </button>
                    
                    {/* 할일 내용 */}
                    <div className="flex-1">
                      <div className={`font-medium text-base ${
                        task.is_completed 
                          ? 'text-gray-500 line-through' 
                          : 'text-gray-900'
                      }`}>
                        {task.task_title || task.title}
                      </div>
                      {task.task_description || task.description && (
                        <div className={`text-sm mt-1 ${
                          task.is_completed 
                            ? 'text-gray-400' 
                            : 'text-gray-600'
                        }`}>
                          {task.task_description || task.description}
                        </div>
                      )}
                      {task.estimated_time && (
                        <div className="text-xs text-emerald-600 mt-1 font-medium">
                          ⏱️ {task.estimated_time}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {dailyTasks.length > 5 && (
                  <div className="text-center pt-2">
                    <Link href="/daily-tasks">
                      <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl">
                        +{dailyTasks.length - 5}개 더 보기
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>
            ) : (
              <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg rounded-2xl mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4">
                    <img src="/mumu_mascot.png" alt="무무" className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">오늘은 여유로운 하루네요! ✨</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    새로운 목표를 설정하면<br />매일 할 일이 자동으로 생성됩니다
                  </p>
                  <Link href="/goals">
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all">
                      <TargetIcon className="w-5 h-5 mr-2" />
                      목표 만들기
                    </Button>
                  </Link>
                </div>
              </Card>
            )
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
                        <div className="absolute -top-1 -right-1 text-xs z-10">
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