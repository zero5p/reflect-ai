import Link from 'next/link';
import { BookText, LineChart, TrendingUp, BarChart2, Zap, CalendarDays, Star, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-4">
      {/* 히어로 섹션 */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-5 text-white shadow-md">
        <h1 className="text-xl font-bold mb-2">안녕하세요, 성찰의 시간입니다</h1>
        <p className="text-indigo-100 mb-3">자신을 돌아보고 더 나은 일상을 디자인하세요</p>
        <Link 
          href="/reflection/new" 
          className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium shadow-sm hover:bg-indigo-50 transition-colors"
        >
          <Zap className="h-4 w-4 mr-2" />
          성찰 시작하기
        </Link>
      </div>
      
      {/* 주요 기능 카드 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow border border-gray-100 hover:shadow-md transition-shadow">
          <div className="rounded-full bg-blue-100 w-10 h-10 flex items-center justify-center mb-3">
            <BookText className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold mb-2">오늘의 성찰</h2>
          <p className="text-gray-600 mb-3">당신의 하루는 어땠나요? 감정과 생각을 기록해보세요.</p>
          <Link
            href="/reflection/new"
            className="text-blue-600 font-medium hover:text-blue-800 flex items-center"
          >
            성찰 기록하기
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow border border-gray-100 hover:shadow-md transition-shadow">
          <div className="rounded-full bg-green-100 w-10 h-10 flex items-center justify-center mb-3">
            <LineChart className="h-5 w-5 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold mb-2">AI 일정 추천</h2>
          <p className="text-gray-600 mb-3">과거 경험을 바탕으로 최적화된 일정을 추천받아보세요.</p>
          <Link
            href="/schedule"
            className="text-green-600 font-medium hover:text-green-800 flex items-center"
          >
            일정 추천받기
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* 빠른 액세스 세션 (추가 컨텐츠) */}
      <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
        <h2 className="text-lg font-semibold mb-3">빠른 액세스</h2>
        <div className="grid grid-cols-4 gap-3">
          <Link href="/calendar" className="flex flex-col items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <CalendarDays className="h-6 w-6 text-blue-600 mb-1" />
            <span className="text-sm text-center">캘린더</span>
          </Link>
          <Link href="/reflection" className="flex flex-col items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <BookText className="h-6 w-6 text-purple-600 mb-1" />
            <span className="text-sm text-center">성찰 모음</span>
          </Link>
          <Link href="/schedule/templates" className="flex flex-col items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Star className="h-6 w-6 text-green-600 mb-1" />
            <span className="text-sm text-center">템플릿</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Clock className="h-6 w-6 text-gray-600 mb-1" />
            <span className="text-sm text-center">알림 설정</span>
          </Link>
        </div>
      </div>
      
      {/* 인사이트 섹션 */}
      <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">당신의 인사이트</h2>
          <Link href="/insights" className="text-indigo-600 text-sm hover:text-indigo-800">
            모두 보기
          </Link>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-indigo-50 rounded-lg">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-indigo-600 mr-2" />
              <h3 className="font-medium">성찰 패턴</h3>
            </div>
            <p className="text-sm text-gray-600">주로 저녁 시간에 성찰을 작성하는 경향이 있어요.</p>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center mb-2">
              <BarChart2 className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-medium">감정 분포</h3>
            </div>
            <p className="text-sm text-gray-600">이번 주는 평온함을 많이 느끼셨네요.</p>
          </div>
          
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center mb-2">
              <BookText className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="font-medium">최근 활동</h3>
            </div>
            <p className="text-sm text-gray-600">3일 연속 성찰 기록 중입니다. 계속 유지하세요!</p>
          </div>
        </div>
      </div>
      
      {/* 최근 성찰 섹션 */}
      <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
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
      </div>
    </div>
  );
}
