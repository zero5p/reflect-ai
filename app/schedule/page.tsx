"use client"

import { useSession } from "next-auth/react"
import { CalendarIcon, ArrowLeftIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SchedulePage() {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) {
    router.push("/login")
    return null
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
          <CalendarIcon className="h-6 w-6 text-violet-600" />
          <span className="font-bold text-foreground text-lg">일정 관리</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 overflow-y-auto mb-16">
        <div className="mb-4">
          <Link href="/schedule/new">
            <Button className="w-full flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              새로운 일정 추가하기
            </Button>
          </Link>
        </div>

        <Card className="p-6 text-center">
          <CalendarIcon className="h-16 w-16 text-violet-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">일정 관리</h2>
          <p className="text-muted-foreground mb-4">
            AI가 추천하는 일정과 개인 스케줄을 관리해보세요.
          </p>
          
          {/* Sample schedule items */}
          <div className="space-y-3 text-left">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">오늘 14:00</span>
                <span className="text-xs text-muted-foreground bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded">AI 추천</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🧘</span>
                <span className="text-sm text-blue-700 dark:text-blue-300">10분 명상 시간</span>
              </div>
              <div className="text-xs text-muted-foreground">스트레스 해소를 위한 명상을 추천드려요</div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-700 dark:text-green-300">내일 09:00</span>
                <span className="text-xs text-muted-foreground bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded">개인 일정</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💼</span>
                <span className="text-sm text-green-700 dark:text-green-300">팀 미팅</span>
              </div>
              <div className="text-xs text-muted-foreground">프로젝트 진행 상황 논의</div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">금요일 19:00</span>
                <span className="text-xs text-muted-foreground bg-amber-100 dark:bg-amber-900/40 px-2 py-1 rounded">AI 추천</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🎬</span>
                <span className="text-sm text-amber-700 dark:text-amber-300">영화 감상 시간</span>
              </div>
              <div className="text-xs text-muted-foreground">한 주의 피로를 풀어주는 여가 시간</div>
            </div>
          </div>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <NavBar activeTab="schedule" />
    </div>
  )
}