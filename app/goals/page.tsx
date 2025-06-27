"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AnimatedPage } from "@/components/page-transition"
import { TargetIcon, PlusIcon, CheckCircleIcon, CircleIcon, FlameIcon, BrainCircuitIcon, ClockIcon, ZapIcon } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

interface Goal {
  id: string
  title: string
  description: string
  progress: number
  timeframe: string
  phases: Array<{
    title: string
    description: string
    duration: string
    completed: boolean
    tasks: Array<{
      title: string
      description: string
      timeEstimate: string
      difficulty: 'easy' | 'medium' | 'hard'
      completed: boolean
    }>
  }>
  createdAt: string
}

export default function GoalsPage() {
  const { data: session, status } = useSession()
  const [goals, setGoals] = useState<Goal[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [dailyTasks, setDailyTasks] = useState<any[]>([])
  const [loadingTasks, setLoadingTasks] = useState<Set<number>>(new Set())

  // 목표 데이터 로드
  useEffect(() => {
    async function loadGoals() {
      if (!session?.user?.email) {
        console.log('세션 없음 - 로딩 중단')
        setIsLoading(false)
        return
      }

      try {
        console.log('목표 데이터 로드 시작...', session.user.email)
        setIsLoading(true)
        const response = await fetch('/api/goals')
        console.log('API 응답 상태:', response.status)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('목표 API 응답:', data)
        
        if (data.success) {
          console.log('목표 데이터 설정:', data.data)
          setGoals(data.data || [])
        } else {
          console.error('목표 API 성공하지 않음:', data)
          setGoals([])
        }
      } catch (error) {
        console.error('목표 로드 실패:', error)
        setGoals([])
      } finally {
        setIsLoading(false)
      }
    }

    async function loadDailyTasks() {
      try {
        const response = await fetch('/api/daily-tasks')
        const data = await response.json()
        if (data.success) {
          setDailyTasks(data.data || [])
        }
      } catch (error) {
        console.error('일일 할일 로드 실패:', error)
        setDailyTasks([])
      }
    }

    if (status === "authenticated") {
      loadGoals()
      loadDailyTasks()
    }
  }, [session?.user?.email, status])

  // 체크박스 토글 함수
  const toggleTask = useCallback(async (taskId: number, isCompleted: boolean) => {
    if (loadingTasks.has(taskId)) return
    
    setLoadingTasks(prev => new Set([...prev, taskId]))
    
    // 낙관적 업데이트
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

  // 난이도별 색상
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return "text-green-600 dark:text-green-400"
      case 'medium': return "text-yellow-600 dark:text-yellow-400"
      case 'hard': return "text-red-600 dark:text-red-400"
      default: return "text-mumu-brown"
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return "쉬움"
      case 'medium': return "보통"
      case 'hard': return "어려움"
      default: return "보통"
    }
  }

  const handleCreateGoal = async () => {
    if (!newGoal.title.trim()) return

    setIsAnalyzing(true)

    try {
      // AI로 목표 자동 분해
      const response = await fetch('/api/goals/breakdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goalTitle: newGoal.title,
          goalDescription: newGoal.description
        }),
      })

      const data = await response.json()

      if (data.success) {
        const breakdown = data.data
        
        // 모든 작업에 completed: false 추가
        const phasesWithStatus = breakdown.phases.map((phase: any) => ({
          ...phase,
          completed: false,
          tasks: phase.tasks.map((task: any) => ({
            ...task,
            completed: false
          }))
        }))

        // API에 목표 저장
        const saveResponse = await fetch('/api/goals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: newGoal.title,
            description: newGoal.description,
            timeframe: breakdown.timeframe,
            phases: phasesWithStatus
          }),
        })

        const saveData = await saveResponse.json()
        
        if (saveData.success) {
          const savedGoal: Goal = {
            id: saveData.data.id.toString(),
            title: saveData.data.title,
            description: saveData.data.description,
            progress: saveData.data.progress,
            timeframe: saveData.data.timeframe,
            phases: saveData.data.phases,
            createdAt: saveData.data.created_at
          }
          
          setGoals([...goals, savedGoal])
          setNewGoal({ title: '', description: '' })
          setIsCreating(false)
        } else {
          throw new Error('목표 저장 실패')
        }
      } else {
        throw new Error('목표 분해 실패')
      }
    } catch (error) {
      console.error('목표 생성 실패:', error)
      // 기본 구조로 목표 생성하고 API에 저장
      const defaultPhases = [
        {
          title: "시작하기",
          description: "기본적인 첫 단계들",
          duration: "1-2주",
          completed: false,
          tasks: [
            {
              title: "목표 구체화하기",
              description: "목표를 더 세부적으로 계획해보세요",
              timeEstimate: "30분",
              difficulty: "easy",
              completed: false
            }
          ]
        }
      ]

      const saveResponse = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newGoal.title,
          description: newGoal.description,
          timeframe: "2-3개월",
          phases: defaultPhases
        }),
      })

      const saveData = await saveResponse.json()
      
      if (saveData.success) {
        const savedGoal: Goal = {
          id: saveData.data.id.toString(),
          title: saveData.data.title,
          description: saveData.data.description,
          progress: saveData.data.progress,
          timeframe: saveData.data.timeframe,
          phases: saveData.data.phases,
          createdAt: saveData.data.created_at
        }
        
        setGoals([...goals, savedGoal])
      }
      setNewGoal({ title: '', description: '' })
      setIsCreating(false)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 로딩 중일 때
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-mumu-cream-light to-mumu-warm dark:from-mumu-cream-dark dark:to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <img src="/mumu_mascot.png" alt="무무" className="w-full h-full object-contain animate-spin" />
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
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-b from-mumu-cream-light to-mumu-warm dark:from-mumu-cream-dark dark:to-background">
        {/* Header */}
        <header className="flex items-center px-5 py-4 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 backdrop-blur-sm border-b border-mumu-accent">
          <div className="flex items-center gap-2 flex-1">
            <div className="h-8 w-8 rounded-lg bg-mumu-brown flex items-center justify-center">
              <TargetIcon className="w-5 h-5 text-mumu-cream" />
            </div>
            <span className="font-bold text-mumu-brown-dark text-lg">목표</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              onClick={() => setIsCreating(true)}
              size="sm"
              className="bg-mumu-brown hover:bg-mumu-brown-dark text-mumu-cream"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              목표 추가
            </Button>
          </div>
        </header>

        <main className="px-5 py-6 pb-20">
          {/* One Big Goal 소개 */}
          <Card className="p-4 mb-6 bg-gradient-to-r from-mumu-brown-light/90 to-mumu-brown/90 dark:from-mumu-brown/80 dark:to-mumu-brown-dark/80 border-mumu-accent text-mumu-cream">
            <div className="flex items-center gap-2 mb-2">
              <FlameIcon className="w-5 h-5" />
              <h2 className="text-lg font-bold">One Big Goal</h2>
            </div>
            <p className="text-sm opacity-90 mb-3">
              올해 이루고 싶은 한 가지 목표를 설정해보세요.
            </p>
            <p className="text-xs opacity-80">
              무무가 AI로 목표를 작은 단위로 자동 분해해서 실행 가능하게 만들어드려요.
            </p>
          </Card>

          {/* 목표 생성 폼 */}
          {isCreating && (
            <Card className="p-4 mb-6 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent">
              <h3 className="text-lg font-bold mb-4 text-mumu-brown-dark">새 목표 만들기</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goal-title" className="text-mumu-brown-dark">
                    올해 이루고 싶은 한 가지는?
                  </Label>
                  <Input
                    id="goal-title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    placeholder="예: 건강한 몸 만들기, 새로운 기술 배우기..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="goal-description" className="text-mumu-brown-dark">
                    구체적인 설명 (선택사항)
                  </Label>
                  <Textarea
                    id="goal-description"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    placeholder="목표에 대한 자세한 설명을 적어주세요..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                {isAnalyzing && (
                  <div className="text-center py-4">
                    <div className="w-8 h-8 mx-auto mb-2 animate-spin">
                      <BrainCircuitIcon className="w-full h-full text-mumu-brown" />
                    </div>
                    <p className="text-sm text-mumu-brown">
                      무무가 목표를 분석하고 있어요... 🤔
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => setIsCreating(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleCreateGoal}
                    disabled={isAnalyzing || !newGoal.title.trim()}
                    className="flex-1 bg-mumu-brown hover:bg-mumu-brown-dark text-mumu-cream disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <BrainCircuitIcon className="w-4 h-4 mr-2 animate-spin" />
                        AI 분석 중...
                      </>
                    ) : (
                      <>
                        <BrainCircuitIcon className="w-4 h-4 mr-2" />
                        AI로 목표 분해
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* 목표 목록 */}
          {isLoading ? (
            <Card className="p-8 text-center bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent">
              <div className="w-16 h-16 mx-auto mb-4">
                <img 
                  src="/mumu_mascot.png" 
                  alt="무무" 
                  className="w-full h-full object-contain animate-spin-reverse"
                />
              </div>
              <h3 className="text-lg font-bold mb-2 text-mumu-brown-dark">목표를 불러오는 중...</h3>
              <p className="text-sm text-mumu-brown">잠시만 기다려주세요</p>
            </Card>
          ) : goals.length === 0 && !isCreating ? (
            <Card className="p-8 text-center bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent">
              <div className="w-16 h-16 mx-auto mb-4 opacity-50">
                <img 
                  src="/mumu_mascot.png" 
                  alt="무무" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg font-bold mb-2 text-mumu-brown-dark">첫 번째 목표를 설정해보세요</h3>
              <p className="text-sm text-mumu-brown mb-4">
                무무가 목표를 작은 단위로 나누어서 실행하기 쉽게 도와드릴게요.
              </p>
              <Button
                onClick={() => setIsCreating(true)}
                className="bg-mumu-brown hover:bg-mumu-brown-dark text-mumu-cream"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                목표 추가하기
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => (
                <Card key={goal.id} className="p-4 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-mumu-brown-dark mb-1">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-sm text-mumu-brown mb-2">{goal.description}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-mumu-accent px-2 py-1 rounded-full text-mumu-brown flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          {goal.timeframe}
                        </span>
                        <span className="text-xs text-mumu-brown">
                          진행률 {goal.progress}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 목표별 일일 할일들 */}
                  {(() => {
                    const goalTasks = dailyTasks.filter(task => task.goal_title === goal.title)
                    if (goalTasks.length === 0) return null
                    
                    const completedTasks = goalTasks.filter(task => task.is_completed).length
                    const totalTasks = goalTasks.length
                    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

                    return (
                      <div className="space-y-3">
                        {/* 진행률 바 */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-mumu-brown">
                            <span>오늘의 할일</span>
                            <span>{completedTasks}/{totalTasks} 완료 ({progressPercentage}%)</span>
                          </div>
                          <div className="w-full bg-mumu-accent rounded-full h-2">
                            <div 
                              className="bg-mumu-brown h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>

                        {/* 할일 목록 */}
                        <div className="space-y-2">
                          {goalTasks.slice(0, 3).map((task) => (
                            <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/60 dark:bg-mumu-brown-light/30 hover:bg-white/80 dark:hover:bg-mumu-brown-light/50 transition-all duration-200">
                              {/* 체크박스 */}
                              <button
                                onClick={() => toggleTask(task.id, task.is_completed)}
                                disabled={loadingTasks.has(task.id)}
                                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                                  task.is_completed 
                                    ? 'bg-mumu-brown border-mumu-brown text-mumu-cream' 
                                    : 'border-mumu-brown hover:border-mumu-brown-dark'
                                } ${loadingTasks.has(task.id) ? 'opacity-50' : ''}`}
                              >
                                {task.is_completed && <CheckCircleIcon className="w-3 h-3" />}
                              </button>
                              
                              {/* 할일 내용 */}
                              <div className="flex-1">
                                <div className={`text-sm font-medium ${
                                  task.is_completed 
                                    ? 'text-mumu-brown/70 line-through' 
                                    : 'text-mumu-brown-dark'
                                }`}>
                                  {task.task_title}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-mumu-brown mt-1">
                                  <span>{task.estimated_time}</span>
                                  {task.streak_count > 0 && (
                                    <>
                                      <span>•</span>
                                      <span className="text-orange-600">🔥 {task.streak_count}일 연속</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {goalTasks.length > 3 && (
                            <div className="text-center">
                              <Link href="/daily-tasks">
                                <Button variant="ghost" size="sm" className="text-mumu-brown hover:bg-mumu-accent">
                                  +{goalTasks.length - 3}개 더 보기
                                </Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })()}

                  {/* 목표 관리 버튼들 */}
                  <div className="mt-4 pt-3 border-t border-mumu-accent flex gap-2">
                    <Link href="/daily-tasks">
                      <Button size="sm" variant="outline" className="text-mumu-brown border-mumu-brown hover:bg-mumu-brown hover:text-mumu-cream">
                        <ZapIcon className="w-3 h-3 mr-1" />
                        전체 할일 보기
                      </Button>
                    </Link>
                    <Button size="sm" variant="ghost" className="text-mumu-brown hover:bg-mumu-accent">
                      목표 수정하기
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>

        <NavBar activeTab="goals" />
      </div>
    </AnimatedPage>
  )
}