import { NextRequest, NextResponse } from 'next/server';
import { CalendarEvent } from '@/app/types/calendar';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET: 모든 일정 조회 또는 날짜별 필터링 (DB)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const dateParam = searchParams.get('date');
  try {
    let rows;
    if (dateParam) {
      rows = await sql('SELECT * FROM events WHERE date = $1', [dateParam]);
    } else {
      rows = await sql('SELECT * FROM events ORDER BY date ASC');
    }
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: '일정 목록을 불러오지 못했습니다.' }, { status: 500 });
  }
}

// POST: 새 일정 추가 (DB)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, date, startTime, endTime, category, reflectionId, isRecommended } = body;
    if (!title || !date) {
      return NextResponse.json({ error: '제목과 날짜는 필수 입력 항목입니다.' }, { status: 400 });
    }
    const result = await sql(
      'INSERT INTO events (title, date, startTime, endTime, category, reflectionId, isRecommended) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, date, startTime, endTime, category, reflectionId, isRecommended || false]
    );
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: '일정 추가 중 오류가 발생했습니다.' }, { status: 500 });
  }
}