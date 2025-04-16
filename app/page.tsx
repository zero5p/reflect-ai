import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">안녕하세요, 성찰을 시작해보세요</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">오늘의 성찰</h2>
          <p className="text-gray-600">당신의 하루는 어땠나요? 감정과 생각을 기록해보세요.</p>
          <Link href="/reflection/new" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            성찰 시작하기
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">AI 일정 추천</h2>
          <p className="text-gray-600">과거 경험을 바탕으로 최적화된 일정을 추천해드려요.</p>
          <Link href="/schedule" className="mt-4 inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            일정 추천받기
          </Link>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">최근 성찰</h2>
        <div className="text-gray-500 text-center py-8">
          아직 기록된 성찰이 없습니다.
        </div>
      </div>
    </div>
  );
}