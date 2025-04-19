// app/api/reflections/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { analyzeReflection } from '@/app/lib/gemini';
import { query } from '@/app/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reflectionId } = body;
    
    if (!reflectionId) {
      return NextResponse.json(
        { error: '성찰 ID는 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }
    
    // 데이터베이스에서 성찰 데이터 조회
    const result = await query('SELECT * FROM reflections WHERE id = $1', [reflectionId]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: '해당 ID의 성찰을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    const reflection = result.rows[0];
    
    // Gemini API를 사용하여 성찰 내용 분석
    const analysis = await analyzeReflection(reflection.content, reflection.emotion);
    
    // 분석 결과를 데이터베이스에 저장 (선택 사항)
    await query(
      'UPDATE reflections SET analysis = $1 WHERE id = $2',
      [JSON.stringify(analysis), reflectionId]
    );
    
    return NextResponse.json({ 
      success: true,
      reflection,
      analysis 
    });
  } catch (error) {
    console.error('성찰 분석 중 오류 발생:', error);
    return NextResponse.json(
      { error: '성찰 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}