import { NextRequest, NextResponse } from 'next/server';
import { Reflection } from '@/app/types/calendar';

// 임시 데이터 저장소 (실제로는 데이터베이스를 사용할 예정)
let reflections: Reflection[] = [
  {
    id: '1',
    date: new Date(Date.now() - 86400000), // 어제
    title: '업무 성과에 대한 생각',
    content: '오늘 프로젝트에서 중요한 기능을 완성했다. 처음에는 어려워 보였지만 차근차근 접근하니 해결할 수 있었다.',
    mood: '만족',
    tags: ['업무', '성취', '문제해결'],
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000 * 3), // 3일 전
    title: '운동 습관 되돌아보기',
    content: '요즘 운동을 꾸준히 하고 있다. 아침에 일어나서 30분 정도 조깅을 하는 습관이 몸과 마음에 긍정적인 영향을 주는 것 같다.',
    mood: '활기찬',
    tags: ['건강', '운동', '습관형성'],
  },
];

// 특정 ID로 성찰 찾기
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const reflection = reflections.find((r) => r.id === params.id);
  
  if (!reflection) {
    return NextResponse.json(
      { error: '해당 ID의 성찰을 찾을 수 없습니다.' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(reflection);
}

// 특정 ID의 성찰 업데이트
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const index = reflections.findIndex((r) => r.id === params.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: '해당 ID의 성찰을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 필수 필드 검증
    if (!body.title || !body.content || !body.mood) {
      return NextResponse.json(
        { error: '제목, 내용, 감정 상태는 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }
    
    // 업데이트된 성찰 객체
    const updatedReflection: Reflection = {
      ...reflections[index],
      title: body.title,
      content: body.content,
      mood: body.mood,
      tags: body.tags || reflections[index].tags,
      date: body.date ? new Date(body.date) : reflections[index].date,
      reminderDates: body.reminderDates || reflections[index].reminderDates,
    };
    
    // 임시 저장소에서 업데이트 (실제로는 데이터베이스에서 업데이트)
    reflections[index] = updatedReflection;
    
    return NextResponse.json(updatedReflection);
  } catch (error) {
    console.error('Error updating reflection:', error);
    return NextResponse.json(
      { error: '성찰 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 특정 ID의 성찰 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const index = reflections.findIndex((r) => r.id === params.id);
  
  if (index === -1) {
    return NextResponse.json(
      { error: '해당 ID의 성찰을 찾을 수 없습니다.' },
      { status: 404 }
    );
  }
  
  // 임시 저장소에서 삭제 (실제로는 데이터베이스에서 삭제)
  reflections.splice(index, 1);
  
  return NextResponse.json({ success: true });
}