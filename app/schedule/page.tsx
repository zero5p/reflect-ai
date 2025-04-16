'use client';

import { useState } from 'react';
import { format, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Sparkles, Check, X, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

// 예시 추천 일정 데이터
const dummyRecommendations = [
  {
    id: '1',
    title: '운동: 30분 조깅',
    date: addDays(new Date(), 1), // 내일
    startTime: '08:00',
    endTime: '08:30',
    category: '건강',
    reasoning: '최근 성찰 기록에서 운동 후 긍정적인 기분 변화가 관찰되었습니다. 아침 조깅이 하루를 활기차게 시작하는 데 도움을 줄 것으로 예상됩니다.',
    accepted: false,
  },
  {
    id: '2',
    title: '독서 시간',
    date: addDays(new Date(), 2), // 모레
    startTime: '20:00',
    endTime: '21:00',
    category: '자기계발',
    reasoning: '저녁 시간 독서가 수면의 질을 향상시키는데 도움이 된다는 성찰 기록이 있습니다. 규칙적인 독서 습관 형성을 위해 추천합니다.',
    accepted: false,
  },
  {
    id: '3',
    title: '주간 회고 작성',
    date: addDays(new Date(), 5), // 5일 후
    startTime: '19:00',
    endTime: '19:30',
    category: '성찰',
    reasoning: '주간 단위의 성찰 작성이 목표 달성과 자기 인식에 도움을 준다는 패턴이 발견되었습니다. 일주일을 정리하는 시간으로 추천합니다.',
    accepted: true,
  },
];

export default function SchedulePage() {
  const [recommendations, setRecommendations] = useState(dummyRecommendations);
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = (id: string) => {
    setRecommendations(
      recommendations.map((rec) =>
        rec.id === id ? { ...rec, accepted: true } : rec
      )
    );
  };

  const handleReject = (id: string) => {
    setRecommendations(recommendations.filter((rec) => rec.id !== id));
  };

  const handleGenerateRecommendations = () => {
    setIsLoading(true);
    // 실제로는 API 호출로 AI 추천을 받을 예정
    // 여기서는 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">AI 일정 추천</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">성찰 데이터 분석</h2>
        <p className="text-gray-600 mb-4">
          최근 성찰 데이터에 기반한 AI 분석 결과입니다. 이를 참고하여 일정을 최적화할 수 있습니다.
        </p>
        
        {/* 모의 분석 결과 */}
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
          <p className="text-sm text-blue-800">
            최근 성찰 기록 분석 결과, 오전 시간에 집중력이 높고 오후 3시 이후에는 피로감을 자주 느끼는 패턴이 발견되었습니다.
            중요한 회의나 집중이 필요한 작업은 오전에 배치하고, 오후 시간에는 가벼운 업무나 휴식을 취하는 것이 좋겠습니다.
          </p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3">추천 일정 템플릿</h2>
        
        <div className="space-y-3">
          {/* 샘플 일정 */}
          <div className="border rounded p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">집중력 최적화 일정</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">
                적용하기
              </button>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex">
                <span className="w-20 text-gray-500">09:00 - 11:30</span>
                <span>집중 작업 시간 (회의 없음)</span>
              </div>
              <div className="flex">
                <span className="w-20 text-gray-500">11:30 - 12:30</span>
                <span>점심 식사 및 가벼운 산책</span>
              </div>
              <div className="flex">
                <span className="w-20 text-gray-500">12:30 - 15:00</span>
                <span>회의 및 협업 시간</span>
              </div>
              <div className="flex">
                <span className="w-20 text-gray-500">15:00 - 16:00</span>
                <span>휴식 및 명상</span>
              </div>
              <div className="flex">
                <span className="w-20 text-gray-500">16:00 - 18:00</span>
                <span>가벼운 작업 및 마무리</span>
              </div>
            </div>
          </div>
          
          <div className="border rounded p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">창의성 향상 일정</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">
                적용하기
              </button>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex">
                <span className="w-20 text-gray-500">09:00 - 10:00</span>
                <span>아침 명상 및 일기 쓰기</span>
              </div>
              <div className="flex">
                <span className="w-20 text-gray-500">10:00 - 12:00</span>
                <span>창의적 작업 시간</span>
              </div>
              <div className="flex">
                <span className="w-20 text-gray-500">12:00 - 13:30</span>
                <span>점심 식사 및 자연 속 산책</span>
              </div>
              <div className="flex">
                <span className="w-20 text-gray-500">13:30 - 15:30</span>
                <span>협업 및 피드백 시간</span>
              </div>
              <div className="flex">
                <span className="w-20 text-gray-500">15:30 - 18:00</span>
                <span>자유 시간 (독서, 학습, 가벼운 작업)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}