"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, ZapIcon } from "lucide-react"
import Link from "next/link"
import { NavBar } from "@/components/nav-bar"
import { fetchReflections, deleteReflection } from "@/app/lib/api"

interface Reflection {
  id: string
  date: string
  emotion: string
  content: string
}

export default function ReflectionPage() {
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [filter, setFilter] = useState("")
  const [emotionFilter, setEmotionFilter] = useState("전체 감정")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch reflections from API
  useEffect(() => {
    setLoading(true)
    fetchReflections()
      .then((data) => {
        setReflections(data)
        setLoading(false)
      })
      .catch(() => {
        setError("성찰 데이터를 불러오지 못했습니다.")
        setLoading(false)
      })
  }, [])

  // Filter reflections based on search and emotion filter
  const filteredReflections = reflections.filter((reflection) => {
    const matchesSearch = reflection.content.includes(filter) || reflection.date.includes(filter)
    const matchesEmotion = emotionFilter === "전체 감정" || reflection.emotion === emotionFilter
    return matchesSearch && matchesEmotion
  })

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return
    try {
      await deleteReflection(id)
      setReflections((prev) => prev.filter((r) => r.id !== id))
    } catch {
      alert("삭제에 실패했습니다.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex flex-col">
      {/* Header */}
      <Card className="mx-5 mt-5 mb-4 bg-violet-100/70 border-violet-200">
        <div className="p-4">
          <h1 className="text-lg font-bold text-violet-900">나의 성찰 기록</h1>
          <p className="text-xs text-violet-700 mb-3">감정과 생각을 기록하고, 나만의 인사이트를 발견하세요.</p>
          <Link href="/reflection/new">
            <Button className="flex items-center gap-2">
              <ZapIcon className="h-4 w-4" />새 성찰 작성
            </Button>
          </Link>
        </div>
      </Card>

      {/* Filters */}
      <Card className="mx-5 mb-4">
        <div className="p-4">
          <h2 className="text-sm font-medium text-violet-900 mb-3">필터/검색</h2>
          <div className="flex gap-2">
            <Input
              placeholder="검색어 입력"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-1"
            />
            <Select value={emotionFilter} onValueChange={setEmotionFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="전체 감정" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="전체 감정">전체 감정</SelectItem>
                <SelectItem value="😊">😊 행복</SelectItem>
                <SelectItem value="😡">😡 화남</SelectItem>
                <SelectItem value="🤔">🤔 고민</SelectItem>
                <SelectItem value="😢">😢 슬픔</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Reflection List */}
      <div className="px-5 mb-20 space-y-3">
        {loading ? (
          <div className="text-center py-8 text-violet-500">불러오는 중...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : filteredReflections.length > 0 ? (
          filteredReflections.map((reflection) => (
            <Card key={reflection.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{reflection.emotion}</div>
                <div className="flex-1">
                  <div className="text-xs text-violet-500 mb-1">{reflection.date}</div>
                  <div className="text-sm text-violet-900">{reflection.content}</div>
                </div>
                <Button variant="ghost" size="sm" className="text-violet-500" onClick={() => handleDelete(reflection.id)}>
                  삭제
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-violet-500">검색 결과가 없습니다.</div>
        )}
      </div>

      {/* Floating action button */}
      <Link href="/reflection/new" className="fixed bottom-20 right-5">
        <Button size="icon" className="h-12 w-12 rounded-full bg-violet-600 hover:bg-violet-700 shadow-lg">
          <PlusIcon className="h-6 w-6" />
        </Button>
      </Link>

      {/* Bottom Navigation */}
      <NavBar activeTab="reflection" />
    </div>
  )
}
