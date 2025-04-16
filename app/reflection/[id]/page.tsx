// app/reflection/[id]/page.tsx
import Link from 'next/link';
import { mockReflections } from '../../data/mockReflections';
import { notFound } from 'next/navigation';

export default function ReflectionDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  // 특정 ID의 성찰 찾기
  const reflection = mockReflections.find(r => r.id === params.id);
  
  // 해당 ID의 성찰이 없으면 404 페이지로
  if (!reflection) {
    notFound();
  }

  // 감정에 맞는 이모지 가져오기
  const getEmotionEmoji = (emotion: string) => {
    const emotionMap: Record<string, string> = {
      '기쁨': '😄',
      '슬픔': '😢',
      '화남': '😠',
      '평온': '😌',
      '불안': '😰',
      '지루함': '😑'
    };
    return emotionMap[emotion] || '😐';
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="mb-4">
        <Link 
          href="/reflection" 
          className="text-indigo-600 hover:text-indigo-800"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">{getEmotionEmoji(reflection.emotion)}</span>
          <div>
            <h1 className="text-xl font-semibold">{reflection.emotion}</h1>
            <p className="text-gray-500">{formatDate(reflection.createdAt)}</p>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <p className="text-gray-800 whitespace-pre-line">{reflection.content}</p>
        </div>
      </div>
    </div>
  );
}