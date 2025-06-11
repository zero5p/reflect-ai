"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ActionCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  actionIcon?: React.ReactNode
  onClick?: () => void
  className?: string
}

export function ActionCard({ title, description, icon, actionIcon, onClick, className }: ActionCardProps) {
  return (
    <Card
      className={cn(
        "flex items-center justify-between p-4 cursor-pointer hover:bg-violet-50/50 transition-all duration-300",
        className,
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex-shrink-0 p-2 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-lg text-violet-600">
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-medium text-violet-900">{title}</h3>
          <p className="text-xs text-violet-600">{description}</p>
        </div>
      </div>
      {actionIcon && <div className="text-violet-500">{actionIcon}</div>}
    </Card>
  )
}
