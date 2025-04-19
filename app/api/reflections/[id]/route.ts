// app/api/reflections/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

// GET: 특정 ID의 성찰 가져오기
export async function GET(request: NextRequest, { params }) {
  try {
    const result = await query('SELECT * FROM reflections WHERE id = $1', [params.id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: '해당 성찰을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: '성찰을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// PUT: 특정 ID의 성찰 수정하기
export async function PUT(request: NextRequest, { params }) {
  try {
    const { content, emotion } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { error: '내용을 입력해주세요.' },
        { status: 400 }
      );
    }
    
    const result = await query(
      `UPDATE reflections 
       SET content = $1, 
           emotion = $2, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING *`,
      [content, emotion, params.id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: '해당 성찰을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: '성찰을 수정하는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 특정 ID의 성찰 삭제하기
export async function DELETE(request: NextRequest, { params }) {
  try {
    const result = await query('DELETE FROM reflections WHERE id = $1 RETURNING *', [params.id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: '해당 성찰을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: '성찰을 삭제하는데 실패했습니다.' },
      { status: 500 }
    );
  }
}