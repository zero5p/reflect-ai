"use client"

import { useSession } from "next-auth/react"
import { BarChart3Icon, ArrowRightIcon, LightbulbIcon, CalendarIcon, FileTextIcon, SparklesIcon, ZapIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { ActionCard } from "@/components/action-card"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useState, useEffect } from "react"
import { cachedFetch } from "@/lib/cache"
import { AnimatedPage, SlideUpCard, AnimatedListItem } from "@/components/page-transition"
import { JustDoItMode } from "@/components/just-do-it-mode"

export default function Page() {
  const { data: session } = useSession()
  const [recentReflection, setRecentReflection] = useState<any>(null)
  const [todayEvents, setTodayEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [memoryData, setMemoryData] = useState<{
    days7: any,
    days30: any,
    days90: any
  }>({ days7: null, days30: null, days90: null })
  const [isLoadingMemory, setIsLoadingMemory] = useState(true)
  const [showJustDoIt, setShowJustDoIt] = useState(false)
  const [shouldShowJustDoIt, setShouldShowJustDoIt] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.email) {
        setIsLoading(false)
        setIsLoadingMemory(false)
        return
      }

      try {
        // 대시보드 데이터 가져오기
        const data = await cachedFetch(`/api/dashboard?email=${session.user.email}`, undefined, 1)
        
        if (data.success) {
          setRecentReflection(data.data.recentReflection)
          setTodayEvents(data.data.todayEvents)
        }

        // 메모리 데이터 가져오기 (7일, 30일, 90일 전)
        const [memory7, memory30, memory90] = await Promise.all([
          cachedFetch('/api/reflections/memory?days=7', undefined, 5),
          cachedFetch('/api/reflections/memory?days=30', undefined, 5),
          cachedFetch('/api/reflections/memory?days=90', undefined, 5)
        ])

        setMemoryData({
          days7: memory7.success ? memory7.data : null,
          days30: memory30.success ? memory30.data : null,
          days90: memory90.success ? memory90.data : null
        })

        // 의지력 고갈 상태 확인
        const justDoItResponse = await cachedFetch('/api/just-do-it', undefined, 2)
        if (justDoItResponse.success && justDoItResponse.data.burnoutLevel !== 'low') {
          setShouldShowJustDoIt(true)
        }

      } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다:', error)
      } finally {
        setIsLoading(false)
        setIsLoadingMemory(false)
      }
    }

    fetchData()
  }, [session?.user?.email])

  return (
    <div className="min-h-screen bg-gradient-to-b from-mumu-cream-light to-mumu-warm dark:from-mumu-cream-dark dark:to-background flex flex-col relative overflow-hidden">
      {/* 무무 마스코트 떠다니는 장식 */}
      <div className="absolute top-20 right-4 w-16 h-16 animate-mumu-float opacity-30 pointer-events-none z-0">
        <img 
          src="/mumu_mascot.png" 
          alt="무무" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Header */}
      <header className="flex items-center px-5 py-4 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 backdrop-blur-sm border-b border-mumu-accent relative z-10">
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
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-mumu-brown">안녕하세요, {session.user?.name}님</span>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="secondary" size="sm" className="text-sm bg-mumu-accent text-mumu-brown-dark hover:bg-mumu-brown hover:text-mumu-cream">
                로그인
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 overflow-y-auto mb-16">
        {/* Hero Section */}
        <Card className="mb-6 overflow-hidden bg-gradient-to-r from-mumu-brown-light/90 to-mumu-brown/90 dark:from-mumu-brown/80 dark:to-mumu-brown-dark/80 border-mumu-accent text-mumu-cream relative">
          <div className="flex p-4">
            <div className="flex-1 pr-4">
              <h1 className="text-xl font-bold mb-2 text-mumu-cream-light">무무와 함께 마음을 기록해요.</h1>
              <p className="text-sm opacity-90 mb-3 text-mumu-cream">따뜻한 성찰로 더 포근한 하루를 만들어보세요.</p>
              <Link href={session ? "/reflection/new" : "/login"}>
                <Button className="bg-mumu-cream/20 hover:bg-mumu-cream/30 dark:bg-mumu-cream-dark/70 dark:hover:bg-mumu-cream/80 backdrop-blur-sm border border-mumu-cream/30 dark:border-mumu-accent shadow-lg flex items-center gap-2">
                  <SparklesIcon className="h-4 w-4" />
                  성찰 시작하기
                </Button>
              </Link>
            </div>
            <div className="flex-shrink-0 hidden sm:block">
              <div className="bg-mumu-cream/20 backdrop-blur-sm text-mumu-cream rounded-full p-3 flex flex-col items-center">
                <div className="w-8 h-8 mb-1">
                  <img 
                    src="/mumu_mascot.png" 
                    alt="무무 AI" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs font-medium">무무</span>
                <span className="text-xs font-medium">AI</span>
              </div>
            </div>
          </div>
          {/* 배경 무무 장식 */}
          <div className="absolute bottom-2 right-2 w-6 h-6 opacity-20">
            <img 
              src="/mumu_mascot.png" 
              alt="" 
              className="w-full h-full object-contain animate-mumu-float"
            />
          </div>
        </Card>

        {/* What is Reflect-AI */}
        <Card className="mb-6 p-4 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent backdrop-blur-sm relative">
          <h2 className="text-lg font-bold mb-3 text-mumu-brown-dark">무무와 함께하는 무무노트</h2>
          <ul className="space-y-2 text-sm text-mumu-brown">
            <li className="flex items-start">
              <span className="mr-2 text-mumu-brown-light">🌱</span>
              <span>자기 성찰 감정 일기 기록</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-mumu-brown-light">🎯</span>
              <span>맞춤 일정 추천 & 인사이트</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-mumu-brown-light">📈</span>
              <span>나만의 성장 데이터</span>
            </li>
          </ul>
          {/* 작은 무무 장식 */}
          <div className="absolute top-2 right-2 w-4 h-4 opacity-30">
            <img 
              src="/mumu_mascot.png" 
              alt="" 
              className="w-full h-full object-contain"
            />
          </div>
        </Card>

        {/* 그냥 하기 모드 알림 (의지력 고갈 감지 시) */}
        {shouldShowJustDoIt && (
          <Card className="mb-4 p-4 bg-gradient-to-r from-orange-100/80 to-yellow-100/80 dark:from-orange-900/30 dark:to-yellow-900/30 border-orange-300 dark:border-orange-600 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8">
                <img 
                  src="/mumu_mascot.png" 
                  alt="무무" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-orange-800 dark:text-orange-200">무무가 눈치챘어요!</h3>
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  요즘 조금 지쳐 보이시네요. 작은 것부터 시작해볼까요?
                </p>
              </div>
              <Button
                onClick={() => setShowJustDoIt(true)}
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <ZapIcon className="w-3 h-3 mr-1" />
                그냥 하기
              </Button>
            </div>
          </Card>
        )}

        {/* 무무의 시간여행 */}
        <Card className="mb-6 p-4 bg-gradient-to-r from-mumu-accent/30 to-mumu-brown-light/20 dark:from-mumu-brown/40 dark:to-mumu-brown-dark/30 border-mumu-accent backdrop-blur-sm relative">
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
          
          {isLoadingMemory ? (
            <div className="space-y-3">
              {[7, 30, 90].map((days) => (
                <div key={days} className="animate-pulse">
                  <div className="h-4 bg-mumu-accent/30 rounded mb-1"></div>
                  <div className="h-3 bg-mumu-accent/20 rounded w-32"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {/* 7일 전 */}
              <div className="flex items-center gap-3 p-2 rounded-lg bg-mumu-cream/30 dark:bg-mumu-brown/20">
                <span className="text-lg">🕐</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-mumu-brown-dark">7일 전의 나</div>
                  {memoryData.days7 ? (
                    <div className="text-xs text-mumu-brown">
                      <span className="mr-2">
                        {memoryData.days7.emotion === 'happy' ? '😊' : 
                         memoryData.days7.emotion === 'sad' ? '😢' : 
                         memoryData.days7.emotion === 'angry' ? '😠' : 
                         memoryData.days7.emotion === 'excited' ? '😆' : '😐'}
                      </span>
                      {memoryData.days7.title?.substring(0, 20)}...
                    </div>
                  ) : (
                    <div className="text-xs text-mumu-brown opacity-60">그때는 기록이 없었어요</div>
                  )}
                </div>
              </div>

              {/* 30일 전 */}
              <div className="flex items-center gap-3 p-2 rounded-lg bg-mumu-cream/30 dark:bg-mumu-brown/20">
                <span className="text-lg">🗓️</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-mumu-brown-dark">30일 전의 나</div>
                  {memoryData.days30 ? (
                    <div className="text-xs text-mumu-brown">
                      <span className="mr-2">
                        {memoryData.days30.emotion === 'happy' ? '😊' : 
                         memoryData.days30.emotion === 'sad' ? '😢' : 
                         memoryData.days30.emotion === 'angry' ? '😠' : 
                         memoryData.days30.emotion === 'excited' ? '😆' : '😐'}
                      </span>
                      {memoryData.days30.title?.substring(0, 20)}...
                    </div>
                  ) : (
                    <div className="text-xs text-mumu-brown opacity-60">한 달 전엔 무무와 함께하지 않았네요</div>
                  )}
                </div>
              </div>

              {/* 90일 전 */}
              <div className="flex items-center gap-3 p-2 rounded-lg bg-mumu-cream/30 dark:bg-mumu-brown/20">
                <span className="text-lg">⭐</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-mumu-brown-dark">90일 전의 나</div>
                  {memoryData.days90 ? (
                    <div className="text-xs text-mumu-brown">
                      <span className="mr-2">
                        {memoryData.days90.emotion === 'happy' ? '😊' : 
                         memoryData.days90.emotion === 'sad' ? '😢' : 
                         memoryData.days90.emotion === 'angry' ? '😠' : 
                         memoryData.days90.emotion === 'excited' ? '😆' : '😐'}
                      </span>
                      {memoryData.days90.title?.substring(0, 20)}...
                    </div>
                  ) : (
                    <div className="text-xs text-mumu-brown opacity-60">계절이 바뀌었지만 기록은 없었어요</div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* 작은 무무 장식 */}
          <div className="absolute top-2 right-2 w-4 h-4 opacity-30">
            <img 
              src="/mumu_mascot.png" 
              alt="" 
              className="w-full h-full object-contain animate-mumu-float"
            />
          </div>
        </Card>

        {/* Recent Entries */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link href={session ? "/reflection" : "/login"} className="block">
            <Card className="bg-mumu-brown-light/40 dark:bg-mumu-brown/30 p-4 h-full border-mumu-accent backdrop-blur-sm">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-mumu-brown-dark">최근 일기</span>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-mumu-brown hover:bg-mumu-accent">
                    더보기
                  </Button>
                </div>
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-mumu-accent rounded mb-2"></div>
                    <div className="h-3 bg-mumu-accent rounded w-20"></div>
                  </div>
                ) : recentReflection ? (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{recentReflection.emotion === 'happy' ? '😊' : recentReflection.emotion === 'sad' ? '😢' : recentReflection.emotion === 'angry' ? '😠' : recentReflection.emotion === 'excited' ? '😆' : '😐'}</span>
                      <span className="text-sm text-mumu-brown-dark">
                        {recentReflection.title?.substring(0, 15)}...
                      </span>
                    </div>
                    <div className="text-xs text-mumu-brown mt-auto">
                      {new Date(recentReflection.created_at).toLocaleDateString('ko-KR')}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5">
                        <img src="/mumu_mascot.png" alt="무무" className="w-full h-full object-contain" />
                      </div>
                      <span className="text-sm text-mumu-brown-dark">첫 번째 성찰을 시작해보세요</span>
                    </div>
                    <div className="text-xs text-mumu-brown mt-auto">아직 작성된 성찰이 없습니다</div>
                  </>
                )}
              </div>
            </Card>
          </Link>

          <Link href={session ? "/calendar" : "/login"} className="block">
            <Card className="bg-mumu-accent/60 dark:bg-mumu-brown-light/30 p-4 h-full border-mumu-brown-light backdrop-blur-sm">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-mumu-brown-dark">오늘의 일정</span>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-mumu-brown hover:bg-mumu-brown-light/40">
                    더보기
                  </Button>
                </div>
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-mumu-brown-light/50 rounded mb-2"></div>
                    <div className="h-3 bg-mumu-brown-light/50 rounded w-24"></div>
                  </div>
                ) : todayEvents.length > 0 ? (
                  <>
                    <div className="text-sm text-mumu-brown-dark mb-1">
                      {todayEvents[0].title}...
                    </div>
                    <div className="text-xs text-mumu-brown mt-auto">
                      {todayEvents[0].time} {todayEvents.length > 1 ? `외 ${todayEvents.length - 1}개의 일정` : ''}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-sm text-mumu-brown-dark mb-1">오늘 일정이 없습니다</div>
                    <div className="text-xs text-mumu-brown mt-auto">새로운 일정을 추가해보세요</div>
                  </>
                )}
              </div>
            </Card>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link href={session ? "/reflection/new" : "/login"}>
            <ActionCard
              title="오늘의 성찰"
              description="당신의 하루는 어땠나요? 감정과 생각을 기록해보세요."
              icon={<FileTextIcon className="h-5 w-5" />}
              actionIcon={<ArrowRightIcon className="h-4 w-4" />}
              className="bg-gradient-to-r from-emerald-100/70 to-emerald-50/70 dark:from-emerald-900/30 dark:to-emerald-900/20 border-emerald-200 dark:border-emerald-800 h-full"
            />
          </Link>

          <Link href={session ? "/schedule" : "/login"}>
            <ActionCard
              title="AI 일정 추천"
              description="과거 경험을 바탕으로 최적화된 일정을 추천합니다."
              icon={<LightbulbIcon className="h-5 w-5" />}
              actionIcon={<ArrowRightIcon className="h-4 w-4" />}
              className="bg-gradient-to-r from-violet-100/70 to-violet-50/70 dark:from-violet-900/30 dark:to-violet-900/20 border-violet-200 dark:border-violet-800 h-full"
            />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link href={session ? "/reflection" : "/login"}>
            <ActionCard
              title="나의 인사이트"
              description="당신의 감정 패턴과 성장을 분석합니다."
              icon={<BarChart3Icon className="h-5 w-5" />}
              actionIcon={<ArrowRightIcon className="h-4 w-4" />}
              className="bg-gradient-to-r from-indigo-100/70 to-indigo-50/70 dark:from-indigo-900/30 dark:to-indigo-900/20 border-indigo-200 dark:border-indigo-800 h-full"
            />
          </Link>

          <Link href={session ? "/calendar" : "/login"}>
            <ActionCard
              title="캘린더"
              description="월간 감정 기록과 일정을 확인하세요."
              icon={<CalendarIcon className="h-5 w-5" />}
              actionIcon={<ArrowRightIcon className="h-4 w-4" />}
              className="bg-gradient-to-r from-blue-100/70 to-blue-50/70 dark:from-blue-900/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800 h-full"
            />
          </Link>
        </div>
      </main>

      {/* 플로팅 그냥 하기 버튼 */}
      <Button
        onClick={() => setShowJustDoIt(true)}
        className="fixed bottom-20 right-4 w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg z-40 flex items-center justify-center"
        title="그냥 하기 모드"
      >
        <ZapIcon className="w-5 h-5" />
      </Button>

      {/* Bottom Navigation */}
      <NavBar activeTab="home" />

      {/* 그냥 하기 모드 모달 */}
      <JustDoItMode 
        isVisible={showJustDoIt} 
        onClose={() => setShowJustDoIt(false)} 
      />
    </div>
  )
}