"use client";

import { useState } from "react";
// Removing the unused import:
// import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";

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
    <div>
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 w-10 h-10 flex items-center justify-center mr-3">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold">캘린더</h1>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="min-w-[120px] text-center font-medium text-gray-700">
              {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
            </div>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <button className="flex items-center px-3 py-1.5 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4 mr-1" />
            일정 추가
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mt-4">
          {["일", "월", "화", "수", "목", "금", "토"].map((day, idx) => (
            <div
              key={day}
              className={`font-medium py-2 text-sm rounded 
                ${idx === 0 ? "text-red-500" : ""}
                ${idx === 6 ? "text-blue-500" : ""}
              `}
            >
              {day}
            </div>
          ))}

          {days.map((dayObj, idx) => (
            <button
              key={idx}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center border ${dayObj.isCurrentMonth ? 'bg-white text-gray-900 hover:bg-indigo-50' : 'bg-gray-50 text-gray-300'} ${selectedDate && dayObj.day === selectedDate.getDate() && dayObj.isCurrentMonth ? 'ring-2 ring-indigo-400' : ''}`}
              onClick={() => handleDayClick(dayObj)}
              disabled={!dayObj.isCurrentMonth || !dayObj.day}
            >
              <span className="font-medium">{dayObj.day}</span>
              {dayObj.hasEvent && dayObj.emotionType !== null && (
                <span className="text-xl mt-1">{getEmotionEmoji(dayObj.emotionType)}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">이달의 요약</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-medium text-sm mb-1 text-indigo-800">
              감정 분포
            </h3>
            <div className="flex flex-wrap mt-2 gap-2">
              <div className="flex items-center text-sm bg-white px-2 py-1 rounded-full">
                <span className="mr-1">😄</span> 6일
              </div>
              <div className="flex items-center text-sm bg-white px-2 py-1 rounded-full">
                <span className="mr-1">😌</span> 5일
              </div>
              <div className="flex items-center text-sm bg-white px-2 py-1 rounded-full">
                <span className="mr-1">😢</span> 2일
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-sm mb-1 text-green-800">
              활동 통계
            </h3>
            <div className="flex flex-wrap mt-2 gap-2">
              <div className="text-sm bg-white px-2 py-1 rounded-full">
                성찰 13회
              </div>
              <div className="text-sm bg-white px-2 py-1 rounded-full">
                평균 4.5점
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* [UI/UX 개선] 플로팅 액션 버튼 */}
      <button
        className="fixed bottom-8 right-8 bg-indigo-600 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center text-3xl hover:bg-indigo-700 transition-colors z-50"
        title="일정/성찰 추가"
        onClick={() => setShowAddModal(true)}
      >
        +
      </button>

      {/* 일정/성찰 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h3 className="text-lg font-bold mb-2">일정/성찰 추가</h3>
            <p className="mb-4 text-gray-700 text-sm">(실제 입력 폼은 추후 구현)</p>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 mr-2" onClick={() => setShowAddModal(false)}>취소</button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" onClick={() => setShowAddModal(false)}>확인</button>
            </div>
          </div>
        </div>
      )}

      {/* 날짜 상세 모달 */}
      {showDetailModal && selectedDate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h3 className="text-lg font-bold mb-2">{selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일</h3>
            <p className="mb-2 text-gray-700">해당 날짜의 성찰/일정/이벤트 상세 내용 (실제 연동은 추후 구현)</p>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" onClick={() => setShowDetailModal(false)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
