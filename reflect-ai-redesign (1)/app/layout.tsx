import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Reflect AI - 당신의 AI 기반 성찰 및 일정 관리 도우미",
  description: "AI를 활용한 감정 기록 및 일정 관리 서비스",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="reflect-ai-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
