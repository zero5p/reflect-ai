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

// GET: 모든 성찰 조회
export async function GET() {
  return NextResponse.json(reflections);
}

// POST: 새 성찰 추가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 필수 필드 검증
    if (!body.title || !body.content || !body.mood) {
      return NextResponse.json(
        { error: '제목, 내용, 감정 상태는 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }
    
    // 새 성찰 객체 생성
    const newReflection: Reflection = {
      id: Date.now().toString(), // 임시 ID 생성 방식
      date: new Date(body.date || new Date()),
      title: body.title,
      content: body.content,
      mood: body.mood,
      tags: body.tags || [],
      reminderDates: body.reminderDates || [],
    };
    
    // 임시 저장소에 추가 (실제로는 데이터베이스에 저장)
    reflections.push(newReflection);
    
    return NextResponse.json(newReflection, { status: 201 });
  } catch (error) {
    console.error('Error creating reflection:', error);
    return NextResponse.json(
      { error: '성찰 추가 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}