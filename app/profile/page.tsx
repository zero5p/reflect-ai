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
        const response = await fetch(`/api/profile/stats?email=${session.user.email}`)
        const data = await response.json()
        
        if (data.success) {
          setStats(data.stats)
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
    <div className="min-h-screen bg-gradient-to-b from-violet-50/50 to-background dark:from-violet-950/30 dark:to-background flex flex-col">
      {/* Header */}
      <header className="flex items-center px-5 py-4 bg-background border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="mr-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 flex-1">
          <UserIcon className="h-6 w-6 text-violet-600" />
          <span className="font-bold text-foreground text-lg">프로필</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 overflow-y-auto mb-16">
        {/* User Info Card */}
        <Card className="p-6 mb-6 bg-card dark:bg-card border-border">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center">
              {session.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <UserIcon className="h-8 w-8 text-violet-600" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-card-foreground">{session.user?.name || "사용자"}</h2>
              <p className="text-muted-foreground">{session.user?.email}</p>
            </div>
          </div>
        </Card>

        {/* Stats Card */}
        <Card className="p-6 mb-6 bg-card dark:bg-card border-border">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">활동 통계</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-violet-50 dark:bg-gray-700/50 rounded-lg">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-violet-200 dark:bg-violet-800 rounded mb-2 mx-auto w-12"></div>
                  <div className="h-4 bg-violet-200 dark:bg-violet-800 rounded mx-auto w-16"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-violet-600">{stats.totalReflections}</div>
                  <div className="text-sm text-muted-foreground">작성한 성찰</div>
                </>
              )}
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-gray-700/50 rounded-lg">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-blue-200 dark:bg-blue-800 rounded mb-2 mx-auto w-12"></div>
                  <div className="h-4 bg-blue-200 dark:bg-blue-800 rounded mx-auto w-16"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-blue-600">{stats.completedEvents}</div>
                  <div className="text-sm text-muted-foreground">완료한 일정</div>
                </>
              )}
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-gray-700/50 rounded-lg">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-green-200 dark:bg-green-800 rounded mb-2 mx-auto w-12"></div>
                  <div className="h-4 bg-green-200 dark:bg-green-800 rounded mx-auto w-16"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-green-600">{stats.consecutiveDays}</div>
                  <div className="text-sm text-muted-foreground">연속 사용일</div>
                </>
              )}
            </div>
            <div className="text-center p-4 bg-amber-50 dark:bg-gray-700/50 rounded-lg">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-amber-200 dark:bg-amber-800 rounded mb-2 mx-auto w-12"></div>
                  <div className="h-4 bg-amber-200 dark:bg-amber-800 rounded mx-auto w-16"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-amber-600">{stats.achievementRate}%</div>
                  <div className="text-sm text-muted-foreground">목표 달성률</div>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Settings Card */}
        <Card className="p-6 mb-6 bg-card dark:bg-card border-border">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">설정</h3>
          <div className="space-y-3">
            <Button variant="ghost" className="w-full justify-start" disabled>
              <SettingsIcon className="h-4 w-4 mr-2" />
              알림 설정
              <span className="ml-auto text-xs text-muted-foreground">준비 중</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start" disabled>
              <UserIcon className="h-4 w-4 mr-2" />
              개인정보 수정
              <span className="ml-auto text-xs text-muted-foreground">준비 중</span>
            </Button>
          </div>
        </Card>

        {/* Logout */}
        <Card className="p-6 bg-card dark:bg-card border-border">
          <Button 
            variant="outline" 
            className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
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