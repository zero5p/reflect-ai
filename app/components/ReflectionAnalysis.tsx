// app/components/ReflectionAnalysis.tsx
'use client';

import { useState, useEffect } from 'react';
import { Sparkles, LightbulbIcon, BarChart2, Brain, RefreshCw } from 'lucide-react';

interface ReflectionAnalysisProps {
  reflectionId: string;
}

interface AnalysisData {
  summary: string;
  keyInsights: string[];
  emotionalPatterns: string;
  recommendedActions: string[];
}

export default function ReflectionAnalysis({ reflectionId }: ReflectionAnalysisProps) {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeReflection = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/reflections/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reflectionId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '성찰 분석 중 오류가 발생했습니다.');
      }
      
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (reflectionId) {
      analyzeReflection();
    }
  }, [reflectionId]);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin mb-3">
            <RefreshCw className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-gray-500">AI가 성찰을 분석하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h3 className="text-red-800 font-semibold mb-2">분석 오류</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={analyzeReflection}
          className="mt-4 bg-red-100 text-red-800 px-4 py-2 rounded-md hover:bg-red-200"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-center">분석 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <Sparkles className="h-6 w-6 text-purple-500 mr-2" />
        <h2 className="text-xl font-semibold">AI 성찰 분석</h2>
      </div>
      
      <div className="space-y-6">
        {/* 요약 */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-medium flex items-center text-purple-800 mb-2">
            <Brain className="h-4 w-4 mr-2 text-purple-600" />
            요약
          </h3>
          <p className="text-gray-700">{analysis.summary}</p>
        </div>
        
        {/* 주요 인사이트 */}
        <div>
          <h3 className="font-medium flex items-center mb-3">
            <LightbulbIcon className="h-4 w-4 mr-2 text-amber-500" />
            주요 인사이트
          </h3>
          <ul className="space-y-2">
            {analysis.keyInsights.map((insight, index) => (
              <li key={index} className="bg-amber-50 p-3 rounded-md text-gray-700">
                {insight}
              </li>
            ))}
          </ul>
        </div>
        
        {/* 감정 패턴 */}
        <div>
          <h3 className="font-medium flex items-center mb-3">
            <BarChart2 className="h-4 w-4 mr-2 text-blue-500" />
            감정 패턴
          </h3>
          <div className="bg-blue-50 p-4 rounded-md text-gray-700">
            {analysis.emotionalPatterns}
          </div>
        </div>
        
        {/* 추천 행동 */}
        <div>
          <h3 className="font-medium flex items-center mb-3">
            <Sparkles className="h-4 w-4 mr-2 text-green-500" />
            추천 행동
          </h3>
          <ul className="space-y-2">
            {analysis.recommendedActions.map((action, index) => (
              <li key={index} className="bg-green-50 p-3 rounded-md text-gray-700 flex items-start">
                <span className="text-green-600 mr-2">•</span>
                {action}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t text-right">
        <button
          onClick={analyzeReflection}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center ml-auto"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          다시 분석하기
        </button>
      </div>
    </div>
  );
}