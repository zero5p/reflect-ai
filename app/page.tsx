import Link from "next/link";
import {
  BookText,
  LineChart,
  TrendingUp,
  BarChart2,
  Zap,
  CalendarDays,
  Star,
  Clock,
} from "lucide-react";
import { mockReflections } from "./data/mockReflections";
import Image from "next/image";
import windowSvg from "../public/window.svg";
import Button from "./components/ui/Button";
import Card from "./components/ui/Card";
import LoginButton from "./components/LoginButton";

// 랜덤 멘트 리스트 (더 세련되고 위트 있게)
const MOTIVATION_QUOTES = [
  "오늘은 어떤 생각이 머물렀나요?",
  "나만의 리듬을 찾아가는 중이에요.",
  "작은 기록이 큰 변화를 만듭니다.",
  "마음의 온도를 체크해보세요.",
  "어제보다 한 걸음 더 가까이.",
  "지금 이 순간, 나를 위한 시간.",
  "오늘의 나, 충분히 괜찮아요.",
  "생각을 기록하면 마음이 가벼워져요.",
  "나를 이해하는 첫걸음, 성찰.",
  "AI가 함께, 나만의 일상 코치." 
];

export default function Home() {
  // 최근 성찰 1개, 오늘의 추천 일정 mock
  const latestReflection = mockReflections[0];
  const todaySchedule = {
    title: "집중력 최적화 일정",
    summary: "오전 집중 작업, 오후 협업 및 가벼운 작업",
  };
  // 랜덤 멘트
  const quote = MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)];

  return (
    <div className="flex flex-col gap-8 max-w-xl mx-auto px-4 pb-28">
      {/* 히어로 섹션 */}
      <Card color="mint" rounded shadow className="relative overflow-hidden text-white bg-gradient-to-r from-mint-400 to-lavender-400 p-8 flex flex-col gap-2 min-h-[180px] md:min-h-[170px] md:pl-44">
        <div className="absolute left-6 bottom-2 opacity-60 pointer-events-none select-none hidden md:block z-0">
          <Image src={windowSvg} alt="감성 창문 일러스트" width={110} height={110} className="drop-shadow-lg" />
        </div>
        <div className="absolute right-6 top-4 opacity-30 pointer-events-none select-none z-0">
          <Star className="w-32 h-32 text-yellow-200 animate-spin-slow" />
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 drop-shadow text-white">{quote}</h1>
          <p className="text-white/90 mb-4 md:text-lg">나를 돌아보고, 더 가벼운 하루를 만들어보세요.</p>
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <Button color="primary" size="lg" className="mt-2 mb-2 w-full md:w-auto" asChild>
              <Link href="/reflection/new" className="inline-flex items-center justify-center w-full">
                <Zap className="h-5 w-5 mr-2" /> 성찰 시작하기
              </Link>
            </Button>
            <div className="md:ml-4 flex justify-end md:justify-start">
              <LoginButton />
            </div>
          </div>
        </div>
      </Card>

      {/* 서비스 안내 */}
      <Card color="white" rounded shadow className="p-5 flex flex-col gap-2 border border-gray-100 text-gray-700">
        <h2 className="text-lg font-semibold mb-1">reflect-ai란?</h2>
        <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
          <li>AI 기반 감정/일정 기록</li>
          <li>맞춤 일정 추천 & 인사이트</li>
          <li>나만의 성장 데이터</li>
        </ul>
      </Card>

      {/* 요약 카드 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card color="lavender" rounded shadow className="flex items-center gap-4 px-5 py-4">
          <div className="text-3xl">
            {latestReflection ? (latestReflection.emotion === "기쁨" ? "😄" : latestReflection.emotion === "슬픔" ? "😢" : latestReflection.emotion === "화남" ? "😠" : latestReflection.emotion === "평온" ? "😌" : latestReflection.emotion === "불안" ? "😰" : latestReflection.emotion === "지루함" ? "😑" : "😐") : ""}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-gray-700 text-xs mb-1 font-semibold">최근 성찰</div>
            <div className="text-gray-900 font-medium truncate text-sm">{latestReflection ? latestReflection.content : "작성된 성찰이 없습니다."}</div>
            <div className="text-xs text-gray-400">{latestReflection ? new Date(latestReflection.createdAt).toLocaleDateString("ko-KR") : ""}</div>
          </div>
          <Button color="secondary" size="sm" asChild>
            <Link href="/reflection">더보기</Link>
          </Button>
        </Card>
        <Card color="mint" rounded shadow className="flex items-center gap-4 px-5 py-4">
          <div className="text-3xl">
            <CalendarDays className="w-7 h-7 text-mint-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-gray-700 text-xs mb-1 font-semibold">오늘의 일정</div>
            <div className="text-gray-900 font-medium truncate text-sm">{todaySchedule.title}</div>
            <div className="text-xs text-gray-400">{todaySchedule.summary}</div>
          </div>
          <Button color="mint" size="sm" asChild>
            <Link href="/schedule">더보기</Link>
          </Button>
        </Card>
      </div>

      {/* 주요 기능 카드 */}
      <div className="grid grid-cols-2 gap-4">
        <Card color="white" rounded shadow className="hover:shadow-xl transition-transform hover:-translate-y-1 duration-200 group">
          <div className="rounded-full bg-mint-100 w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <BookText className="h-6 w-6 text-mint-500" />
          </div>
          <h2 className="text-lg font-semibold mb-2">오늘의 성찰</h2>
          <p className="text-gray-600 mb-3">당신의 하루는 어땠나요? 감정과 생각을 기록해보세요.</p>
          <Button color="mint" size="md" asChild>
            <Link href="/reflection/new" className="flex items-center">
              성찰 기록하기
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </Link>
          </Button>
        </Card>
        <Card color="white" rounded shadow className="hover:shadow-xl transition-transform hover:-translate-y-1 duration-200 group">
          <div className="rounded-full bg-lavender-100 w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <LineChart className="h-6 w-6 text-lavender-500" />
          </div>
          <h2 className="text-lg font-semibold mb-2">AI 일정 추천</h2>
          <p className="text-gray-600 mb-3">과거 경험을 바탕으로 최적화된 일정을 추천받아보세요.</p>
          <Button color="lavender" size="md" asChild>
            <Link href="/schedule" className="flex items-center">
              일정 추천받기
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </Link>
          </Button>
        </Card>
        <Card color="white" rounded shadow className="hover:shadow-xl transition-transform hover:-translate-y-1 duration-200 group">
          <div className="rounded-full bg-mint-100 w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <BarChart2 className="h-6 w-6 text-mint-500" />
          </div>
          <h2 className="text-lg font-semibold mb-2">나의 인사이트</h2>
          <p className="text-gray-600 mb-3">성찰과 일정 데이터를 기반으로 AI 인사이트를 확인하세요.</p>
          <Button color="mint" size="md" asChild>
            <Link href="/schedule" className="flex items-center">
              인사이트 보기
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </Link>
          </Button>
        </Card>
        <Card color="white" rounded shadow className="hover:shadow-xl transition-transform hover:-translate-y-1 duration-200 group">
          <div className="rounded-full bg-lavender-100 w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Clock className="h-6 w-6 text-lavender-500" />
          </div>
          <h2 className="text-lg font-semibold mb-2">캘린더</h2>
          <p className="text-gray-600 mb-3">월별로 감정/일정/성찰을 한눈에 확인할 수 있어요.</p>
          <Button color="lavender" size="md" asChild>
            <Link href="/calendar" className="flex items-center">
              캘린더 보기
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </Link>
          </Button>
        </Card>
      </div>

      {/* 빠른 액세스 세션 (추가 컨텐츠) */}
      <Card color="white" rounded shadow className="p-4">
        <h2 className="text-lg font-semibold mb-3">빠른 액세스</h2>
        <div className="grid grid-cols-4 gap-3">
          <Link
            href="/calendar"
            className="flex flex-col items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <CalendarDays className="h-6 w-6 text-blue-600 mb-1" />
            <span className="text-sm text-center">캘린더</span>
          </Link>
          <Link
            href="/reflection"
            className="flex flex-col items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <BookText className="h-6 w-6 text-purple-600 mb-1" />
            <span className="text-sm text-center">성찰 모음</span>
          </Link>
          <Link
            href="/schedule/templates"
            className="flex flex-col items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Star className="h-6 w-6 text-green-600 mb-1" />
            <span className="text-sm text-center">템플릿</span>
          </Link>
          <Link
            href="/settings"
            className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Clock className="h-6 w-6 text-gray-600 mb-1" />
            <span className="text-sm text-center">알림 설정</span>
          </Link>
        </div>
      </Card>

      {/* 인사이트 섹션 */}
      <Card color="white" rounded shadow className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">당신의 인사이트</h2>
          <Link
            href="/insights"
            className="text-indigo-600 text-sm hover:text-indigo-800"
          >
            모두 보기
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-indigo-50 rounded-lg">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-indigo-600 mr-2" />
              <h3 className="font-medium">성찰 패턴</h3>
            </div>
            <p className="text-sm text-gray-600">
              주로 저녁 시간에 성찰을 작성하는 경향이 있어요.
            </p>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <BarChart2 className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-medium">감정 분포</h3>
            </div>
            <p className="text-sm text-gray-600">
              이번 주는 평온함을 많이 느끼셨네요.
            </p>
          </div>

          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center mb-2">
              <BookText className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="font-medium">최근 활동</h3>
            </div>
            <p className="text-sm text-gray-600">
              3일 연속 성찰 기록 중입니다. 계속 유지하세요!
            </p>
          </div>
        </div>
      </Card>

      {/* 최근 성찰 섹션 */}
      <Card color="white" rounded shadow className="p-4">
        <h2 className="text-lg font-semibold mb-3">최근 성찰</h2>

        <div className="text-gray-500 text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
          <BookText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>아직 기록된 성찰이 없습니다.</p>
          <Link
            href="/reflection/new"
            className="mt-2 inline-block text-sm text-indigo-600 hover:text-indigo-800"
          >
            첫 성찰 기록하기
          </Link>
        </div>
      </Card>
    </div>
  );
}
