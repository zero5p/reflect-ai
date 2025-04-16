'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
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
        emotionType: hasEvent ? emotionType : null
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
    const emotions = ['😄', '😢', '😠', '😌', '😰', '😑'];
    return emotions[type];
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
        
        <div className="grid grid-cols-7 gap-1 text-center">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
            <div 
              key={day} 
              className={`font-medium py-2 text-sm rounded 
                ${idx === 0 ? 'text-red-500' : ''}
                ${idx === 6 ? 'text-blue-500' : ''}
              `}
            >
              {day}
            </div>
          ))}
          
          {days.map((day, index) => (
            <div 
              key={index}
              className={`p-1 min-h-[80px] rounded-lg border 
                ${day.isCurrentMonth 
                  ? 'bg-white hover:bg-gray-50' 
                  : 'bg-gray-50 text-gray-400'
                }
                ${index % 7 === 0 ? 'text-red-500' : ''}  
                ${index % 7 === 6 ? 'text-blue-500' : ''}
              `}
            >
              {day.day && (
                <>
                  <div className="flex justify-between items-center p-1">
                    <span className={`text-sm font-medium ${day.hasEvent ? 'font-bold' : ''}`}>
                      {day.day}
                    </span>
                    {day.hasEvent && (
                      <span className="text-lg" title="오늘의 감정">
                        {getEmotionEmoji(day.emotionType as number)}
                      </span>
                    )}
                  </div>
                  {day.hasEvent && (
                    <div className="mt-1 p-1 text-xs bg-blue-50 rounded text-blue-800 text-left">
                      성찰 기록 있음
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">이달의 요약</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="font-medium text-sm mb-1 text-indigo-800">감정 분포</h3>
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
            <h3 className="font-medium text-sm mb-1 text-green-800">활동 통계</h3>
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
    </div>
  );
}