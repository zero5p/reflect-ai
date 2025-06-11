"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SparklesIcon, CheckIcon, XIcon, LoaderIcon } from "lucide-react"

interface AIRecommendationProps {
  onAccept: (recommendation: string) => void
  onReject: () => void
}

export function AIRecommendation({ onAccept, onReject }: AIRecommendationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [recommendation, setRecommendation] = useState<string | null>(null)

  const generateRecommendation = () => {
    setIsLoading(true)

    // 실제 구현에서는 API 호출을 통해 AI 추천을 받아옵니다
    setTimeout(() => {
      const recommendations = [
        "오전 10시에 팀 회의 일정을 잡아보세요. 최근 성찰에서 팀 협업에 대한 고민이 보입니다.",
        "내일 오후 3시에 30분 동안 명상 시간을 가져보세요. 스트레스 관리에 도움이 될 것입니다.",
        "이번 주 금요일에 자기 개발 시간을 2시간 확보해보세요. 최근 성찰에서 새로운 기술 학습에 대한 의지가 보입니다.",
        "다음 주 월요일 오전에 주간 계획 수립 시간을 가져보세요. 체계적인 계획이 필요해 보입니다.",
      ]

      const randomIndex = Math.floor(Math.random() * recommendations.length)
      setRecommendation(recommendations[randomIndex])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-violet-100/70 to-indigo-100/70 dark:from-violet-900/30 dark:to-indigo-900/30 border-violet-200 dark:border-violet-800">
      {!recommendation && !isLoading && (
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-violet-200 dark:bg-violet-800/50 rounded-full">
              <SparklesIcon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
          <div>
            <h3 className="font-medium text-foreground">AI 일정 추천</h3>
            <p className="text-sm text-muted-foreground mt-1">
              당신의 성찰 기록을 분석하여 최적의 일정을 추천해 드립니다.
            </p>
          </div>
          <Button onClick={generateRecommendation} className="w-full">
            추천 받기
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="text-center space-y-4 py-2">
          <div className="flex justify-center">
            <LoaderIcon className="h-8 w-8 text-violet-600 dark:text-violet-400 animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground">성찰 기록을 분석하고 있습니다...</p>
        </div>
      )}

      {recommendation && !isLoading && (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-violet-200 dark:bg-violet-800/50 rounded-full flex-shrink-0 mt-1">
              <SparklesIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">AI 추천</h3>
              <p className="text-sm text-foreground mt-1">{recommendation}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1 bg-white dark:bg-violet-950/50"
              onClick={() => onAccept(recommendation)}
            >
              <CheckIcon className="h-4 w-4 mr-1" /> 수락
            </Button>
            <Button variant="outline" className="flex-1" onClick={onReject}>
              <XIcon className="h-4 w-4 mr-1" /> 거절
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
