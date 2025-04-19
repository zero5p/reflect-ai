// app/reflection/page.tsx
import Link from "next/link";
import { useState } from "react";
import { mockReflections } from "../data/mockReflections";

export default function ReflectionPage() {
  // 가장 최근 항목이 맨 위에 오도록 정렬
  const sortedReflections = [...mockReflections].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // 감정에 맞는 이모지 가져오기
  const getEmotionEmoji = (emotion: string) => {
    const emotionMap: Record<string, string> = {
      기쁨: "😄",
      슬픔: "😢",
      화남: "😠",
      평온: "😌",
      불안: "😰",
      지루함: "😑",
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
    });
  };

  // [추가] 필터/검색 상태
  interface ReflectionItem {
    id: string;
    content: string;
    emotion: string;
    createdAt: string;
  }
  const [search, setSearch] = useState("");
  const [emotionFilter, setEmotionFilter] = useState("전체 감정");
  const [detailModal, setDetailModal] = useState<{open: boolean, reflection: ReflectionItem}|null>(null);

  // 필터/검색 적용
  const filteredReflections = sortedReflections.filter((r) => {
    const matchesSearch = search === "" || r.content.includes(search);
    const matchesEmotion = emotionFilter === "전체 감정" || r.emotion === emotionFilter;
    return matchesSearch && matchesEmotion;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
        <div>
          <h1 className="text-2xl font-bold text-indigo-700 mb-1">나의 성찰 기록</h1>
          <p className="text-gray-600 text-sm">감정과 생각을 기록하고, 나만의 인사이트를 발견하세요.</p>
        </div>
        <Link
          href="/reflection/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          새 성찰 작성
        </Link>
      </div>
      {/* 필터/검색 바 */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="검색어 입력"
          className="px-3 py-2 border rounded w-full md:w-1/3 text-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="px-3 py-2 border rounded text-sm"
          value={emotionFilter}
          onChange={e => setEmotionFilter(e.target.value)}
        >
          <option>전체 감정</option>
          <option>기쁨</option>
          <option>슬픔</option>
          <option>화남</option>
          <option>평온</option>
          <option>불안</option>
          <option>지루함</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReflections.length > 0 ? (
          filteredReflections.map((reflection) => (
            <button
              key={reflection.id}
              className="bg-white p-5 rounded-xl shadow border border-gray-100 flex flex-col text-left hover:ring-2 hover:ring-indigo-300 transition-all"
              onClick={() => setDetailModal({open: true, reflection})}
            >
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">{getEmotionEmoji(reflection.emotion)}</span>
                <span className="text-xs text-gray-400">{formatDate(reflection.createdAt)}</span>
              </div>
              <p className="text-gray-800 text-sm mb-2 line-clamp-3">{reflection.content}</p>
              <div className="mt-auto flex justify-end">
                <span className="text-sm text-indigo-600 font-medium">자세히 보기</span>
              </div>
            </button>
          ))
        ) : (
          <div className="text-gray-500">아직 작성된 성찰이 없습니다.</div>
        )}
      </div>
      {/* 상세 모달 */}
      {detailModal && detailModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h3 className="text-lg font-bold mb-2">{formatDate(detailModal.reflection.createdAt)} {getEmotionEmoji(detailModal.reflection.emotion)}</h3>
            <p className="mb-4 text-gray-700 whitespace-pre-line">{detailModal.reflection.content}</p>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" onClick={() => setDetailModal(null)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
