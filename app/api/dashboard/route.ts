import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]

    // 최적화된 단일 쿼리로 모든 데이터 가져오기
    const [
      recentReflectionResult,
      todayEventsResult,
      statsResult,
      reflectionDatesResult
    ] = await Promise.all([
      // 최근 성찰 (인덱스 사용)
      sql`
        SELECT id, title, content, emotion, intensity, created_at
        FROM reflections 
        WHERE user_email = ${email}
        ORDER BY created_at DESC
        LIMIT 1
      `,
      // 오늘 일정 (인덱스 사용)
      sql`
        SELECT id, title, description, date, time, type
        FROM events 
        WHERE user_email = ${email} AND date = ${today}
        ORDER BY time ASC
      `,
      // 통계 데이터를 한 번에
      sql`
        SELECT 
          (SELECT COUNT(*) FROM reflections WHERE user_email = ${email}) as total_reflections,
          (SELECT COUNT(*) FROM events WHERE user_email = ${email} AND date < ${today}) as completed_events
      `,
      // 성찰 작성 날짜들 (연속 사용일 및 달성률 계산용)
      sql`
        SELECT DISTINCT DATE(created_at) as date
        FROM reflections 
        WHERE user_email = ${email}
        ORDER BY date DESC
        LIMIT 30
      `
    ])

    // 연속 사용일 계산
    let consecutiveDays = 0
    if (reflectionDatesResult.length > 0) {
      const dates = reflectionDatesResult.map(r => new Date(r.date))
      const todayDate = new Date()
      todayDate.setHours(0, 0, 0, 0)
      
      for (let i = 0; i < dates.length; i++) {
        const expectedDate = new Date(todayDate)
        expectedDate.setDate(todayDate.getDate() - i)
        
        const currentDate = new Date(dates[i])
        currentDate.setHours(0, 0, 0, 0)
        
        if (currentDate.getTime() === expectedDate.getTime()) {
          consecutiveDays++
        } else {
          break
        }
      }
    }

    // 목표 달성률 (최근 30일)
    const recentReflectionDays = reflectionDatesResult.length
    const achievementRate = Math.round((recentReflectionDays / 30) * 100)

    const response = {
      success: true,
      data: {
        recentReflection: recentReflectionResult[0] || null,
        todayEvents: todayEventsResult || [],
        stats: {
          totalReflections: parseInt(statsResult[0].total_reflections),
          completedEvents: parseInt(statsResult[0].completed_events),
          consecutiveDays,
          achievementRate
        }
      }
    }

    // 응답에 캐시 헤더 추가
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch dashboard data' 
    }, { status: 500 })
  }
}