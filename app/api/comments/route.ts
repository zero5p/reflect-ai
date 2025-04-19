import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Neon 서버리스 드라이버로 Postgres 연결
const sql = neon(process.env.DATABASE_URL!);

// POST: 댓글 저장
export async function POST(request: NextRequest) {
  const { comment } = await request.json();
  await sql('INSERT INTO comments (comment) VALUES ($1)', [comment]);
  return NextResponse.json({ success: true });
}

// GET: 모든 댓글 조회
export async function GET() {
  const rows = await sql('SELECT * FROM comments');
  return NextResponse.json(rows);
}
