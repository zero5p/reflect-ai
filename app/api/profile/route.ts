import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/authOptions";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

// GET: 현재 로그인된 사용자 프로필 정보 조회
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "인증된 사용자가 아닙니다." }, { status: 401 });
  }
  // id가 없으면 email을 userId로 사용
  const userId = (session.user as any).id || session.user.email;
  try {
    const rows = await sql`SELECT * FROM profiles WHERE user_id = ${userId}`;
    if (!rows[0]) {
      return NextResponse.json({ error: "프로필이 존재하지 않습니다." }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("프로필 조회 오류:", error);
    return NextResponse.json({ error: "프로필 조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}

// POST: 프로필 생성 또는 업데이트
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "인증된 사용자가 아닙니다." }, { status: 401 });
  }
  const userId = (session.user as any).id || session.user.email;
  try {
    const { name, bio, avatar } = await request.json();
    if (!name) {
      return NextResponse.json({ error: "이름은 필수입니다." }, { status: 400 });
    }
    // upsert: 이미 있으면 업데이트, 없으면 생성
    const result = await sql`
      INSERT INTO profiles (user_id, name, bio, avatar)
      VALUES (${userId}, ${name}, ${bio || ""}, ${avatar || ""})
      ON CONFLICT (user_id) DO UPDATE SET name = EXCLUDED.name, bio = EXCLUDED.bio, avatar = EXCLUDED.avatar
      RETURNING *`;
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("프로필 저장 오류:", error);
    return NextResponse.json({ error: "프로필 저장 중 오류가 발생했습니다." }, { status: 500 });
  }
}

// (참고) profiles 테이블 구조 예시:
// CREATE TABLE profiles (
//   user_id TEXT PRIMARY KEY,
//   name TEXT NOT NULL,
//   bio TEXT,
//   avatar TEXT
// );
