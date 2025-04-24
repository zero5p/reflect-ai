"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SparklesIcon, BookOpenIcon, CalendarIcon, BarChart3Icon } from "lucide-react"

export default function Onboarding() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-violet-100 to-white dark:from-violet-950/50 dark:to-background p-4">
      <Card className="w-full max-w-md p-8 flex flex-col items-center gap-6 shadow-xl border-violet-200 dark:border-violet-800">
        {/* Logo & Title */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-14 w-14 rounded-2xl bg-violet-600 flex items-center justify-center mb-2">
            <SparklesIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-violet-700 dark:text-violet-300">Reflect-AI</h1>
          <p className="text-sm text-muted-foreground text-center mt-1">
            AI 기반 감정 성찰 & 일정 관리 서비스
          </p>
        </div>
        {/* Feature Highlights */}
        <div className="w-full grid grid-cols-1 gap-4">
          <div className="flex items-center gap-3">
            <BookOpenIcon className="h-6 w-6 text-violet-500" />
            <span className="text-sm">자기반 감정 일기 기록</span>
          </div>
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-6 w-6 text-emerald-500" />
            <span className="text-sm">맞춤 일정 추천 & 인사이트</span>
          </div>
          <div className="flex items-center gap-3">
            <BarChart3Icon className="h-6 w-6 text-blue-500" />
            <span className="text-sm">나만의 성장 데이터</span>
          </div>
        </div>
        {/* Call to Action */}
        <Button
          className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white text-base font-semibold py-3 rounded-xl shadow"
          size="lg"
          onClick={() => signIn("google")}
        >
          Google로 시작하기
        </Button>
        <div className="text-xs text-muted-foreground text-center mt-2">
          회원가입과 로그인이 동시에 진행됩니다.<br />
          Reflect-AI는 여러분의 개인정보를 안전하게 보호합니다.
        </div>
      </Card>
      <div className="mt-8 text-xs text-muted-foreground text-center">
        © {new Date().getFullYear()} Reflect-AI. 모든 권리 보유.<br />
        <a href="#" className="underline">이용약관</a> · <a href="#" className="underline">개인정보 처리방침</a>
      </div>
    </div>
  )
}
