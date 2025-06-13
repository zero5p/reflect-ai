import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/authOptions"
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') // YYYY-MM 형식
    const userEmail = session.user?.email

    if (!userEmail) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 })
    }

    // 월별 데이터만 가져오기 (성능 최적화)
    let startDate, endDate
    if (month) {
      startDate = `${month}-01`
      const nextMonth = new Date(month + '-01')
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      endDate = nextMonth.toISOString().split('T')[0]
    } else {
      // 기본값: 현재 월
      const now = new Date()
      startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      endDate = nextMonth.toISOString().split('T')[0]
    }

    // 병렬로 데이터 가져오기
    const [eventsResult, reflectionsResult] = await Promise.all([
      // 해당 월의 이벤트만
      sql`
        SELECT id, title, description, date, time, type, created_at
        FROM events 
        WHERE user_email = ${userEmail} 
        AND date >= ${startDate} 
        AND date < ${endDate}
        ORDER BY date ASC, time ASC
      `,
      // 해당 월의 성찰만
      sql`
        SELECT id, title, content, emotion, intensity, created_at
        FROM reflections 
        WHERE user_email = ${userEmail}
        AND DATE(created_at) >= ${startDate}
        AND DATE(created_at) < ${endDate}
        ORDER BY created_at DESC
      `
    ])

    const response = {
      success: true,
      data: {
        events: eventsResult || [],
        reflections: reflectionsResult || [],
        month: month || startDate.substring(0, 7)
      }
    }

    // 캐시 헤더 추가 (1분 캐시)
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    })
  } catch (error) {
    console.error('Error fetching calendar data:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch calendar data' 
    }, { status: 500 })
  }
}