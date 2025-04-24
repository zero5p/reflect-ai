"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GoogleLoginButton } from "@/components/auth/google-login-button"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
    setTimeout(() => {
      router.push("/")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-violet-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <CardTitle className="text-2xl font-bold text-violet-900">Reflect-AI</CardTitle>
          <CardDescription className="text-violet-600">당신의 AI 기반 성찰 및 일정 관리 도우미</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoggedIn ? (
            <div className="text-center py-4 text-green-600">로그인 성공! 홈 페이지로 이동합니다...</div>
          ) : (
            <>
              <GoogleLoginButton onSuccess={handleLoginSuccess} />
              <div className="text-center text-xs text-violet-500 mt-6">
                로그인하면 Reflect-AI의 모든 기능을 이용할 수 있습니다.
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
