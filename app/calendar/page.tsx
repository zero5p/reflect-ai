"use client";

import { useState } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // [추가] 모달 상태 및 선택 날짜 상태
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 달력에 표시될 날짜를 계산하는 함수
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // 이번 달의 첫째 날
    const firstDay = new Date(year, month, 1);
    // 이번 달의 마지막 날
    const lastDay = new Date(year, month + 1, 0);

    const days = [];

    // 첫째 날 이전의 빈 칸 채우기
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    // 이번 달의 날짜 채우기
    for (let i = 1; i <= lastDay.getDate(); i++) {
      // 모의 데이터: 임의의 날짜에 이벤트 추가
      const hasEvent = Math.random() > 0.7;
      const emotionType = Math.floor(Math.random() * 6); // 0-5 사이의 랜덤 값

      days.push({
        day: i,
        isCurrentMonth: true,
        hasEvent,
        emotionType: hasEvent ? emotionType : null,
      });
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const getEmotionEmoji = (type: number) => {
    const emotions = ["😄", "😢", "😠", "😌", "😰", "😑"];
    return emotions[type];
  };

  // 날짜 클릭 핸들러
  type DayObj = {
    day: number | null;
    isCurrentMonth: boolean;
    hasEvent?: boolean;
    emotionType?: number | null;
  };
  const handleDayClick = (dayObj: DayObj) => {
    if (!dayObj.isCurrentMonth || !dayObj.day) return;
    setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayObj.day));
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-7">
      {/* 상단 요약/액션 섹션 */}
      <Card color="lavender" rounded shadow className="flex items-center gap-6 p-7 relative overflow-hidden">
        <CalendarIcon className="w-10 h-10 text-white opacity-80" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white mb-1 drop-shadow">캘린더</h1>
          <p className="text-white/90 mb-2">월별로 감정/일정/성찰을 한눈에!</p>
        </div>
        <Button color="mint" size="md" asChild>
          <Link href="/schedule/new" className="inline-flex items-center">
            <PlusCircle className="w-5 h-5 mr-1" /> 새 일정 추가
          </Link>
        </Button>
      </Card>

      {/* 달력 그리드 */}
      <Card color="white" rounded shadow className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Button color="neutral" size="sm" onClick={handlePrevMonth}>
            <ChevronLeft />
          </Button>
          <div className="font-semibold text-lg">
            {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
          </div>
          <Button color="neutral" size="sm" onClick={handleNextMonth}>
            <ChevronRight />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-gray-500 mb-2">
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <div key={d} className="font-semibold">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((dayObj, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col items-center justify-center h-16 ${
                dayObj.isCurrentMonth ? "bg-white" : "bg-gray-50"
              }`}
            >
              <div className="font-semibold text-gray-700 mb-1">{dayObj.day}</div>
              {dayObj.hasEvent && dayObj.emotionType !== null && (
                <div className="flex flex-col items-center">
                  <span className="text-2xl">{getEmotionEmoji(dayObj.emotionType)}</span>
                </div>
              )}
              <button
                className={`absolute inset-0 ${
                  dayObj.isCurrentMonth ? "bg-white" : "bg-gray-50"
                }`}
                onClick={() => handleDayClick(dayObj)}
                disabled={!dayObj.isCurrentMonth || !dayObj.day}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* 날짜 상세 모달 */}
      {showDetailModal && selectedDate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h3 className="text-lg font-bold mb-2">
              {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월{" "}
              {selectedDate.getDate()}일
            </h3>
            <p className="mb-2 text-gray-700">
              해당 날짜의 성찰/일정/이벤트 상세 내용 (실제 연동은 추후 구현)
            </p>
            <div className="flex justify-end">
              <Button color="indigo" size="md" onClick={() => setShowDetailModal(false)}>
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 일정/성찰 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h3 className="text-lg font-bold mb-2">일정/성찰 추가</h3>
            <p className="mb-4 text-gray-700 text-sm">(실제 입력 폼은 추후 구현)</p>
            <div className="flex justify-end">
              <Button color="gray" size="md" onClick={() => setShowAddModal(false)}>
                취소
              </Button>
              <Button color="indigo" size="md" onClick={() => setShowAddModal(false)}>
                확인
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* [UI/UX 개선] 플로팅 액션 버튼 */}
      <Button
        color="indigo"
        size="lg"
        className="fixed bottom-8 right-8 shadow-lg z-50"
        title="일정/성찰 추가"
        onClick={() => setShowAddModal(true)}
      >
        +
      </Button>
    </div>
  );
}
