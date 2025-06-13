import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // 작성한 성찰 수
    const [totalReflectionsResult] = await sql`
      SELECT COUNT(*) as count
      FROM reflections 
      WHERE user_email = ${email}
    `
    const totalReflections = parseInt(totalReflectionsResult.count)

    // 완료한 일정 수 (과거 날짜의 일정들)
    const today = new Date().toISOString().split('T')[0]
    const [completedEventsResult] = await sql`
      SELECT COUNT(*) as count
      FROM events 
      WHERE user_email = ${email} AND date < ${today}
    `
    const completedEvents = parseInt(completedEventsResult.count)

    // 연속 사용일 계산 (성찰을 작성한 날 기준)
    const reflectionDates = await sql`
      SELECT DISTINCT DATE(created_at) as date
      FROM reflections 
      WHERE user_email = ${email}
      ORDER BY date DESC
    `
    
    let consecutiveDays = 0
    if (reflectionDates.length > 0) {
      const dates = reflectionDates.map(r => new Date(r.date))
      const todayDate = new Date()
      todayDate.setHours(0, 0, 0, 0)
      
      // 오늘부터 역순으로 연속일 계산
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

    // 목표 달성률 (성찰 작성률 기준, 최근 30일)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0]

    const [recentReflectionsResult] = await sql`
      SELECT COUNT(DISTINCT DATE(created_at)) as count
      FROM reflections 
      WHERE user_email = ${email} AND created_at >= ${thirtyDaysAgoStr}
    `
    const recentReflectionDays = parseInt(recentReflectionsResult.count)
    const achievementRate = Math.round((recentReflectionDays / 30) * 100)

    const stats = {
      totalReflections,
      completedEvents,
      consecutiveDays,
      achievementRate
    }

    return NextResponse.json({ 
      success: true, 
      stats 
    })
  } catch (error) {
    console.error('Error fetching profile stats:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch profile stats' 
    }, { status: 500 })
  }
}