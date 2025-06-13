"use client"

import { useSession } from "next-auth/react"
import { UserIcon, ArrowLeftIcon, SettingsIcon, LogOutIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { cachedFetch } from "@/lib/cache"

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalReflections: 0,
    completedEvents: 0,
    consecutiveDays: 0,
    achievementRate: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      if (!session?.user?.email) {
        setIsLoading(false)
        return
      }

      try {
        const data = await cachedFetch(`/api/dashboard?email=${session.user.email}`, undefined, 2)
        
        if (data.success) {
          setStats(data.data.stats)
        }
      } catch (error) {
        console.error('통계 데이터를 가져오는 중 오류가 발생했습니다:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [session?.user?.email])

  if (!session) {
    router.push("/login")
    return null
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

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
            <img 
              src="/mumu_mascot.png" 
              alt="무무" 
              className="w-6 h-6 object-contain"
            />
          </div>
          <span className="font-bold text-mumu-brown-dark text-lg">프로필</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 overflow-y-auto mb-16">
        {/* User Info Card */}
        <Card className="p-6 mb-6 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent backdrop-blur-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-mumu-accent dark:bg-mumu-brown/30 rounded-full flex items-center justify-center">
              {session.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <img 
                  src="/mumu_mascot.png" 
                  alt="무무" 
                  className="w-10 h-10 object-contain"
                />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-mumu-brown-dark">{session.user?.name || "사용자"}</h2>
              <p className="text-mumu-brown">{session.user?.email}</p>
            </div>
          </div>
        </Card>

        {/* Stats Card */}
        <Card className="p-6 mb-6 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4 text-mumu-brown-dark">활동 통계</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-mumu-accent/50 dark:bg-mumu-brown/20 rounded-lg">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-mumu-brown-light dark:bg-mumu-brown rounded mb-2 mx-auto w-12"></div>
                  <div className="h-4 bg-mumu-brown-light dark:bg-mumu-brown rounded mx-auto w-16"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-mumu-brown-dark">{stats.totalReflections}</div>
                  <div className="text-sm text-mumu-brown">작성한 성찰</div>
                </>
              )}
            </div>
            <div className="text-center p-4 bg-mumu-brown-light/30 dark:bg-mumu-brown/20 rounded-lg">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-mumu-brown-light dark:bg-mumu-brown rounded mb-2 mx-auto w-12"></div>
                  <div className="h-4 bg-mumu-brown-light dark:bg-mumu-brown rounded mx-auto w-16"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-mumu-brown-dark">{stats.completedEvents}</div>
                  <div className="text-sm text-mumu-brown">완료한 일정</div>
                </>
              )}
            </div>
            <div className="text-center p-4 bg-mumu-warm/30 dark:bg-mumu-brown/20 rounded-lg">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-mumu-brown-light dark:bg-mumu-brown rounded mb-2 mx-auto w-12"></div>
                  <div className="h-4 bg-mumu-brown-light dark:bg-mumu-brown rounded mx-auto w-16"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-mumu-brown-dark">{stats.consecutiveDays}</div>
                  <div className="text-sm text-mumu-brown">연속 사용일</div>
                </>
              )}
            </div>
            <div className="text-center p-4 bg-mumu-accent/30 dark:bg-mumu-brown/20 rounded-lg">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-mumu-brown-light dark:bg-mumu-brown rounded mb-2 mx-auto w-12"></div>
                  <div className="h-4 bg-mumu-brown-light dark:bg-mumu-brown rounded mx-auto w-16"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-mumu-brown-dark">{stats.achievementRate}%</div>
                  <div className="text-sm text-mumu-brown">목표 달성률</div>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Settings Card */}
        <Card className="p-6 mb-6 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4 text-mumu-brown-dark">설정</h3>
          <div className="space-y-3">
            <Button variant="ghost" className="w-full justify-start" disabled>
              <SettingsIcon className="h-4 w-4 mr-2" />
              알림 설정
              <span className="ml-auto text-xs text-mumu-brown">준비 중</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start" disabled>
              <UserIcon className="h-4 w-4 mr-2" />
              개인정보 수정
              <span className="ml-auto text-xs text-mumu-brown">준비 중</span>
            </Button>
          </div>
        </Card>

        {/* Logout */}
        <Card className="p-6 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent backdrop-blur-sm">
          <Button 
            variant="outline" 
            className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 bg-mumu-cream dark:bg-mumu-brown/20"
            onClick={handleSignOut}
          >
            <LogOutIcon className="h-4 w-4 mr-2" />
            로그아웃
          </Button>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <NavBar activeTab="profile" />
    </div>
  )
}