import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

// GET: 추천 일정 목록 조회 (DB)
export async function GET() {
  try {
    const rows = await sql`SELECT * FROM recommendations ORDER BY date ASC`;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "추천 목록을 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}

// POST: 추천 일정 추가 (DB)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, date, startTime, endTime, category, reasoning, accepted } =
      body;
    if (!title || !date || !startTime || !endTime || !category) {
      return NextResponse.json(
        { error: "필수 항목이 누락되었습니다." },
        { status: 400 },
      );
    }
    const result = await sql`INSERT INTO recommendations (title, date, startTime, endTime, category, reasoning, accepted) VALUES (${title}, ${date}, ${startTime}, ${endTime}, ${category}, ${reasoning || ""}, ${accepted ?? false}) RETURNING *`;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating recommendation:", error);
    return NextResponse.json(
      { error: "추천 추가 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
