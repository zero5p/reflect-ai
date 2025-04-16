import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

// GET: 모든 성찰 목록 가져오기
export async function GET() {
  try {
    const result = await query('SELECT * FROM reflections ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: '성찰 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 새 성찰 추가하기
export async function POST(request: Request) {
  try {
    const { content, emotion } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { error: '내용을 입력해주세요.' },
        { status: 400 }
      );
    }
    
    const result = await query(
      'INSERT INTO reflections (content, emotion) VALUES ($1, $2) RETURNING *',
      [content, emotion]
    );
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: '성찰을 저장하는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
