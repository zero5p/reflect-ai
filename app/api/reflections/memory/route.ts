import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/authOptions'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const days = searchParams.get('days') || '7'
    
    const daysAgo = parseInt(days)
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() - daysAgo)
    
    // 해당 날짜 전후 3일 범위에서 기록 찾기
    const startDate = new Date(targetDate)
    startDate.setDate(startDate.getDate() - 1)
    const endDate = new Date(targetDate)
    endDate.setDate(endDate.getDate() + 2)

    const result = await sql`
      SELECT id, title, content, emotion, created_at, ai_response
      FROM reflections 
      WHERE user_email = ${session.user.email}
        AND DATE(created_at) BETWEEN ${startDate.toISOString().split('T')[0]} 
        AND ${endDate.toISOString().split('T')[0]}
      ORDER BY ABS(EXTRACT(day FROM (created_at - ${targetDate.toISOString()}::date))) ASC,
               created_at DESC
      LIMIT 1
    `

    return NextResponse.json({
      success: true,
      data: result[0] || null,
      targetDate: targetDate.toISOString().split('T')[0],
      daysAgo
    })

  } catch (error) {
    console.error('Memory API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch memory data' },
      { status: 500 }
    )
  }
}