"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GoogleLoginButton } from "@/components/auth/google-login-button"

export default function LoginPage() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card dark:bg-card border-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-violet-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <CardTitle className="text-2xl font-bold text-card-foreground text-violet-900">Reflect-AI</CardTitle>
          <CardDescription className="text-muted-foreground text-violet-600">당신의 AI 기반 성찰 및 일정 관리 도우미</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <GoogleLoginButton />
          <div className="text-center text-xs text-violet-500 mt-6">
            로그인하면 Reflect-AI의 모든 기능을 이용할 수 있습니다.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}