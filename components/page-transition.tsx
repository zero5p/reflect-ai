"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import { ReactNode } from "react"

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
            touchAction: "pan-y" // 세로 스크롤만 허용
          }}
          className="w-full h-full bg-gradient-to-b from-mumu-cream-light to-mumu-warm dark:from-mumu-cream-dark dark:to-background"
        >
          {children}
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