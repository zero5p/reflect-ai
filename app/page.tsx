"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace("/analysis")
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-mumu-cream-light to-mumu-warm dark:from-mumu-cream-dark dark:to-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4">
          <img src="/mumu_mascot.png" alt="무무" className="w-full h-full object-contain animate-spin" />
        </div>
        <p className="text-mumu-brown">분석 페이지로 이동 중...</p>
      </div>
    </div>
  )
}