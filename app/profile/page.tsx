"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { UserIcon, BellIcon, MoonIcon, GlobeIcon, ShieldIcon, LogOutIcon } from "lucide-react"
import { NavBar } from "@/components/nav-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "@/components/theme-provider"

interface Profile {
  name: string
  email: string
  bio: string
  notifications: boolean
  dataSharing: boolean
  avatar?: string
}

export default function ProfilePage() {
  const { theme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Profile>({ name: "", email: "", bio: "", notifications: false, dataSharing: false, avatar: "" })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 프로필 정보 불러오기
  useEffect(() => {
    setLoading(true)
    fetch("/api/profile")
      .then(async (res) => {
        if (!res.ok) throw new Error("프로필 정보를 불러올 수 없습니다.")
        return res.json()
      })
      .then((data) => {
        setFormData(data)
        setLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggle = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "저장 실패")
      }
      const data = await res.json()
      setFormData(data)
      setIsEditing(false)
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-violet-500">로딩 중...</div>
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/50 to-background dark:from-violet-950/30 dark:to-background flex flex-col">
      {/* Header */}
      <header className="flex items-center px-5 py-4 bg-background border-b border-border">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">프로필</h1>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 overflow-y-auto mb-16 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>내 정보</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (isEditing) {
                    handleSave()
                  } else {
                    setIsEditing(true)
                  }
                }}
                disabled={loading}
              >
                {isEditing ? "저장" : "수정"}
              </Button>
            </div>
            <CardDescription>개인 정보 및 프로필 설정</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="h-24 w-24 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
                <UserIcon className="h-12 w-12 text-violet-600 dark:text-violet-400" />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                />
              </div>

              <div>
                <Label htmlFor="bio">자기소개</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>설정</CardTitle>
            <CardDescription>앱 설정 및 개인정보 관리</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-violet-100 dark:bg-violet-900/50">
                  <BellIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="font-medium text-foreground">알림</p>
                  <p className="text-xs text-muted-foreground">앱 알림 및 리마인더</p>
                </div>
              </div>
              <Switch
                checked={formData.notifications}
                onCheckedChange={(checked) => handleToggle("notifications", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-violet-100 dark:bg-violet-900/50">
                  <MoonIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="font-medium text-foreground">다크 모드</p>
                  <p className="text-xs text-muted-foreground">화면 테마 설정</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                현재: {theme === "dark" ? "다크 모드" : theme === "light" ? "라이트 모드" : "시스템 설정"}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-violet-100 dark:bg-violet-900/50">
                  <GlobeIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="font-medium text-foreground">언어</p>
                  <p className="text-xs text-muted-foreground">앱 언어 설정</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">한국어</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-violet-100 dark:bg-violet-900/50">
                  <ShieldIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="font-medium text-foreground">데이터 공유</p>
                  <p className="text-xs text-muted-foreground">AI 개선을 위한 익명 데이터 공유</p>
                </div>
              </div>
              <Switch
                checked={formData.dataSharing}
                onCheckedChange={(checked) => handleToggle("dataSharing", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button variant="outline" className="w-full flex items-center gap-2 text-destructive border-destructive/30">
          <LogOutIcon className="h-4 w-4" />
          로그아웃
        </Button>
      </main>

      {/* Bottom Navigation */}
      <NavBar activeTab="profile" />
    </div>
  )
}
