"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircleIcon, TargetIcon, FlameIcon, ZapIcon } from "lucide-react"
import Link from "next/link"

interface Task {
  id: number
  task_title: string
  task_description?: string
  estimated_time: string
  is_completed: boolean
  streak_count: number
}

interface Goal {
  id: string
  title: string
  description: string
  progress: number
  timeframe: string
  createdAt: string
}

interface GoalProgressVisualProps {
  goal: Goal
  tasks: Task[]
  onToggleTask: (taskId: number, isCompleted: boolean) => void
  loadingTasks: Set<number>
}

export function GoalProgressVisual({ goal, tasks, onToggleTask, loadingTasks }: GoalProgressVisualProps) {
  const completedTasks = tasks.filter(task => task.is_completed).length
  const totalTasks = tasks.length
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  
  // 연속 기록 최고치
  const bestStreak = Math.max(...tasks.map(t => t.streak_count), 0)
  
  // 목표별 고유 색상 (ID를 해시하여 색상 선택)
  const getGoalColor = (id: string) => {
    const colors = [
      'amber', 'orange', 'yellow', 'lime', 'green', 'emerald', 
      'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
    ]
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }
  
  const goalColor = getGoalColor(goal.id)

  return (
    <Card className={`p-6 bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 border-l-4 border-l-${goalColor}-500`}>
      {/* 목표 헤더 */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 bg-gradient-to-br from-${goalColor}-500 to-${goalColor}-600 rounded-lg`}>
              <TargetIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{goal.title}</h3>
          </div>
          {goal.description && (
            <p className="text-gray-600 mb-3 leading-relaxed">{goal.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm">
            <span className={`px-3 py-1 bg-${goalColor}-100 text-${goalColor}-700 rounded-full font-medium`}>
              📅 {goal.timeframe}
            </span>
            {bestStreak > 0 && (
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium flex items-center gap-1">
                <FlameIcon className="w-3 h-3" />
                최고 {bestStreak}일 연속
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 진행률 시각화 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">오늘의 진행률</span>
          <span className={`text-2xl font-bold text-${goalColor}-600`}>{progressPercentage}%</span>
        </div>
        
        {/* 프로그레스 바 */}
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`bg-gradient-to-r from-${goalColor}-500 to-${goalColor}-600 h-3 rounded-full transition-all duration-700 ease-out`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {/* 완료 표시 */}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{completedTasks}개 완료</span>
            <span>총 {totalTasks}개</span>
          </div>
        </div>
      </div>

      {/* 할 일 목록 */}
      {tasks.length > 0 && (
        <div className="space-y-3 mb-6">
          <h4 className="font-medium text-gray-900 mb-3">📋 오늘의 할 일</h4>
          {tasks.slice(0, 3).map((task) => (
            <div 
              key={task.id} 
              className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200"
            >
              {/* 체크박스 */}
              <button
                onClick={() => onToggleTask(task.id, task.is_completed)}
                disabled={loadingTasks.has(task.id)}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mt-0.5 ${
                  task.is_completed 
                    ? 'bg-green-500 border-green-500 text-white shadow-sm' 
                    : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50'
                } ${loadingTasks.has(task.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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
                  {task.task_title}
                </div>
                {task.task_description && (
                  <div className={`text-sm mt-1 ${
                    task.is_completed 
                      ? 'text-gray-400' 
                      : 'text-gray-600'
                  }`}>
                    {task.task_description}
                  </div>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className={`text-${goalColor}-600 font-medium bg-${goalColor}-50 px-2 py-1 rounded`}>
                    ⏱️ {task.estimated_time}
                  </span>
                  {task.streak_count > 0 && (
                    <span className="text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded flex items-center gap-1">
                      <FlameIcon className="w-3 h-3" />
                      {task.streak_count}일 연속
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* 더 보기 버튼 */}
          {tasks.length > 3 && (
            <div className="text-center pt-2">
              <Link href="/daily-tasks">
                <Button variant="ghost" size="sm" className={`text-${goalColor}-600 hover:text-${goalColor}-700 hover:bg-${goalColor}-50 rounded-xl`}>
                  +{tasks.length - 3}개 더 보기
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 액션 버튼들 */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <Link href="/daily-tasks" className="flex-1">
          <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all">
            <ZapIcon className="w-4 h-4 mr-2" />
            전체 할일 보기
          </Button>
        </Link>
      </div>
    </Card>
  )
}