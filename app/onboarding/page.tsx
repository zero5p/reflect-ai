"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRightIcon, SparklesIcon, HeartIcon } from "lucide-react"
import { AnimatedPage } from "@/components/page-transition"

const EMOTION_OPTIONS = [
  {
    id: "sunny",
    label: "새로운 시작 기분",
    icon: "🌅",
    description: "뭔가 좋은 일이 일어날 것 같아요"
  },
  {
    id: "cozy", 
    label: "포근하고 따뜻한 기분",
    icon: "🌸",
    description: "마음이 편안하고 안정되어요"
  },
  {
    id: "okay",
    label: "그럭저럭 괜찮은 기분", 
    icon: "🌤️",
    description: "평범하지만 나쁘지 않아요"
  },
  {
    id: "melancholy",
    label: "촉촉하게 젖은 기분",
    icon: "🌧️", 
    description: "조금 우울하거나 생각이 많아요"
  },
  {
    id: "complex",
    label: "마음이 복잡한 기분",
    icon: "⛈️",
    description: "여러 감정이 뒤섞여 있어요"
  }
]

export default function OnboardingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedEmotion, setSelectedEmotion] = useState("")
  const [reflectionText, setReflectionText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aiResponse, setAiResponse] = useState("")

  // 로그인 안 된 경우 리다이렉트
  useEffect(() => {
    if (!session) {
      router.push('/login')
    }
  }, [session, router])

  const handleEmotionSelect = (emotionId: string) => {
    setSelectedEmotion(emotionId)
    setTimeout(() => {
      setStep(2)
    }, 500)
  }

  const handleSubmitReflection = async () => {
    if (!reflectionText.trim() || !selectedEmotion) return

    setIsSubmitting(true)
    setStep(3)

    try {
      // 첫 성찰 저장 및 AI 분석 요청
      const response = await fetch('/api/reflections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `첫 번째 성찰 - ${selectedEmotionData?.label}`,
          content: reflectionText
        }),
      })

      const data = await response.json()

      if (data.success) {
        // AI 응답 또는 기본 환영 메시지
        const welcomeMessage = data.data?.response || 
          "무무노트에 오신 것을 환영해요! 첫 번째 성찰을 소중히 받았습니다. 앞으로 함께 성장해나가요! 🐾💕"
        
        setAiResponse(welcomeMessage)
        
        // 3초 후 메인으로 이동
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } else {
        throw new Error('성찰 저장 실패')
      }
    } catch (error) {
      console.error('온보딩 실패:', error)
      setAiResponse("무무가 잠깐 졸고 있었나봐요! 하지만 당신의 첫 성찰을 기억할게요. 🐾")
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedEmotionData = EMOTION_OPTIONS.find(e => e.id === selectedEmotion)

  if (!session) {
    return null // 로딩 중
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-b from-mumu-cream-light to-mumu-warm dark:from-mumu-cream-dark dark:to-background flex flex-col">
        {/* 진행 표시 */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8">
              <img 
                src="/mumu_mascot.png" 
                alt="무무" 
                className="w-full h-full object-contain animate-mumu-float"
              />
            </div>
            <span className="text-sm text-mumu-brown font-medium">무무와 함께하는 첫 여행</span>
          </div>
          
          <div className="flex gap-2">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  step >= num ? 'bg-mumu-brown' : 'bg-mumu-accent/30'
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-mumu-brown mt-1">약 30초 소요</div>
        </div>

        <div className="flex-1 px-5 pb-10">
          <AnimatePresence mode="wait">
            {/* Step 1: 감정 선택 */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-mumu-brown-dark mb-2">
                    안녕하세요, {session.user?.name}님! 🌟
                  </h1>
                  <p className="text-mumu-brown">
                    지금 기분이 어떠신가요?
                  </p>
                </div>

                <div className="space-y-3">
                  {EMOTION_OPTIONS.map((emotion, index) => (
                    <motion.div
                      key={emotion.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={`p-4 cursor-pointer transition-all hover:scale-105 hover:shadow-lg bg-mumu-cream/60 dark:bg-mumu-cream-dark/60 border-mumu-accent hover:border-mumu-brown ${
                          selectedEmotion === emotion.id ? 'ring-2 ring-mumu-brown bg-mumu-brown/10' : ''
                        }`}
                        onClick={() => handleEmotionSelect(emotion.id)}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{emotion.icon}</span>
                          <div className="flex-1">
                            <h3 className="font-medium text-mumu-brown-dark">{emotion.label}</h3>
                            <p className="text-sm text-mumu-brown">{emotion.description}</p>
                          </div>
                          <ChevronRightIcon className="w-5 h-5 text-mumu-brown" />
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: 한 줄 입력 */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-3xl">{selectedEmotionData?.icon}</span>
                    <h2 className="text-xl font-bold text-mumu-brown-dark">
                      {selectedEmotionData?.label}
                    </h2>
                  </div>
                  <p className="text-mumu-brown">
                    그 기분이 든 이유를 한 줄로 적어주세요
                  </p>
                </div>

                <Card className="p-4 bg-mumu-cream/80 dark:bg-mumu-cream-dark/80 border-mumu-accent">
                  <Textarea
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="예: 오늘 아침에 따뜻한 햇살을 보니 기분이 좋아졌어요"
                    className="min-h-[120px] border-0 bg-transparent resize-none focus:ring-0 text-mumu-brown-dark placeholder:text-mumu-brown/60"
                    maxLength={200}
                    autoFocus
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-mumu-brown">
                      {reflectionText.length}/200
                    </span>
                    <Button
                      onClick={handleSubmitReflection}
                      disabled={!reflectionText.trim()}
                      className="bg-mumu-brown hover:bg-mumu-brown-dark text-mumu-cream disabled:opacity-50"
                    >
                      <SparklesIcon className="w-4 h-4 mr-2" />
                      무무에게 전달하기
                    </Button>
                  </div>
                </Card>

                <div className="text-center">
                  <p className="text-xs text-mumu-brown">
                    무무가 당신의 첫 성찰을 분석해드릴게요
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 3: AI 피드백 */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: isSubmitting ? Infinity : 0 }}
                    className="w-16 h-16 mx-auto mb-4"
                  >
                    <img 
                      src="/mumu_mascot.png" 
                      alt="무무" 
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                  
                  {isSubmitting ? (
                    <div>
                      <h2 className="text-xl font-bold text-mumu-brown-dark mb-2">
                        무무가 분석 중이에요... 🤔
                      </h2>
                      <p className="text-mumu-brown">잠시만 기다려주세요</p>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-xl font-bold text-mumu-brown-dark mb-2">
                        첫 성찰 완료! 🎉
                      </h2>
                      <p className="text-mumu-brown">무무의 따뜻한 응답이 도착했어요</p>
                    </div>
                  )}
                </div>

                {aiResponse && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Card className="p-6 bg-gradient-to-r from-mumu-brown-light/90 to-mumu-brown/90 dark:from-mumu-brown/80 dark:to-mumu-brown-dark/80 border-mumu-accent text-mumu-cream">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 mt-1">
                          <img 
                            src="/mumu_mascot.png" 
                            alt="무무" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-mumu-cream-light leading-relaxed">
                            {aiResponse}
                          </p>
                          <div className="flex items-center gap-1 mt-3 text-mumu-cream/80">
                            <HeartIcon className="w-4 h-4" />
                            <span className="text-sm">무무가</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {!isSubmitting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-center"
                  >
                    <p className="text-sm text-mumu-brown mb-2">
                      무무노트 여행이 시작되었어요!
                    </p>
                    <p className="text-xs text-mumu-brown">
                      잠시 후 메인 화면으로 이동합니다...
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AnimatedPage>
  )
}