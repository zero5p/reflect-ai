'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ArrowLeft, Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { Reflection } from '@/app/types/calendar';

// 예시 데이터 - 실제로는 API에서 가져올 예정
const dummyReflections: Reflection[] = [
  {
    id: '1',
    date: new Date(Date.now() - 86400000), // 어제
    title: '업무 성과에 대한 생각',
    content: '오늘 프로젝트에서 중요한 기능을 완성했다. 처음에는 어려워 보였지만 차근차근 접근하니 해결할 수 있었다.\n\n특히 문제 해결 과정에서 팀원들과의 협업이 중요했다. 서로 다른 시각에서 접근하니 더 효율적인 해결책을 찾을 수 있었다.\n\n앞으로도 어려운 문제가 생기면 혼자 고민하기보다는 팀원들과 함께 고민하는 시간을 가져야겠다.',
    mood: '만족',
    tags: ['업무', '성취', '문제해결'],
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000 * 3), // 3일 전
    title: '운동 습관 되돌아보기',
    content: '요즘 운동을 꾸준히 하고 있다. 아침에 일어나서 30분 정도 조깅을 하는 습관이 몸과 마음에 긍정적인 영향을 주는 것 같다.\n\n처음에는 시작하기 힘들었지만, 21일 정도 지나니 습관이 되어서 이제는 자연스럽게 아침에 일어나 운동을 하게 된다.\n\n신체적으로는 체력이 좋아지고, 정신적으로는 하루를 시작하는 기분이 더 좋아진 것 같다. 앞으로도 이 습관을 유지하고 싶다.',
    mood: '활기찬',
    tags: ['건강', '운동', '습관형성'],
  },
];

export default function ReflectionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // 실제로는 API 호출로 데이터를 가져올 예정
    const fetchReflection = () => {
      setIsLoading(true);
      // 임시 데이터에서 ID로 찾기
      const found = dummyReflections.find((r) => r.id === params.id);
      
      if (found) {
        setReflection(found);
      } else {
        // 찾지 못한 경우 리스트 페이지로 리다이렉트
        router.push('/reflection');
      }
      
      setIsLoading(false);
    };

    fetchReflection();
  }, [params.id, router]);

  const handleDelete = () => {
    // 실제로는 API 호출로 삭제 처리 예정
    setTimeout(() => {
      router.push('/reflection');
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!reflection) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">성찰을 찾을 수 없습니다.</p>
        <button
          onClick={() => router.push('/reflection')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center text-gray-600">
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>돌아가기</span>
        </button>
        <div className="flex space-x-2">
          <button 
            onClick={() => router.push(`/reflection/edit/${reflection.id}`)}
            className="flex items-center text-gray-600 hover:text-blue-500"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center text-gray-600 hover:text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-2">{reflection.title}</h1>
        
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{format(new Date(reflection.date), 'yyyy년 MM월 dd일 (EEEE)', { locale: ko })}</span>
          <Clock className="h-4 w-4 ml-3 mr-1" />
          <span>{format(new Date(reflection.date), 'HH:mm', { locale: ko })}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
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
        
        <div className="prose max-w-none">
          {reflection.content.split('\n').map((paragraph, index) => (
            paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
          ))}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">성찰 삭제</h3>
            <p className="mb-6">이 성찰 기록을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}