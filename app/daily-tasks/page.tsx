"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, CheckCircleIcon, CalendarIcon, TargetIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DailyTasksPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dailyTasks, setDailyTasks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    async function fetchDailyTasks() {
      if (!session?.user?.email) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/daily-tasks?date=${selectedDate}`)
        const data = await response.json()
        
        if (data.success) {
          setDailyTasks(data.data || [])
        } else {
          console.error('일일 할 일 로드 실패:', data)
          setDailyTasks([])
        }
      } catch (error) {
        console.error('일일 할 일 로드 실패:', error)
        setDailyTasks([])
      } finally {
        setIsLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchDailyTasks()
    }
  }, [session?.user?.email, status, selectedDate])

  const toggleDailyTask = async (taskId: number, isCompleted: boolean) => {
    try {
      const response = await fetch('/api/daily-tasks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          isCompleted: !isCompleted
        })
      })

      if (response.ok) {
        setDailyTasks(prev => prev.map(task => 
          task.id === taskId 
            ? { ...task, is_completed: !isCompleted }
            : task
        ))
      }
    } catch (error) {
      console.error('할 일 상태 업데이트 실패:', error)
    }
  }

  const completedTasks = dailyTasks.filter(task => task.is_completed).length
  const totalTasks = dailyTasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // 로딩 중일 때
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-mumu-cream-light to-mumu-warm dark:from-mumu-cream-dark dark:to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <img src="/mumu_mascot.png" alt="무무" className="w-full h-full object-contain animate-mumu-float" />
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
    <div className="min-h-screen bg-gradient-to-b from-mumu-cream-light to-mumu-warm dark:from-mumu-cream-dark dark:to-background">
      {/* Header */}
      <header className="flex items-center px-5 py-4 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 backdrop-blur-sm border-b border-mumu-accent">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="mr-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 flex-1">
          <div className="h-8 w-8 rounded-lg bg-mumu-brown flex items-center justify-center">
            <CheckCircleIcon className="w-5 h-5 text-mumu-cream" />
          </div>
          <span className="font-bold text-mumu-brown-dark text-lg">일일 할 일</span>
        </div>
      </header>

      <main className="px-5 py-6 pb-20">
        {/* 날짜 선택 */}
        <Card className="p-4 mb-6 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent">
          <div className="flex items-center gap-2 mb-3">
            <CalendarIcon className="w-5 h-5 text-mumu-brown" />
            <h3 className="font-bold text-mumu-brown-dark">날짜 선택</h3>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border border-mumu-accent rounded-lg bg-white dark:bg-mumu-cream-dark"
          />
        </Card>

        {/* 진행 상황 요약 */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-blue-100/80 to-blue-50/80 dark:from-blue-900/40 dark:to-blue-900/20 border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-blue-800 dark:text-blue-200">오늘의 진행 상황</h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">{completionRate}%</div>
              <div className="text-xs text-blue-600 dark:text-blue-300">{completedTasks}/{totalTasks} 완료</div>
            </div>
          </div>
          
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3">
            <div 
              className="bg-blue-600 dark:bg-blue-400 h-3 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </Card>

        {/* 할 일 목록 */}
        {dailyTasks.length === 0 ? (
          <Card className="p-8 text-center bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent">
            <div className="w-16 h-16 mx-auto mb-4 opacity-50">
              <img src="/mumu_mascot.png" alt="무무" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-mumu-brown-dark">오늘은 할 일이 없어요!</h3>
            <p className="text-sm text-mumu-brown mb-4">
              새로운 목표를 설정하거나 기존 목표에 할 일을 추가해보세요. 무무가 도와드릴게요! 🎯
            </p>
            <div className="space-y-2">
              <Link href="/goals">
                <Button className="bg-mumu-brown hover:bg-mumu-brown-dark text-mumu-cream w-full">
                  <TargetIcon className="w-4 h-4 mr-2" />
                  새로운 목표 만들기
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="border-mumu-brown text-mumu-brown hover:bg-mumu-accent w-full">
                  홈으로 돌아가기
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* 목표별로 그룹화 */}
            {Object.entries(
              dailyTasks.reduce((groups: any, task: any) => {
                const goalTitle = task.goal_title || '기타'
                if (!groups[goalTitle]) groups[goalTitle] = []
                groups[goalTitle].push(task)
                return groups
              }, {})
            ).map(([goalTitle, tasks]: [string, any]) => (
              <Card key={goalTitle} className="p-4 bg-white/80 dark:bg-mumu-cream-dark/80 border-mumu-accent">
                <div className="flex items-center gap-2 mb-3">
                  <TargetIcon className="w-4 h-4 text-mumu-brown" />
                  <h4 className="font-bold text-mumu-brown-dark">{goalTitle}</h4>
                  <span className="text-xs text-mumu-brown">
                    {tasks.filter((t: any) => t.is_completed).length}/{tasks.length} 완료
                  </span>
                </div>
                
                <div className="space-y-3">
                  {tasks.map((task: any) => (
                    <div 
                      key={task.id} 
                      className="flex items-start gap-3 p-3 rounded-lg bg-mumu-accent/20 hover:bg-mumu-accent/30 transition-all duration-200"
                    >
                      <button
                        onClick={() => toggleDailyTask(task.id, task.is_completed)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mt-0.5 ${
                          task.is_completed 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 hover:border-mumu-brown bg-white'
                        }`}
                      >
                        {task.is_completed && (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${
                          task.is_completed 
                            ? 'line-through text-gray-500 dark:text-gray-400' 
                            : 'text-mumu-brown-dark'
                        }`}>
                          {task.task_title}
                        </div>
                        {task.task_description && (
                          <div className="text-xs text-mumu-brown mt-1">
                            {task.task_description}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-mumu-brown mt-2">
                          <span>{task.estimated_time}</span>
                          {task.streak_count > 0 && (
                            <>
                              <span>•</span>
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-800 rounded-full text-green-700 dark:text-green-300">
                                🔥 {task.streak_count}일 연속
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <NavBar activeTab="goals" />
    </div>
  )
}