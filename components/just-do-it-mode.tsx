"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ZapIcon, CheckCircleIcon, RefreshCwIcon, HeartIcon, ClockIcon } from "lucide-react"

interface MicroAction {
  title: string
  description: string
  timeEstimate: string
  difficulty: 'easy'
  category: string
}

interface JustDoItProps {
  isVisible: boolean
  onClose: () => void
}

export function JustDoItMode({ isVisible, onClose }: JustDoItProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [microActions, setMicroActions] = useState<MicroAction[]>([])
  const [burnoutInfo, setBurnoutInfo] = useState<{
    level: string
    reason: string
  } | null>(null)
  const [completedActions, setCompletedActions] = useState<number[]>([])

  useEffect(() => {
    if (isVisible) {
      fetchMicroActions()
    }
  }, [isVisible])

  const fetchMicroActions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/just-do-it')
      const data = await response.json()

      if (data.success) {
        setMicroActions(data.data.microActions)
        setBurnoutInfo({
          level: data.data.burnoutLevel,
          reason: data.data.reason
        })
      }
    } catch (error) {
      console.error('마이크로 액션 로딩 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleActionComplete = (index: number) => {
    setCompletedActions([...completedActions, index])
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '몸': return '💪'
      case '마음': return '🧘'
      case '공간': return '🏠'
      case '관계': return '💝'
      case '성장': return '🌱'
      default: return '✨'
    }
  }

  const getBurnoutColor = (level: string) => {
    switch (level) {
      case 'high': return 'border-red-300 bg-red-50 dark:bg-red-900/20'
      case 'medium': return 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20'
      case 'low': return 'border-green-300 bg-green-50 dark:bg-green-900/20'
      default: return 'border-mumu-accent bg-mumu-cream/50'
    }
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md bg-gradient-to-b from-mumu-cream-light to-mumu-warm dark:from-mumu-cream-dark dark:to-background rounded-xl shadow-xl"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10">
                <img 
                  src="/mumu_mascot.png" 
                  alt="무무" 
                  className="w-full h-full object-contain animate-mumu-float"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-mumu-brown-dark">그냥 하기 모드</h2>
                <p className="text-sm text-mumu-brown">무무가 아주 작은 행동을 추천해요</p>
              </div>
            </div>

            {burnoutInfo && (
              <Card className={`p-3 mb-4 ${getBurnoutColor(burnoutInfo.level)} border`}>
                <p className="text-sm text-mumu-brown-dark">
                  {burnoutInfo.reason} 😔
                </p>
                <p className="text-xs text-mumu-brown mt-1">
                  지금은 작은 것부터 시작해봐요!
                </p>
              </Card>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 pb-6">
            {isLoading ? (
              <div className="text-center py-8">
                <ZapIcon className="w-8 h-8 mx-auto mb-2 animate-spin-reverse text-mumu-brown" />
                <p className="text-sm text-mumu-brown">
                  무무가 맞춤 액션을 만들고 있어요...
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {microActions.map((action, index) => {
                  const isCompleted = completedActions.includes(index)
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`p-4 transition-all ${
                        isCompleted 
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-300' 
                          : 'bg-mumu-cream/60 dark:bg-mumu-cream-dark/60 border-mumu-accent hover:bg-mumu-cream/80'
                      }`}>
                        <div className="flex items-start gap-3">
                          <span className="text-xl mt-1">
                            {getCategoryIcon(action.category)}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-medium ${
                                isCompleted ? 'line-through text-mumu-brown/60' : 'text-mumu-brown-dark'
                              }`}>
                                {action.title}
                              </h3>
                              <span className="text-xs bg-mumu-accent/50 px-2 py-1 rounded-full text-mumu-brown flex items-center gap-1">
                                <ClockIcon className="w-3 h-3" />
                                {action.timeEstimate}
                              </span>
                            </div>
                            <p className={`text-sm ${
                              isCompleted ? 'line-through text-mumu-brown/60' : 'text-mumu-brown'
                            }`}>
                              {action.description}
                            </p>
                          </div>
                          {isCompleted ? (
                            <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 mt-1" />
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleActionComplete(index)}
                              className="bg-mumu-brown hover:bg-mumu-brown-dark text-mumu-cream text-xs px-3 py-1"
                            >
                              완료
                            </Button>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* Footer */}
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={fetchMicroActions}
                disabled={isLoading}
                className="flex-1 border-mumu-brown text-mumu-brown hover:bg-mumu-brown hover:text-mumu-cream"
              >
                <RefreshCwIcon className="w-4 h-4 mr-2" />
                다른 액션
              </Button>
              <Button
                onClick={onClose}
                className="flex-1 bg-mumu-brown hover:bg-mumu-brown-dark text-mumu-cream"
              >
                <HeartIcon className="w-4 h-4 mr-2" />
                완료
              </Button>
            </div>

            {completedActions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-4"
              >
                <p className="text-sm text-mumu-brown">
                  🎉 {completedActions.length}개 완료! 잘하고 있어요!
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}