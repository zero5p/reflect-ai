import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import NextAuthSessionProvider from "./session-provider"
import { PageTransition } from "@/components/page-transition"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "무무노트 - 당신의 AI 기반 성찰 및 일정 관리 도우미",
  description: "AI를 활용한 감정 기록 및 일정 관리 서비스",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8B4513" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="무무노트" />
        <link rel="apple-touch-icon" href="/mumu_mascot.png" />
      </head>
      <body className={inter.className}>
        <NextAuthSessionProvider>
          <ThemeProvider defaultTheme="system" storageKey="reflect-ai-theme">
            <PageTransition>
              {children}
            </PageTransition>
          </ThemeProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}