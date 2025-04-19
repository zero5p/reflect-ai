// app/reflection/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Sparkles } from "lucide-react";
import ReflectionAnalysis from "@/app/components/ReflectionAnalysis";

interface Reflection {
  id: string;
  title: string;
  content: string;
  emotion: string;
  tags: string[];
  date: string;
  created_at: string;
}

export default function ReflectionDetailPage() {
  const params = useParams();
  const reflectionId = params.id as string;

  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    const fetchReflection = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/reflections/${reflectionId}`);

        if (!response.ok) {
          throw new Error("성찰을 불러오는데 실패했습니다.");
        }

        const data = await response.json();
        setReflection(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "알 수 없는 오류가 발생했습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (reflectionId) {
      fetchReflection();
    }
  }, [reflectionId]);

  // 감정에 맞는 이모지 가져오기
  const getEmotionEmoji = (emotion: string) => {
    const emotionMap: Record<string, string> = {
      기쁨: "😄",
      슬픔: "😢",
      화남: "😠",
      평온: "😌",
      불안: "😰",
      지루함: "😑",
      만족: "😊",
      활기찬: "😃",
    };
    return emotionMap[emotion] || "😐";
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !reflection) {
    return (
      <div className="bg-red-50 p-6 rounded-lg shadow">
        <h1 className="text-xl font-semibold text-red-800 mb-2">오류 발생</h1>
        <p className="text-red-600 mb-4">
          {error || "성찰을 찾을 수 없습니다."}
        </p>
        <Link
          href="/reflection"
          className="text-red-800 hover:text-red-900 font-medium"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Link
          href="/reflection"
          className="inline-flex items-center text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          목록으로 돌아가기
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">
            {getEmotionEmoji(reflection.emotion)}
          </span>
          <div>
            <h1 className="text-xl font-semibold">{reflection.title}</h1>
            <p className="text-gray-500">{formatDate(reflection.created_at)}</p>
          </div>
        </div>

        {reflection.tags && reflection.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {reflection.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="border-t pt-4">
          <p className="text-gray-800 whitespace-pre-line">
            {reflection.content}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t flex justify-end">
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {showAnalysis ? "AI 분석 닫기" : "AI 분석 보기"}
          </button>
        </div>
      </div>

      {showAnalysis && <ReflectionAnalysis reflectionId={reflectionId} />}
    </div>
  );
}
