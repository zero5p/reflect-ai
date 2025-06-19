'use client'

import { useEffect, useState } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts'
import { TrendingUp, Target, Heart, CheckCircle, Calendar, Zap } from 'lucide-react'

interface StatsData {
  emotionTrends: any[]
  routineStats: any[]
  goalProgress: any[]
  activitySummary: {
    total_reflections: number
    completed_tasks: number
    total_goals: number
    avg_emotion_score: number
  }
  recentActivity: any[]
  period: string
}

const EMOTION_COLORS = {
  '매우 좋음': '#10B981',
  '좋음': '#3B82F6', 
  '보통': '#F59E0B',
  '나쁨': '#EF4444',
  '매우 나쁨': '#7C2D12'
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#e74c3c']

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('7')

  useEffect(() => {
    fetchStats()
  }, [period])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/stats?days=${period}`)
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('통계 데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return <div className="container mx-auto p-6">데이터를 불러올 수 없습니다.</div>
  }

  // 감정 트렌드 데이터 가공
  const emotionTrendData = stats.emotionTrends.reduce((acc: any[], curr) => {
    const date = new Date(curr.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
    const existing = acc.find(item => item.date === date)
    
    if (existing) {
      existing[curr.emotion] = (existing[curr.emotion] || 0) + curr.count
    } else {
      acc.push({
        date,
        [curr.emotion]: curr.count
      })
    }
    return acc
  }, []).slice(0, 7).reverse()

  // 루틴 달성률 데이터
  const routineData = stats.routineStats.map(stat => ({
    date: new Date(stat.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
    completion_rate: stat.total_tasks > 0 ? Math.round((stat.completed_tasks / stat.total_tasks) * 100) : 0,
    completed: stat.completed_tasks,
    total: stat.total_tasks
  })).slice(0, 7).reverse()

  // 감정 점수 계산
  const getEmotionScore = (emotion: string) => {
    const scoreMap: any = {
      '매우 좋음': 5,
      '좋음': 4,
      '보통': 3,
      '나쁨': 2,
      '매우 나쁨': 1
    }
    return scoreMap[emotion] || 3
  }

  return (
    <>
      <div className="container mx-auto p-6 max-w-7xl pb-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">나의 성장 리포트</h1>
        <p className="text-muted-foreground">지난 {stats.period} 활동을 한눈에 살펴보세요</p>
      </div>

      {/* 기간 선택 */}
      <div className="mb-6">
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="7">7일</TabsTrigger>
            <TabsTrigger value="30">30일</TabsTrigger>
            <TabsTrigger value="90">90일</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 요약 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900">
          <div className="absolute top-0 right-0 w-20 h-20 bg-pink-200 dark:bg-pink-800 rounded-full -translate-y-10 translate-x-10 opacity-20"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-pink-700 dark:text-pink-300">총 회고</CardTitle>
            <div className="p-2 bg-pink-100 dark:bg-pink-800 rounded-lg">
              <Heart className="h-4 w-4 text-pink-600 dark:text-pink-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pink-900 dark:text-pink-100">{stats.activitySummary.total_reflections}</div>
            <p className="text-xs text-pink-600 dark:text-pink-400 mt-1">기록된 회고 수</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 dark:bg-green-800 rounded-full -translate-y-10 translate-x-10 opacity-20"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">완료한 할일</CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.activitySummary.completed_tasks}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">달성한 일일 과제</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full -translate-y-10 translate-x-10 opacity-20"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">진행 중인 목표</CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.activitySummary.total_goals}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">설정한 목표 수</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 dark:bg-purple-800 rounded-full -translate-y-10 translate-x-10 opacity-20"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">평균 감정 점수</CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
              <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
              {stats.activitySummary.avg_emotion_score ? 
                parseFloat(stats.activitySummary.avg_emotion_score.toString()).toFixed(1) : '3.0'}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">5점 만점</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 감정 트렌드 차트 */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                감정 변화 추이
              </CardTitle>
            </div>
            <CardDescription className="text-slate-600 dark:text-slate-400">지난 {period}일간 감정 기록</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={emotionTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
                {Object.keys(EMOTION_COLORS).map(emotion => (
                  <Line 
                    key={emotion}
                    type="monotone" 
                    dataKey={emotion} 
                    stroke={EMOTION_COLORS[emotion as keyof typeof EMOTION_COLORS]} 
                    strokeWidth={3}
                    dot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 루틴 달성률 차트 */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                루틴 달성률
              </CardTitle>
            </div>
            <CardDescription className="text-slate-600 dark:text-slate-400">일별 할일 완료율</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={routineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => [
                    name === 'completion_rate' ? `${value}%` : value,
                    name === 'completion_rate' ? '달성률' : name
                  ]}
                />
                <Bar 
                  dataKey="completion_rate" 
                  fill="url(#colorGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 목표 진행도 */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              목표 진행 현황
            </CardTitle>
          </div>
          <CardDescription className="text-slate-600 dark:text-slate-400">설정한 목표들의 달성 상황</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {stats.goalProgress.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center">
                  <Target className="h-8 w-8 text-slate-500 dark:text-slate-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400">설정된 목표가 없습니다.</p>
              </div>
            ) : (
              stats.goalProgress.map((goal, index) => (
                <div key={index} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">{goal.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 font-medium"
                      >
                        {goal.progress_percentage || 0}%
                      </Badge>
                      {goal.daily_streak > 0 && (
                        <Badge 
                          variant="outline" 
                          className="flex items-center gap-1 border-amber-200 text-amber-700 bg-amber-50 dark:border-amber-700 dark:text-amber-300 dark:bg-amber-950"
                        >
                          <Zap className="h-3 w-3" />
                          {goal.daily_streak}일 연속
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Progress 
                    value={goal.progress_percentage || 0} 
                    className="h-3 mb-3 bg-slate-200 dark:bg-slate-700"
                  />
                  {goal.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{goal.description}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      </div>
      <NavBar activeTab="stats" />
    </>
  )
}