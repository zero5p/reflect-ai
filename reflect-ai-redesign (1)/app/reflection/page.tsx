"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, ZapIcon } from "lucide-react"
import Link from "next/link"
import { NavBar } from "@/components/nav-bar"

// Mock reflection data
const reflectionData = [
  {
    id: 1,
    date: "2023년 6월 15일",
    emotion: "😊",
    content: "오늘은 프로젝트를 시작했다. 새로운 도전에 대한 기대감이 크다.",
  },
  {
    id: 2,
    date: "2023년 6월 13일",
    emotion: "😡",
    content: "팀 미팅에서 의견 충돌이 있었다. 내 주장을 더 명확히 설명했어야 했는데.",
  },
  {
    id: 3,
    date: "2023년 6월 11일",
    emotion: "😊",
    content: "오랜만에 친구를 만나서 좋은 시간을 보냈다. 일상에서 벗어나는 시간이 필...",
  },
  {
    id: 4,
    date: "2023년 6월 9일",
    emotion: "🤔",
    content: "다가오는 발표가 걱정된다. 더 많은 준비가 필요할 것 같다.",
  },
]

export default function ReflectionPage() {
  const [filter, setFilter] = useState("")
  const [emotionFilter, setEmotionFilter] = useState("전체 감정")

  // Filter reflections based on search and emotion filter
  const filteredReflections = reflectionData.filter((reflection) => {
    const matchesSearch = reflection.content.includes(filter) || reflection.date.includes(filter)
    const matchesEmotion = emotionFilter === "전체 감정" || reflection.emotion === emotionFilter
    return matchesSearch && matchesEmotion
  })

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
        {filteredReflections.length > 0 ? (
          filteredReflections.map((reflection) => (
            <Card key={reflection.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{reflection.emotion}</div>
                <div className="flex-1">
                  <div className="text-xs text-violet-500 mb-1">{reflection.date}</div>
                  <div className="text-sm text-violet-900">{reflection.content}</div>
                </div>
                <Button variant="ghost" size="sm" className="text-violet-500">
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
