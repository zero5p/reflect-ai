"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SchedulePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/calendar")
  }, [router])

  return null

}