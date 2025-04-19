import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "./components/Navigation";

export const metadata: Metadata = {
  title: "리플렉트 AI - 성찰 기반 일정 앱",
  description: "과거의 나와 대화하는 AI 성찰 일기장",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-mint-50 min-h-screen font-sans">
        <main className="flex flex-col min-h-screen">
          <div className="flex-1 w-full max-w-3xl mx-auto pt-4 pb-28 px-2 md:px-0">
            {children}
          </div>
          <Navigation />
        </main>
      </body>
    </html>
  );
}
