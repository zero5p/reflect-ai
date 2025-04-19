import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// POST: 추천 일정 수락 처리 (추천 -> 이벤트로 저장)
export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: '추천 ID는 필수입니다.' }, { status: 400 });
    }
    // 추천 일정 조회
    const recRows = await sql('SELECT * FROM recommendations WHERE id = $1', [id]);
    const recommendation = recRows[0];
    if (!recommendation) {
      return NextResponse.json({ error: '해당 추천을 찾을 수 없습니다.' }, { status: 404 });
    }
    // 추천을 이벤트로 저장
    const eventResult = await sql(
      'INSERT INTO events (title, date, startTime, endTime, category, isRecommended) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [recommendation.title, recommendation.date, recommendation.startTime, recommendation.endTime, recommendation.category, true]
    );
    // 추천 상태 업데이트(accepted)
    await sql('UPDATE recommendations SET accepted = true WHERE id = $1', [id]);
    return NextResponse.json({ success: true, event: eventResult[0] });
  } catch (error) {
    console.error('추천 수락 중 오류:', error);
    return NextResponse.json({ error: '추천 수락 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
