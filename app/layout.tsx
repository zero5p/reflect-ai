import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "리플렉트 AI - 성찰 기반 일정 앱",
  description: "과거의 나와 대화하는 AI 성찰 일기장",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen pb-14`}
      >
        <div className="max-w-screen-md mx-auto">
          <header className="bg-white p-4 border-b">
            <h1 className="text-xl font-bold">리플렉트 AI</h1>
          </header>
          <main className="p-4">
            {children}
          </main>
          <Navigation />
        </div>
      </body>
    </html>
  );
}