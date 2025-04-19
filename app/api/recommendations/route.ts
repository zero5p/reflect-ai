import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// 추천 일정 타입 명시
interface Recommendation {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  category: string;
  reasoning: string;
  accepted: boolean;
}

// GET: 추천 일정 목록 조회 (DB)
export async function GET() {
  try {
    const rows = await sql<Recommendation[]>('SELECT * FROM recommendations ORDER BY date ASC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json({ error: '추천 목록을 불러오지 못했습니다.' }, { status: 500 });
  }
}

// POST: 추천 일정 추가 (DB)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, date, startTime, endTime, category, reasoning, accepted } = body;
    if (!title || !date || !startTime || !endTime || !category) {
      return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
    }
    const result = await sql<Recommendation[]>(
      'INSERT INTO recommendations (title, date, startTime, endTime, category, reasoning, accepted) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, date, startTime, endTime, category, reasoning || '', accepted ?? false]
    );
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating recommendation:', error);
    return NextResponse.json({ error: '추천 추가 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// POST: 추천 일정 수락하기
export async function POSTAccept(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id || !body.recommendation) {
      return NextResponse.json(
        { error: '추천 ID와 추천 데이터는 필수입니다.' },
        { status: 400 }
      );
    }
    const recommendation = body.recommendation as Recommendation;
    // reflectionId 필드 제거 (Recommendation 타입에 없음)
    const newEvent = {
      id: Date.now().toString(),
      title: recommendation.title,
      date: new Date(recommendation.date),
      startTime: recommendation.startTime,
      endTime: recommendation.endTime,
      category: recommendation.category,
      isRecommended: true,
    };
    return NextResponse.json({
      success: true,
      event: newEvent,
    });
  } catch (error) {
    console.error('Error accepting recommendation:', error);
    return NextResponse.json(
      { error: '추천 수락 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}