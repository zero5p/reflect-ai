"use client"

import { BookOpenIcon, BarChart3Icon, UserIcon, CalendarIcon, TargetIcon, TrendingUpIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface NavBarProps {
  activeTab: string
}

export function NavBar({ activeTab }: NavBarProps) {
  const navItems = [
    {
      id: "home",
      label: "홈",
      icon: <CalendarIcon className="h-5 w-5" />,
      href: "/",
    },
    {
      id: "goals",
      label: "목표",
      icon: <TargetIcon className="h-5 w-5" />,
      href: "/goals",
    },
    {
      id: "reflection",
      label: "성찰",
      icon: <BookOpenIcon className="h-5 w-5" />,
      href: "/reflection",
    },
    {
      id: "profile",
      label: "프로필",
      icon: <UserIcon className="h-5 w-5" />,
      href: "/profile",
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-3 pb-safe flex justify-between items-center">
      {navItems.map((item) => (
        <Link key={item.id} href={item.href} className="flex flex-col items-center justify-center">
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-1 px-3 py-2 transition-all",
              activeTab === item.id
                ? "text-violet-700 dark:text-violet-400"
                : "text-violet-400 dark:text-violet-600 hover:text-violet-600 dark:hover:text-violet-500",
            )}
          >
            <div
              className={cn(
                "transition-all",
                activeTab === item.id ? "text-violet-700 dark:text-violet-400" : "text-violet-400 dark:text-violet-600",
              )}
            >
              {item.icon}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </div>
        </Link>
      ))}
    </nav>
  )
}