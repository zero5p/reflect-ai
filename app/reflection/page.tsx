'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Reflection } from '../types/calendar';
import { Plus } from 'lucide-react';

// 예시 데이터 (나중에 서버 API로 대체)
const dummyReflections: Reflection[] = [
  {
    id: '1',
    date: new Date(Date.now() - 86400000), // 어제
    title: '업무 성과에 대한 생각',
    content: '오늘 프로젝트에서 중요한 기능을 완성했다. 처음에는 어려워 보였지만 차근차근 접근하니 해결할 수 있었다.',
    mood: '만족',
    tags: ['업무', '성취', '문제해결'],
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000 * 3), // 3일 전
    title: '운동 습관 되돌아보기',
    content: '요즘 운동을 꾸준히 하고 있다. 아침에 일어나서 30분 정도 조깅을 하는 습관이 몸과 마음에 긍정적인 영향을 주는 것 같다.',
    mood: '활기찬',
    tags: ['건강', '운동', '습관형성'],
  },
];

export default function ReflectionPage() {
  const [reflections] = useState<Reflection[]>(dummyReflections);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">성찰 기록</h1>
        <Link 
          href="/reflection/new"
          className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
        >
          <Plus className="h-5 w-5" />
        </Link>
      </div>

      <div className="space-y-4">
        {reflections.length > 0 ? (
          reflections.map((reflection) => (
            <Link 
              href={`/reflection/${reflection.id}`} 
              key={reflection.id}
              className="block"
            >
              <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold">{reflection.title}</h2>
                  <span className="text-sm text-gray-500">
                    {format(new Date(reflection.date), 'yyyy-MM-dd', { locale: ko })}
                  </span>
                </div>
                <div className="mt-2 text-gray-600 line-clamp-2">{reflection.content}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    reflection.mood === '만족' ? 'bg-green-100 text-green-800' : 
                    reflection.mood === '활기찬' ? 'bg-yellow-100 text-yellow-800' :
                    reflection.mood === '불안' ? 'bg-red-100 text-red-800' :
                    reflection.mood === '슬픔' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {reflection.mood}
                  </span>
                  {reflection.tags.map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">아직 기록된 성찰이 없습니다.</p>
            <Link 
              href="/reflection/new" 
              className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              첫 성찰 기록하기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}