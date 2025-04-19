"use client";

// app/reflection/page.tsx
import Link from "next/link";
import { useState } from "react";
import { mockReflections } from "../data/mockReflections";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Image from "next/image";
import { Zap } from "lucide-react";

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
      <Card color="lavender" rounded shadow className="mb-6 p-7 flex flex-col md:flex-row gap-6 items-center relative overflow-hidden">
        {/* 감성 일러스트(예시: 창문/스티커) */}
        <div className="absolute left-4 bottom-2 opacity-40 pointer-events-none select-none hidden md:block">
          <Image src="/window.svg" alt="감성 창문 일러스트" width={90} height={90} className="drop-shadow-lg" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-lavender-700 drop-shadow">나의 성찰 기록</h1>
          <p className="text-lavender-600 mb-3 md:text-lg">감정과 생각을 기록하고, 나만의 인사이트를 발견하세요.</p>
          <Button color="lavender" size="lg" className="mb-2" asChild>
            <Link href="/reflection/new" className="inline-flex items-center">
              <Zap className="h-5 w-5 mr-2" /> 새 성찰 작성
            </Link>
          </Button>
        </div>
      </Card>

      {/* 필터/검색 바 */}
      <Card color="white" rounded shadow className="mb-6 p-5">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">필터/검색</h2>
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
      </Card>

      {/* 최근 성찰 목록 */}
      <Card color="white" rounded shadow className="mb-6 p-5">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">최근 성찰</h2>
        {filteredReflections.length === 0 ? (
          <div className="text-gray-400 text-center py-6 border-2 border-dashed border-gray-100 rounded-lg">
            아직 작성된 성찰이 없습니다.<br />
            <Button color="mint" size="md" asChild>
              <Link href="/reflection/new">첫 성찰 기록하기</Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-4">
            {filteredReflections.map((reflection) => (
              <Card
                key={reflection.id}
                color="mint"
                rounded
                shadow
                className="flex items-center gap-4 hover:shadow-lg transition-all px-4 py-3"
              >
                <div className="text-2xl">
                  {getEmotionEmoji(reflection.emotion)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-gray-900 font-medium truncate">{reflection.content}</div>
                  <div className="text-xs text-gray-400">{formatDate(reflection.createdAt)}</div>
                </div>
                <Button color="secondary" size="sm" asChild>
                  <Link href={`/reflection/${reflection.id}`}>상세</Link>
                </Button>
              </Card>
            ))}
          </ul>
        )}
      </Card>

      {/* 성찰 상세 모달 */}
      {detailModal && detailModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Card color="white" rounded shadow className="p-8 w-full max-w-md">
            <h3 className="text-lg font-bold mb-2">{formatDate(detailModal.reflection.createdAt)} {getEmotionEmoji(detailModal.reflection.emotion)}</h3>
            <p className="mb-4 text-gray-700 whitespace-pre-line">{detailModal.reflection.content}</p>
            <div className="flex justify-end">
              <Button color="secondary" size="md" onClick={() => setDetailModal(null)}>닫기</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
