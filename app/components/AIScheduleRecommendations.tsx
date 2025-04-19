// app/components/AIScheduleRecommendations.tsx
"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Sparkles,
  Check,
  X,
  Calendar,
  Clock,
  RefreshCw,
  Activity,
} from "lucide-react";
import Link from "next/link";

interface Recommendation {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  category: string;
  reasoning: string;
  isAccepted: boolean;
}

export default function AIScheduleRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch("/api/recommendations", {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "추천 목록을 가져오는 중 오류가 발생했습니다.",
        );
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
      );
    }
  };

  const generateRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/recommendations/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "추천 생성 중 오류가 발생했습니다.");
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      const response = await fetch("/api/recommendations/generate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recommendationId: id, isAccepted: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "추천 수락 중 오류가 발생했습니다.");
      }

      // 로컬 상태 업데이트
      setRecommendations(
        recommendations.map((rec) =>
          rec.id === id ? { ...rec, isAccepted: true } : rec,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
      );
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch("/api/recommendations/generate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recommendationId: id, isAccepted: false }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "추천 거절 중 오류가 발생했습니다.");
      }

      // 로컬 상태에서 제거
      setRecommendations(recommendations.filter((rec) => rec.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
      );
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center">
          <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
          AI 일정 추천
        </h2>
        <button
          onClick={generateRecommendations}
          disabled={isLoading}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              <span>생성 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              <span>새로운 추천 받기</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-600">
          <p>{error}</p>
          <button
            onClick={fetchRecommendations}
            className="mt-2 text-sm text-red-700 hover:text-red-900"
          >
            다시 시도하기
          </button>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold flex items-center text-blue-800">
          <Activity className="h-5 w-5 mr-2 text-blue-500" />
          AI 추천 작동 방식
        </h3>
        <p className="text-blue-700 mt-2">
          리플렉트 AI는 귀하의 과거 성찰 기록과 일정 패턴을 분석하여 최적화된
          일정을 추천합니다. 긍정적인 감정과 연관된 활동을 찾아 적절한 시간에
          배치하고, 간격 반복 학습 원리를 적용하여 중요한 활동을 주기적으로
          상기시켜 드립니다.
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
                recommendation.isAccepted
                  ? "border-green-500"
                  : "border-blue-500"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">
                    {recommendation.title}
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {format(
                        parseISO(recommendation.date),
                        "yyyy년 MM월 dd일 (EEEE)",
                        {
                          locale: ko,
                        },
                      )}
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

                {!recommendation.isAccepted && (
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

                {recommendation.isAccepted && (
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    <Check className="h-3 w-3 mr-1" /> 수락됨
                  </span>
                )}
              </div>

              <div className="mt-3 bg-gray-50 p-3 rounded text-sm text-gray-700">
                <p>
                  <strong>추천 이유:</strong> {recommendation.reasoning}
                </p>
              </div>

              {recommendation.isAccepted && (
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
            onClick={generateRecommendations}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            일정 추천 받기
          </button>
        </div>
      )}
    </div>
  );
}
