/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

// GET: 특정 ID로 일정 조회 (DB)
export async function GET(request: NextRequest, { params }: any) {
  try {
    const rows = await sql`SELECT * FROM events WHERE id = ${params.id}`;
    if (!rows[0]) {
      return NextResponse.json(
        { error: "해당 ID의 일정을 찾을 수 없습니다." },
        { status: 404 },
      );
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "일정 조회 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

// PUT: 특정 ID의 일정 업데이트 (DB)
export async function PUT(request: NextRequest, { params }: any) {
  try {
    const body = await request.json();
    const {
      title,
      date,
      startTime,
      endTime,
      category,
      reflectionId,
      isRecommended,
    } = body;
    if (!title || !date) {
      return NextResponse.json(
        { error: "제목과 날짜는 필수 입력 항목입니다." },
        { status: 400 },
      );
    }
    const result =
      await sql`UPDATE events SET title = ${title}, date = ${date}, startTime = ${startTime}, endTime = ${endTime}, category = ${category}, reflectionId = ${reflectionId}, isRecommended = ${isRecommended} WHERE id = ${params.id} RETURNING *`;
    if (!result[0]) {
      return NextResponse.json(
        { error: "해당 ID의 일정을 찾을 수 없습니다." },
        { status: 404 },
      );
    }
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "일정 업데이트 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

// DELETE: 특정 ID의 일정 삭제 (DB)
export async function DELETE(request: NextRequest, { params }: any) {
  try {
    const result =
      await sql`DELETE FROM events WHERE id = ${params.id} RETURNING *`;
    if (!result[0]) {
      return NextResponse.json(
        { error: "해당 ID의 일정을 찾을 수 없습니다." },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "일정 삭제 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
