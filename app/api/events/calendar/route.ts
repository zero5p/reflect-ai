import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/authOptions'
import { sql } from '@/lib/db'

// 캘린더 전용 최적화된 이벤트 API
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')
    const month = searchParams.get('month')

    if (!year || !month) {
      return NextResponse.json({ error: 'Year and month are required' }, { status: 400 })
    }

    // 해당 월의 첫날과 마지막날 계산
    const startDate = `${year}-${month.padStart(2, '0')}-01`
    const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0]

    // 최적화된 쿼리: 필요한 월의 데이터만 가져오기
    const events = await sql`
      SELECT id, title, description, date, time, type
      FROM events 
      WHERE user_email = ${session.user.email}
        AND date >= ${startDate}
        AND date <= ${endDate}
      ORDER BY date ASC, time ASC
    `

    // 날짜별로 그룹화하여 클라이언트 처리 최적화
    const eventsByDate: Record<string, any[]> = {}
    events.forEach(event => {
      if (!eventsByDate[event.date]) {
        eventsByDate[event.date] = []
      }
      eventsByDate[event.date].push(event)
    })

    return NextResponse.json({ 
      events: eventsByDate,
      totalCount: events.length,
      dateRange: { startDate, endDate }
    })
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}