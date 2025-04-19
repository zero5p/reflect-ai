import { NextRequest, NextResponse } from 'next/server';
import { CalendarEvent } from '@/app/types/calendar';

// 임시 데이터 저장소 (실제로는 데이터베이스를 사용할 예정)
const events: CalendarEvent[] = [
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

// GET: 모든 일정 조회 또는 날짜별 필터링
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dateParam = searchParams.get('date');
  
  if (dateParam) {
    // 날짜 문자열을 Date 객체로 변환
    const targetDate = new Date(dateParam);
    
    // 날짜만 비교하기 위해 시간 부분을 제거
    const targetDateString = targetDate.toISOString().split('T')[0];
    
    // 해당 날짜의 이벤트만 필터링
    const filteredEvents = events.filter(event => {
      const eventDateString = new Date(event.date).toISOString().split('T')[0];
      return eventDateString === targetDateString;
    });
    
    return NextResponse.json(filteredEvents);
  }
  
  // 날짜 파라미터가 없으면 모든 이벤트 반환
  return NextResponse.json(events);
}

// POST: 새 일정 추가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 필수 필드 검증
    if (!body.title || !body.date) {
      return NextResponse.json(
        { error: '제목과 날짜는 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }
    
    // 새 일정 객체 생성
    const newEvent: CalendarEvent = {
      id: Date.now().toString(), // 임시 ID 생성 방식
      title: body.title,
      date: new Date(body.date),
      startTime: body.startTime,
      endTime: body.endTime,
      category: body.category,
      reflectionId: body.reflectionId,
      isRecommended: body.isRecommended || false,
    };
    
    // 임시 저장소에 추가 (실제로는 데이터베이스에 저장)
    events.push(newEvent);
    
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: '일정 추가 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}