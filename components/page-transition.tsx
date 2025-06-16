"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import { useDrag } from "@use-gesture/react"
import { useState, useEffect, ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
}

// iOS 스타일 페이지 전환 애니메이션 (opacity 제거로 하얀 화면 방지)
const pageVariants = {
  initial: {
    x: "100%"
  },
  in: {
    x: 0
  },
  out: {
    x: "-100%"
  }
}

const pageTransition = {
  type: "tween",
  ease: [0.25, 0.1, 0.25, 1], // 더 부드러운 easing
  duration: 0.25 // 조금 더 빠르게
}

export function PageTransition({ children }: PageTransitionProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // 뒤로가기 가능한 페이지들 정의
  const canGoBack = pathname !== "/" && !pathname.includes("/login")

  // 스와이프 제스처 설정
  const bind = useDrag(
    ({ down, movement: [mx], velocity: [vx], direction: [dx] }) => {
      // 왼쪽 가장자리에서 시작하는 경우만 허용
      if (!canGoBack) return

      setIsDragging(down)
      
      if (down) {
        // 드래그 중일 때
        if (mx > 0) {
          setDragX(Math.min(mx, window.innerWidth))
        }
      } else {
        // 드래그 끝났을 때
        const threshold = window.innerWidth * 0.3 // 30% 이상 드래그하거나
        const velocityThreshold = 0.5 // 빠른 속도로 스와이프하면 뒤로가기
        
        if (mx > threshold || (dx > 0 && vx > velocityThreshold)) {
          // 뒤로가기 실행
          router.back()
        }
        
        setDragX(0)
      }
    },
    {
      axis: "x",
      filterTaps: true,
      rubberband: true
    }
  )

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-mumu-cream-light to-mumu-warm dark:from-mumu-cream-dark dark:to-background">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          style={{
            x: isDragging ? dragX : undefined,
            touchAction: "pan-y" // 세로 스크롤 허용
          }}
          {...(canGoBack ? bind() : {})}
          className="w-full h-full bg-gradient-to-b from-mumu-cream-light to-mumu-warm dark:from-mumu-cream-dark dark:to-background"
        >
          {children}
          
          {/* 드래그 중일 때 이전 페이지 시뮬레이션 */}
          {isDragging && dragX > 50 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-mumu-cream-light to-mumu-warm dark:from-mumu-cream-dark dark:to-background border-r border-mumu-accent shadow-lg"
              style={{
                x: dragX - window.innerWidth,
                zIndex: -1
              }}
            >
              <div className="p-4 pt-16">
                <div className="w-8 h-8 bg-mumu-brown rounded-lg mb-2 flex items-center justify-center">
                  <img 
                    src="/mumu_mascot.png" 
                    alt="무무" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="h-4 bg-mumu-accent rounded mb-2"></div>
                <div className="h-4 bg-mumu-accent rounded w-3/4"></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 opacity-30">
                  <img 
                    src="/mumu_mascot.png" 
                    alt="무무" 
                    className="w-full h-full object-contain animate-mumu-float"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// 개별 페이지 컴포넌트용 래퍼 (opacity 제거, 위치 애니메이션만)
export function AnimatedPage({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ y: 10 }}
      animate={{ y: 0 }}
      exit={{ y: -10 }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 400,
        duration: 0.15
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  )
}

// 카드나 모달 등의 등장 애니메이션
export function SlideUpCard({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 500,
        duration: 0.3
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// 부드러운 리스트 아이템 애니메이션
export function AnimatedListItem({ 
  children, 
  index = 0, 
  className = "" 
}: { 
  children: ReactNode
  index?: number
  className?: string 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        type: "tween",
        ease: [0.4, 0, 0.2, 1],
        duration: 0.3,
        delay: index * 0.1
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}