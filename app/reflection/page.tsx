// app/reflection/page.tsx
import Link from 'next/link';
import { mockReflections } from '../data/mockReflections';

export default function ReflectionPage() {
  // 가장 최근 항목이 맨 위에 오도록 정렬
  const sortedReflections = [...mockReflections].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">성찰 기록</h1>
        <Link 
          href="/reflection/new" 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          새 성찰 작성
        </Link>
      </div>

      <div className="space-y-4">
        {sortedReflections.length > 0 ? (
          sortedReflections.map((reflection) => (
            <div key={reflection.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <span className="text-xl mr-2">{getEmotionEmoji(reflection.emotion)}</span>
                  <span className="text-sm text-gray-500">{formatDate(reflection.createdAt)}</span>
                </div>
              </div>
              <p className="text-gray-800">{reflection.content}</p>
              <div className="mt-2 flex justify-end">
                <Link 
                  href={`/reflection/${reflection.id}`} 
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  자세히 보기
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">아직 기록된 성찰이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}