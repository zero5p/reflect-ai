"use client"

import { useSession } from "next-auth/react"
import { BarChart3Icon, ArrowRightIcon, LightbulbIcon, CalendarIcon, FileTextIcon, SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NavBar } from "@/components/nav-bar"
import { ActionCard } from "@/components/action-card"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function Page() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/50 to-background dark:from-violet-950/30 dark:to-background flex flex-col">
      {/* Header */}
      <header className="flex items-center px-5 py-4 bg-background border-b border-border">
        <div className="flex items-center gap-2 flex-1">
          <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-foreground text-lg">Reflect-AI</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">안녕하세요, {session.user?.name}님</span>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="secondary" size="sm" className="text-sm">
                로그인
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 overflow-y-auto mb-16">
        {/* Hero Section */}
        <Card className="mb-6 overflow-hidden bg-card dark:bg-card border-border bg-gradient-to-r from-emerald-400/90 to-violet-400/90 dark:from-emerald-600/50 dark:to-violet-600/50 border-0 text-white">
          <div className="flex p-4">
            <div className="flex-1 pr-4">
              <h1 className="text-xl font-bold mb-2 text-card-foreground">생각을 기록하면 마음이 가벼워져요.</h1>
              <p className="text-sm opacity-90 mb-3">나를 돌아보고, 더 가벼운 하루를 만들어보세요.</p>
              <Link href={session ? "/reflection/new" : "/login"}>
                <Button className="bg-white/20 hover:bg-white/30 dark:bg-gray-700/70 dark:hover:bg-gray-600/80 backdrop-blur-sm border border-white/30 dark:border-gray-500/50 shadow-lg flex items-center gap-2">
                  <SparklesIcon className="h-4 w-4" />
                  성찰 시작하기
                </Button>
              </Link>
            </div>
            <div className="flex-shrink-0 hidden sm:block">
              <div className="bg-emerald-500/80 dark:bg-emerald-600/80 text-white rounded-full p-3 flex flex-col items-center backdrop-blur-sm">
                <SparklesIcon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">AI</span>
                <span className="text-xs font-medium">성찰</span>
              </div>
            </div>
          </div>
        </Card>

        {/* What is Reflect-AI */}
        <Card className="mb-6 p-4 bg-card dark:bg-card border-border text-card-foreground">
          <h2 className="text-lg font-bold mb-3 text-card-foreground">Reflect-AI란?</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>자기 성찰 감정 일기 기록</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>맞춤 일정 추천 & 인사이트</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>나만의 성장 데이터</span>
            </li>
          </ul>
        </Card>

        {/* Recent Entries */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link href={session ? "/reflection" : "/login"} className="block">
            <Card className="bg-card dark:bg-card border-border bg-violet-100/70 dark:bg-violet-900/30 p-4 h-full border-violet-200 dark:border-violet-800">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-violet-800 dark:text-violet-300">최근 일기</span>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-violet-600 dark:text-violet-400">
                    더보기
                  </Button>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">😊</span>
                  <span className="text-sm text-violet-700 dark:text-violet-300">오늘은 프로젝트...</span>
                </div>
                <div className="text-xs text-violet-500 dark:text-violet-400 mt-auto">2023.06.12</div>
              </div>
            </Card>
          </Link>

          <Link href={session ? "/calendar" : "/login"} className="block">
            <Card className="bg-card dark:bg-card border-border bg-emerald-100/70 dark:bg-emerald-900/30 p-4 h-full border-emerald-200 dark:border-emerald-800">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">오늘의 일정</span>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-emerald-600 dark:text-emerald-400">
                    더보기
                  </Button>
                </div>
                <div className="text-sm text-emerald-700 dark:text-emerald-300 mb-1">김정희 회의...</div>
                <div className="text-xs text-emerald-500 dark:text-emerald-400 mt-auto">오전 10:30 외 2개의 일정</div>
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

      {/* Bottom Navigation */}
      <NavBar activeTab="home" />
    </div>
  )
}