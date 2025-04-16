'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import CalendarComponent from '../components/Calendar/CalendarComponent';
import { CalendarEvent } from '../types/calendar';
import Link from 'next/link';
import { Plus } from 'lucide-react';

// 임시 데이터 (나중에 서버 API로 대체)
const dummyEvents: CalendarEvent[] = [
  {
    id: '1',
    title: '운동하기',
    date: new Date(),
    startTime: '10:00',
    endTime: '11:00',
    category: '건강',
  },
  {
    id: '2',
    title: '독서 시간',
    date: new Date(),
    startTime: '15:00',
    endTime: '16:00',
    category: '취미',
    isRecommended: true,
  },
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(dummyEvents);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  // 선택된 날짜의 이벤트만 필터링
  const filteredEvents = events.filter(event => 
    format(new Date(event.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">일정 캘린더</h1>
        <Link 
          href="/calendar/new"
          className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
        >
          <Plus className="h-5 w-5" />
        </Link>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <CalendarComponent 
          events={events} 
          onSelectDate={handleSelectDate}
        />
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3">
          {format(selectedDate, 'yyyy년 MM월 dd일 (EEEE)', { locale: ko })}의 일정
        </h2>
        
        {filteredEvents.length > 0 ? (
          <div className="space-y-2">
            {filteredEvents.map(event => (
              <div 
                key={event.id} 
                className={`p-3 rounded-md border-l-4 ${
                  event.isRecommended ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex justify-between">
                  <h3 className="font-medium">{event.title}</h3>
                  {event.isRecommended && (
                    <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">AI 추천</span>
                  )}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {event.startTime} - {event.endTime}
                  {event.category && <span className="ml-2">· {event.category}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            이 날에는 일정이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}