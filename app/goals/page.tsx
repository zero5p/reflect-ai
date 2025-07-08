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
import { GoalProgressVisual } from "@/components/goals/goal-progress-visual"
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
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [editGoalData, setEditGoalData] = useState({ title: '', description: '' })
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

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setEditGoalData({
      title: goal.title,
      description: goal.description
    })
  }

  const handleUpdateGoal = async () => {
    if (!editingGoal || !editGoalData.title.trim()) return

    try {
      const response = await fetch(`/api/goals/${editingGoal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editGoalData.title,
          description: editGoalData.description
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setGoals(prev => prev.map(g => 
          g.id === editingGoal.id 
            ? { ...g, title: editGoalData.title, description: editGoalData.description }
            : g
        ))
        setEditingGoal(null)
        setEditGoalData({ title: '', description: '' })
      } else {
        console.error('목표 수정 실패:', data)
      }
    } catch (error) {
      console.error('목표 수정 실패:', error)
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6">
            <img src="/mumu_mascot.png" alt="무무" className="w-full h-full object-contain animate-pulse" />
          </div>
          <p className="text-purple-800 font-medium">목표를 불러오고 있어요...</p>
        </div>
      </div>
    )
  }

  // 로그인되지 않았을 때
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <Card className="p-8 text-center bg-white shadow-xl border-0 rounded-2xl max-w-sm">
          <h2 className="text-xl font-bold mb-4 text-purple-900">로그인이 필요합니다</h2>
          <Link href="/login">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-medium">
              로그인하기
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <header className="px-6 py-6 bg-white/80 backdrop-blur-sm border-b border-purple-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
                <TargetIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">목표 관리</h1>
                <p className="text-sm text-gray-600">꿈을 현실로 만드는 첫 번째 단계</p>
              </div>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              새 목표
            </Button>
          </div>
          {/* 통계 간단히 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{goals.length}</div>
              <div className="text-sm text-gray-600">전체 목표</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{dailyTasks.filter(t => t.is_completed).length}</div>
              <div className="text-sm text-gray-600">오늘 완료</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{dailyTasks.length}</div>
              <div className="text-sm text-gray-600">전체 할일</div>
            </div>
          </div>
        </header>

        <main className="px-6 py-8 pb-24">
          {/* One Big Goal 소개 */}
          <Card className="p-8 mb-8 bg-gradient-to-br from-orange-100 to-red-100 border-0 shadow-lg rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-500 rounded-xl">
                <FlameIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">One Big Goal</h2>
                <p className="text-sm text-gray-600">한 번에 하나씩, 착실하게</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              올해 가장 이루고 싶은 한 가지 목표를 설정해보세요.
            </p>
            <div className="flex items-center gap-2 text-sm text-orange-700">
              <BrainCircuitIcon className="w-4 h-4" />
              <span>무무 AI가 목표를 실행 가능한 단계로 나눠드려요</span>
            </div>
          </Card>

          {/* 목표 수정 폼 */}
          {editingGoal && (
            <Card className="p-4 mb-6 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent">
              <h3 className="text-lg font-bold mb-4 text-mumu-brown-dark">목표 수정하기</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-goal-title" className="text-mumu-brown-dark">
                    목표 제목
                  </Label>
                  <Input
                    id="edit-goal-title"
                    value={editGoalData.title}
                    onChange={(e) => setEditGoalData({...editGoalData, title: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-goal-description" className="text-mumu-brown-dark">
                    설명 (선택사항)
                  </Label>
                  <Textarea
                    id="edit-goal-description"
                    value={editGoalData.description}
                    onChange={(e) => setEditGoalData({...editGoalData, description: e.target.value})}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => {
                      setEditingGoal(null)
                      setEditGoalData({ title: '', description: '' })
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleUpdateGoal}
                    disabled={!editGoalData.title.trim()}
                    className="flex-1 bg-mumu-brown hover:bg-mumu-brown-dark text-mumu-cream disabled:opacity-50"
                  >
                    수정 완료
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* 목표 생성 폼 */}
          {isCreating && (
            <Card className="p-8 mb-8 bg-white border-0 shadow-xl rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <TargetIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">새 목표 만들기</h3>
                  <p className="text-sm text-gray-600">꿈을 현실로 만드는 첫 걸음</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="goal-title" className="text-gray-900 font-medium text-base">
                    🎯 올해 이루고 싶은 것은 무엇인가요?
                  </Label>
                  <Input
                    id="goal-title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    placeholder="예: 건강한 몸 만들기, 새로운 기술 배우기, 독서 습관 만들기..."
                    className="mt-3 px-4 py-3 text-base rounded-xl border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <Label htmlFor="goal-description" className="text-gray-900 font-medium text-base">
                    📝 좀 더 자세히 설명해주세요 (선택사항)
                  </Label>
                  <Textarea
                    id="goal-description"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    placeholder="왜 이 목표를 이루고 싶으신가요? 어떤 느낌으로 달성하고 싶으신가요?"
                    className="mt-3 px-4 py-3 text-base rounded-xl border-gray-200 focus:border-purple-400 focus:ring-purple-400 resize-none"
                    rows={3}
                  />
                </div>

                {isAnalyzing && (
                  <div className="text-center py-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-100">
                    <div className="w-12 h-12 mx-auto mb-4 animate-spin">
                      <BrainCircuitIcon className="w-full h-full text-purple-500" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">무무 AI가 분석 중이에요</h4>
                    <p className="text-sm text-gray-600">
                      목표를 달성 가능한 단계로 나눠고 있어요... ✨
                    </p>
                  </div>
                )}

                <div className="flex gap-4 pt-6">
                  <Button
                    onClick={() => setIsCreating(false)}
                    variant="outline"
                    className="flex-1 py-3 rounded-xl border-gray-200 hover:bg-gray-50"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleCreateGoal}
                    disabled={isAnalyzing || !newGoal.title.trim()}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                  >
                    {isAnalyzing ? (
                      <>
                        <BrainCircuitIcon className="w-5 h-5 mr-2 animate-spin" />
                        AI 분석 중...
                      </>
                    ) : (
                      <>
                        <BrainCircuitIcon className="w-5 h-5 mr-2" />
                        AI로 목표 만들기
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
                  className="w-full h-full object-contain animate-mumu-float"
                />
              </div>
              <h3 className="text-lg font-bold mb-2 text-mumu-brown-dark">목표를 불러오는 중...</h3>
              <p className="text-sm text-mumu-brown">잠시만 기다려주세요</p>
            </Card>
          ) : goals.length === 0 && !isCreating ? (
            <Card className="p-12 text-center bg-white border-0 shadow-xl rounded-2xl">
              <div className="w-24 h-24 mx-auto mb-6">
                <img 
                  src="/mumu_mascot.png" 
                  alt="무무" 
                  className="w-full h-full object-contain opacity-80"
                />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">첫 번째 목표를 시작해보세요! 🎯</h3>
              <p className="text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
                큰 꿈도 작은 한 걸음부터 시작됩니다.<br />
                무무 AI가 목표를 달성 가능한 단계로 나눠드릴게요.
              </p>
              <Button
                onClick={() => setIsCreating(true)}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                첫 목표 만들기
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {goals.map((goal) => {
                const goalTasks = dailyTasks.filter(task => task.goal_title === goal.title || task.goal_id === parseInt(goal.id))
                return (
                  <GoalProgressVisual
                    key={goal.id}
                    goal={goal}
                    tasks={goalTasks}
                    onToggleTask={toggleTask}
                    loadingTasks={loadingTasks}
                  />
                )
              })}
            </div>
          )}
        </main>

        <NavBar activeTab="goals" />
      </div>
    </AnimatedPage>
  )
}