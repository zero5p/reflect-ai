"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface NavItemProps {
  icon: React.ReactNode
  label: string
  isActive?: boolean
  onClick?: () => void
}

export function NavItem({ icon, label, isActive = false, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 px-4 py-2 transition-all",
        isActive ? "text-violet-700" : "text-violet-400 hover:text-violet-600",
      )}
    >
      <div className={cn("transition-all", isActive ? "text-violet-700" : "text-violet-400")}>{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
