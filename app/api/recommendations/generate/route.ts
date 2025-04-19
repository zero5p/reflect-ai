// app/api/recommendations/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateScheduleRecommendations } from "@/app/lib/gemini";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

// POST: Gemini 기반 추천 일정 생성 및 저장
export async function POST() {
  try {
    // 최근 성찰 데이터 가져오기 (최대 10개)
    const reflections = await sql`SELECT * FROM reflections ORDER BY created_at DESC LIMIT 10`;
    // 향후 7일 일정 가져오기
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const events = await sql`SELECT * FROM events WHERE date >= ${today.toISOString().split("T")[0]} AND date <= ${nextWeek.toISOString().split("T")[0]}`;
    // Gemini API로 추천 일정 생성
    const recommendations = await generateScheduleRecommendations(
      reflections,
      events,
    );
    // 추천 일정 DB에 저장
    const savedRecommendations = [];
    for (const recommendation of recommendations) {
      const result = await sql`INSERT INTO recommendations (title, date, startTime, endTime, category, reasoning, accepted)
         VALUES (${recommendation.title}, ${recommendation.date}, ${recommendation.startTime}, ${recommendation.endTime}, ${recommendation.category}, ${recommendation.reasoning}, false)
         RETURNING *`;
      savedRecommendations.push(result[0]);
    }
    return NextResponse.json({
      success: true,
      recommendations: savedRecommendations,
    });
  } catch (error) {
    console.error("일정 추천 생성 중 오류 발생:", error);
    return NextResponse.json(
      { error: "일정 추천 생성 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

// PUT: 추천 일정 수락/거절 처리 (isAccepted 컬럼 활용)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { recommendationId, isAccepted } = body;
    if (!recommendationId) {
      return NextResponse.json(
        { error: "추천 ID는 필수 입력 항목입니다." },
        { status: 400 },
      );
    }
    // 추천 상태 업데이트
    const updateResult = await sql`UPDATE recommendations SET accepted = ${isAccepted} WHERE id = ${recommendationId} RETURNING *`;
    if (!updateResult[0]) {
      return NextResponse.json(
        { error: "해당 추천을 찾을 수 없습니다." },
        { status: 404 },
      );
    }
    // accepted=true일 때만 이벤트로 등록
    let event = null;
    if (isAccepted) {
      const r = updateResult[0];
      const eventResult = await sql`INSERT INTO events (title, date, startTime, endTime, category, isRecommended) VALUES (${r.title}, ${r.date}, ${r.startTime}, ${r.endTime}, ${r.category}, true) RETURNING *`;
      event = eventResult[0];
    }
    return NextResponse.json({
      success: true,
      recommendation: updateResult[0],
      event,
    });
  } catch (error) {
    console.error("추천 수락/거절 중 오류 발생:", error);
    return NextResponse.json(
      { error: "추천 수락/거절 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
