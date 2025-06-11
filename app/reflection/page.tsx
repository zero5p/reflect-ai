"use client"

import { useSession } from "next-auth/react"
import { BookOpenIcon, ArrowLeftIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ReflectionPage() {
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
          <BookOpenIcon className="h-6 w-6 text-violet-600" />
          <span className="font-bold text-foreground text-lg">성찰 일기</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 overflow-y-auto mb-16">
        <div className="mb-4">
          <Link href="/reflection/new">
            <Button className="w-full flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              새로운 성찰 작성하기
            </Button>
          </Link>
        </div>

        <Card className="p-6 text-center">
          <BookOpenIcon className="h-16 w-16 text-violet-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">성찰 일기 목록</h2>
          <p className="text-muted-foreground mb-4">
            아직 작성된 성찰 일기가 없습니다. 첫 번째 성찰을 시작해보세요!
          </p>
          
          {/* Sample entries */}
          <div className="space-y-3 text-left">
            <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-200 dark:border-violet-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-violet-700 dark:text-violet-300">오늘의 성찰</span>
                <span className="text-xs text-muted-foreground">2023.06.12</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">😊</span>
                <span className="text-sm text-violet-700 dark:text-violet-300">오늘은 프로젝트가 잘 진행되어 기분이 좋았다...</span>
              </div>
              <div className="text-xs text-muted-foreground">감정: 기쁨 | 강도: 높음</div>
            </div>
            
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">어제의 성찰</span>
                <span className="text-xs text-muted-foreground">2023.06.11</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🤔</span>
                <span className="text-sm text-emerald-700 dark:text-emerald-300">업무에서 어려운 결정을 내려야 했다...</span>
              </div>
              <div className="text-xs text-muted-foreground">감정: 고민 | 강도: 보통</div>
            </div>
          </div>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <NavBar activeTab="reflection" />
    </div>
  )
}