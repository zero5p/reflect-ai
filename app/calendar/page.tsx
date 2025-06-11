"use client"

import { useSession } from "next-auth/react"
import { CalendarIcon, ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CalendarPage() {
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
          <span className="font-bold text-foreground text-lg">캘린더</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 overflow-y-auto mb-16">
        <Card className="p-6 text-center">
          <CalendarIcon className="h-16 w-16 text-violet-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">캘린더 기능 준비 중</h2>
          <p className="text-muted-foreground mb-4">
            일정 관리와 성찰 기록을 캘린더로 확인할 수 있는 기능을 준비하고 있습니다.
          </p>
          <div className="space-y-2">
            <div className="text-sm text-left bg-muted p-3 rounded-lg">
              <strong>예정 기능:</strong>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>• 월간 성찰 기록 보기</li>
                <li>• 일정 등록 및 관리</li>
                <li>• AI 추천 일정 확인</li>
                <li>• 감정 패턴 시각화</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <NavBar activeTab="calendar" />
    </div>
  )
}