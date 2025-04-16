'use client';

import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarEvent } from '@/app/types/calendar';

type CalendarComponentProps = {
  events?: CalendarEvent[];
  onSelectDate?: (date: Date) => void;
};

export default function CalendarComponent({ events = [], onSelectDate }: CalendarComponentProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 이전 달로 이동
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // 다음 달로 이동
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // 날짜 선택 핸들러
  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    if (onSelectDate) {
      onSelectDate(day);
    }
  };

  // 현재 달의 모든 날짜 가져오기
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 달력 그리드 생성을 위한 빈 셀 계산
  const startDay = getDay(monthStart);

  // 요일 이름 배열
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  // 특정 날짜에 이벤트가 있는지 확인
  const hasEvents = (date: Date) => {
    return events.some(event => isSameDay(new Date(event.date), date));
  };

  return (
    <div className="calendar-container">
      {/* 달력 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold">
          {format(currentMonth, 'yyyy년 MM월', { locale: ko })}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((weekday, index) => (
          <div
            key={index}
            className={`text-center text-sm py-2 font-medium
              ${index === 0 ? 'text-red-500' : ''} 
              ${index === 6 ? 'text-blue-500' : ''}`}
          >
            {weekday}
          </div>
        ))}
      </div>

      {/* 달력 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {/* 월 시작 전 빈 셀 */}
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-start-${index}`} className="p-2 h-12"></div>
        ))}

        {/* 달력 날짜 */}
        {daysInMonth.map((day) => {
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDate);
          const hasEvent = hasEvents(day);
          const dayOfWeek = getDay(day);
          
          return (
            <div
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              className={`relative p-1 h-12 flex flex-col items-center cursor-pointer hover:bg-gray-100 rounded
                ${!isSameMonth(day, currentMonth) ? 'text-gray-300' : ''}
                ${isToday ? 'bg-blue-50' : ''}
                ${isSelected ? 'bg-blue-100' : ''}
                ${dayOfWeek === 0 ? 'text-red-500' : ''}
                ${dayOfWeek === 6 ? 'text-blue-500' : ''}`}
            >
              <span className={`text-sm w-7 h-7 flex items-center justify-center 
                ${isToday ? 'bg-blue-500 text-white rounded-full' : ''}`}>
                {format(day, 'd')}
              </span>
              {hasEvent && (
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-0.5"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}