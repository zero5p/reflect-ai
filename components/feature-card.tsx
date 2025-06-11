import type React from "react"
import { Card } from "@/components/ui/card"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="flex items-start gap-4 p-4 hover:bg-violet-50/50 transition-all duration-300">
      <div className="flex-shrink-0 p-2.5 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-xl text-violet-600">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-violet-900">{title}</h3>
        <p className="text-sm text-violet-600">{description}</p>
      </div>
    </Card>
  )
}
