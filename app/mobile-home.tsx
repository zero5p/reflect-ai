"use client"

import { useState } from "react"
import {
  HomeIcon,
  BookOpenIcon,
  BarChartIcon as ChartBarIcon,
  UserIcon,
  ArrowRightIcon,
  LightbulbIcon as LightBulbIcon,
  BarChartIcon as ChartBarSquareIcon,
  ShieldCheckIcon,
  BarChart3Icon as Bars3Icon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { FeatureCard } from "@/components/feature-card"
import { NavItem } from "@/components/nav-item"
import { ActionCard } from "@/components/action-card"

export default function MobileHome() {
  const [activeTab, setActiveTab] = useState("home")

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex flex-col">
      {/* Header */}
      <header className="flex items-center px-5 py-4 bg-white border-b border-violet-100">
        <div className="flex items-center gap-2 flex-1">
          <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-violet-900 text-lg">Reflect-AI</span>
        </div>
        <Button variant="ghost" size="icon" className="text-violet-500">
          <Bars3Icon className="h-5 w-5" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-6 overflow-y-auto">
        <div className="space-y-2 mb-6">
          <h1 className="text-2xl font-bold text-violet-900">Welcome to Reflect-AI</h1>
          <p className="text-violet-600">Your AI-powered reflection companion</p>
        </div>

        <div className="flex flex-col gap-3 mb-8">
          <Button>Get Started</Button>
          <Button variant="secondary">Learn More</Button>
        </div>

        {/* Feature Cards */}
        <div className="space-y-4 mb-8">
          <FeatureCard
            icon={<LightBulbIcon className="h-5 w-5" />}
            title="Smart Analysis"
            description="Get AI-powered insights from your daily reflections"
          />
          <FeatureCard
            icon={<ChartBarSquareIcon className="h-5 w-5" />}
            title="Progress Tracking"
            description="Monitor your growth with detailed analytics"
          />
          <FeatureCard
            icon={<ShieldCheckIcon className="h-5 w-5" />}
            title="Privacy First"
            description="Your data is encrypted and secure with us"
          />
        </div>

        {/* Action Cards */}
        <div className="space-y-4">
          <ActionCard
            title="Daily Reflection"
            description="Start your daily journal entry"
            className="bg-gradient-to-r from-violet-100/70 to-indigo-100/70 border-violet-200"
            actionIcon={<ArrowRightIcon className="h-5 w-5" />}
          />
          <ActionCard
            title="View Insights"
            description="See your personalized AI insights"
            className="bg-gradient-to-r from-indigo-100/70 to-violet-100/70 border-indigo-200"
            actionIcon={<ArrowRightIcon className="h-5 w-5" />}
          />
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="bg-white border-t border-violet-100 px-2 py-2 flex justify-between items-center">
        <NavItem
          icon={<HomeIcon className="h-5 w-5" />}
          label="Home"
          isActive={activeTab === "home"}
          onClick={() => setActiveTab("home")}
        />
        <NavItem
          icon={<BookOpenIcon className="h-5 w-5" />}
          label="Journal"
          isActive={activeTab === "journal"}
          onClick={() => setActiveTab("journal")}
        />
        <NavItem
          icon={<ChartBarIcon className="h-5 w-5" />}
          label="Stats"
          isActive={activeTab === "stats"}
          onClick={() => setActiveTab("stats")}
        />
        <NavItem
          icon={<UserIcon className="h-5 w-5" />}
          label="Profile"
          isActive={activeTab === "profile"}
          onClick={() => setActiveTab("profile")}
        />
      </nav>
    </div>
  )
}
