"use client"

import { useState, useEffect, Suspense } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { CalendarIcon, ArrowLeftIcon, CheckIcon, SparklesIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"

interface AIRecommendation {
  category: string
  title: string
  description: string
  recommendedTime: string
  type: string
}

function NewSchedulePageContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([])
  const [showAiRecommendations, setShowAiRecommendations] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'personal'
  })

  if (!session) {
    router.push("/login")
    return null
  }

  useEffect(() => {
    // AI 추천에서 온 경우 세션 스토리지에서 추천 데이터 로드
    if (searchParams.get('from') === 'ai') {
      const recommendations = sessionStorage.getItem('aiRecommendations')
      if (recommendations) {
        setAiRecommendations(JSON.parse(recommendations))
        setShowAiRecommendations(true)
        sessionStorage.removeItem('aiRecommendations')
      }
    }
  }, [searchParams])

  const generateAIRecommendations = async () => {
    setIsGeneratingAI(true)
    try {
      const response = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setAiRecommendations(data.recommendations || [])
        setShowAiRecommendations(true)
      } else {
        throw new Error(data.error || "AI 추천 생성에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error generating AI recommendations:", error)
      toast({
        title: "오류가 발생했습니다",
        description: "AI 추천 생성에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const selectRecommendation = (rec: AIRecommendation) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    setFormData({
      title: rec.title,
      description: rec.description,
      date: tomorrow.toISOString().split('T')[0],
      time: rec.recommendedTime || '09:00',
      type: 'ai_recommended'
    })
    setShowAiRecommendations(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "일정이 추가되었습니다",
          description: "새로운 일정이 성공적으로 저장되었습니다.",
        })
        router.push('/calendar')
      } else {
        const error = await response.json()
        toast({
          title: "오류가 발생했습니다",
          description: error.message || "일정 추가에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "오류가 발생했습니다",
        description: "네트워크 오류로 일정 추가에 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-mumu-cream-light to-mumu-warm dark:from-mumu-cream-dark dark:to-background flex flex-col relative overflow-hidden">
      {/* 무무 마스코트 떠다니는 장식 */}
      <div className="absolute top-20 right-4 w-16 h-16 animate-mumu-float opacity-30 pointer-events-none z-0">
        <img 
          src="/mumu_mascot.png" 
          alt="무무" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Header */}
      <header className="flex items-center px-5 py-4 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 backdrop-blur-sm border-b border-mumu-accent relative z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="mr-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 flex-1">
          <div className="h-8 w-8 rounded-lg bg-mumu-brown flex items-center justify-center">
            <img 
              src="/mumu_mascot.png" 
              alt="무무" 
              className="w-6 h-6 object-contain"
            />
          </div>
          <span className="font-bold text-mumu-brown-dark text-lg">새 일정 추가</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 overflow-y-auto">
        {showAiRecommendations ? (
          <div className="space-y-4">
            <Card className="p-4 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="h-5 w-5 text-mumu-brown-dark" />
                <h2 className="text-lg font-bold text-mumu-brown-dark">AI 맞춤 일정 추천</h2>
              </div>
              <p className="text-sm text-mumu-brown">성찰 내용을 바탕으로 생성된 맞춤 일정 추천입니다. 원하는 일정을 선택하세요.</p>
            </Card>

            {aiRecommendations.map((rec, index) => (
              <Card key={index} className="p-4 bg-mumu-accent/50 dark:bg-mumu-brown/20 border-mumu-brown-light hover:shadow-md transition-shadow cursor-pointer" onClick={() => selectRecommendation(rec)}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 rounded-full">
                      {rec.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{rec.recommendedTime}</span>
                  </div>
                  <PlusIcon className="h-4 w-4 text-violet-600" />
                </div>
                <h3 className="font-medium text-card-foreground mb-1">{rec.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{rec.description}</p>
              </Card>
            ))}

            <div className="flex gap-3">
              <Button
                onClick={() => setShowAiRecommendations(false)}
                variant="outline"
                className="flex-1"
              >
                직접 작성하기
              </Button>
              <Button
                onClick={generateAIRecommendations}
                disabled={isGeneratingAI}
                variant="outline"
                className="flex-1"
              >
                {isGeneratingAI ? "새 추천 생성 중..." : "새로운 추천 받기"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              onClick={generateAIRecommendations}
              disabled={isGeneratingAI}
              className="w-full flex items-center gap-2 bg-mumu-brown hover:bg-mumu-brown-dark text-mumu-cream"
            >
              <SparklesIcon className="h-4 w-4" />
              {isGeneratingAI ? "AI 추천 생성 중..." : "성찰 기반 AI 일정 추천 받기"}
            </Button>

            <Card className="p-6 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">일정 제목</Label>
              <Input
                id="title"
                placeholder="일정 제목을 입력하세요"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">설명 (선택사항)</Label>
              <Textarea
                id="description"
                placeholder="추가 설명을 입력하세요"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">날짜</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">시간</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">일정 종류</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="일정 종류를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">개인 일정</SelectItem>
                  <SelectItem value="work">업무</SelectItem>
                  <SelectItem value="health">건강/운동</SelectItem>
                  <SelectItem value="study">학습</SelectItem>
                  <SelectItem value="social">사교/모임</SelectItem>
                  <SelectItem value="ai_recommended">AI 추천</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-mumu-brown hover:bg-mumu-brown-dark text-mumu-cream" 
              disabled={isLoading || !formData.title || !formData.date || !formData.time}
            >
              {isLoading ? (
                "저장 중..."
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  일정 저장하기
                </>
              )}
            </Button>
          </form>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

export default function NewSchedulePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewSchedulePageContent />
    </Suspense>
  )
}