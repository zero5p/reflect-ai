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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">AI 일정 추천</h1>
        <button
          onClick={handleGenerateRecommendations}
          disabled={isLoading}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          <span>{isLoading ? '생성 중...' : '새로운 추천 받기'}</span>
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold flex items-center text-blue-800">
          <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
          AI 추천 작동 방식
        </h2>
        <p className="text-blue-700 mt-2">
          리플렉트 AI는 귀하의 과거 성찰 기록과 일정 패턴을 분석하여 최적화된 일정을 추천합니다. 
          긍정적인 감정과 연관된 활동을 찾아 적절한 시간에 배치하고, 간격 반복 학습 원리를 적용하여 중요한 활동을 주기적으로 상기시켜 드립니다.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className={`bg-white p-4 rounded-lg shadow border-l-4 ${
                recommendation.accepted
                  ? 'border-green-500'
                  : 'border-blue-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{recommendation.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {format(recommendation.date, 'yyyy년 MM월 dd일 (EEEE)', {
                        locale: ko,
                      })}
                    </span>
                    <Clock className="h-4 w-4 ml-3 mr-1" />
                    <span>
                      {recommendation.startTime} - {recommendation.endTime}
                    </span>
                    {recommendation.category && (
                      <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                        {recommendation.category}
                      </span>
                    )}
                  </div>
                </div>

                {!recommendation.accepted && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAccept(recommendation.id)}
                      className="p-1.5 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
                      aria-label="수락"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleReject(recommendation.id)}
                      className="p-1.5 bg-red-100 text-red-700 rounded-full hover:bg-red-200"
                      aria-label="거절"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                {recommendation.accepted && (
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    <Check className="h-3 w-3 mr-1" /> 수락됨
                  </span>
                )}
              </div>
              
              <div className="mt-3 bg-gray-50 p-3 rounded text-sm text-gray-700">
                <p><strong>추천 이유:</strong> {recommendation.reasoning}</p>
              </div>
              
              {recommendation.accepted && (
                <div className="mt-3 text-right">
                  <Link 
                    href="/calendar" 
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                  >
                    캘린더에서 보기
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 mb-4">현재 추천된 일정이 없습니다.</p>
          <button
            onClick={handleGenerateRecommendations}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            일정 추천 받기
          </button>
        </div>
      )}
    </div>
  );
}