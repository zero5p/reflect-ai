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

// 특정 ID로 일정 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const event = events.find((e) => e.id === params.id);
  
  if (!event) {
    return NextResponse.json(
      { error: '해당 ID의 일정을 찾을 수 없습니다.' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(event);
}

// 특정 ID의 일정 업데이트
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const index = events.findIndex((e) => e.id === params.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: '해당 ID의 일정을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 필수 필드 검증
    if (!body.title || !body.date) {
      return NextResponse.json(
        { error: '제목과 날짜는 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }
    
    // 업데이트된 일정 객체
    const updatedEvent: CalendarEvent = {
      ...events[index],
      title: body.title,
      date: new Date(body.date),
      startTime: body.startTime || events[index].startTime,
      endTime: body.endTime || events[index].endTime,
      category: body.category || events[index].category,
      reflectionId: body.reflectionId || events[index].reflectionId,
      isRecommended: body.isRecommended !== undefined ? body.isRecommended : events[index].isRecommended,
    };
    
    // 임시 저장소에서 업데이트 (실제로는 데이터베이스에서 업데이트)
    events[index] = updatedEvent;
    
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: '일정 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 특정 ID의 일정 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const index = events.findIndex((e) => e.id === params.id);
  
  if (index === -1) {
    return NextResponse.json(
      { error: '해당 ID의 일정을 찾을 수 없습니다.' },
      { status: 404 }
    );
  }
  
  // 임시 저장소에서 삭제 (실제로는 데이터베이스에서 삭제)
  events.splice(index, 1);
  
  return NextResponse.json({ success: true });
}
