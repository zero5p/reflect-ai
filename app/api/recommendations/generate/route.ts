// app/api/recommendations/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateScheduleRecommendations } from '@/app/lib/gemini';
import { query } from '@/app/lib/db';

export async function POST(request: NextRequest) {
  try {
    // 최근 성찰 데이터 가져오기 (최대 10개)
    const reflectionsResult = await query(
      'SELECT * FROM reflections ORDER BY created_at DESC LIMIT 10'
    );
    
    // 향후 7일 동안의 기존 일정 가져오기
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const eventsResult = await query(
      'SELECT * FROM events WHERE date >= $1 AND date <= $2',
      [today.toISOString(), nextWeek.toISOString()]
    );
    
    // Gemini API를 사용하여 일정 추천 생성
    const recommendations = await generateScheduleRecommendations(
      reflectionsResult.rows,
      eventsResult.rows
    );
    
    // 추천 일정을 데이터베이스에 저장 (선택 사항)
    const savedRecommendations = [];
    
    for (const recommendation of recommendations) {
      const result = await query(
        `INSERT INTO recommendations 
         (title, date, start_time, end_time, category, reasoning, is_accepted)
         VALUES ($1, $2, $3, $4, $5, $6, false)
         RETURNING *`,
        [
          recommendation.title,
          recommendation.date,
          recommendation.startTime,
          recommendation.endTime,
          recommendation.category,
          recommendation.reasoning
        ]
      );
      
      savedRecommendations.push(result.rows[0]);
    }
    
    return NextResponse.json({ 
      success: true,
      recommendations: savedRecommendations 
    });
  } catch (error) {
    console.error('일정 추천 생성 중 오류 발생:', error);
    return NextResponse.json(
      { error: '일정 추천 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 추천 일정 수락 또는 거절
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { recommendationId, isAccepted } = body;
    
    if (!recommendationId) {
      return NextResponse.json(
        { error: '추천 ID는 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }
    
    // 추천 상태 업데이트
    const updateResult = await query(
      'UPDATE recommendations SET is_accepted = $1 WHERE id = $2 RETURNING *',
      [isAccepted, recommendationId]
    );
    
    if (updateResult.rows.length === 0) {
      return NextResponse.json(
        { error: '해당 ID의 추천을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    const recommendation = updateResult.rows[0];
    
    // 수락된 추천을 일정으로 변환
    if (isAccepted) {
      await query(
        `INSERT INTO events 
         (title, date, start_time, end_time, category, is_recommended)
         VALUES ($1, $2, $3, $4, $5, true)`,
        [
          recommendation.title,
          recommendation.date,
          recommendation.start_time,
          recommendation.end_time,
          recommendation.category
        ]
      );
    }
    
    return NextResponse.json({ 
      success: true,
      recommendation
    });
  } catch (error) {
    console.error('추천 수락/거절 중 오류 발생:', error);
    return NextResponse.json(
      { error: '추천 수락/거절 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}