import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/authOptions"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email || email !== session.user.email) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    // 통계 데이터 병렬 조회
    const [totalReflectionsResult, currentStreakResult] = await Promise.all([
      // 총 성찰 개수
      sql`
        SELECT COUNT(*) as count 
        FROM reflections 
        WHERE user_email = ${email}
      `,
      // 연속 일수 계산 (최근 날짜부터 역순으로 확인)
      sql`
        SELECT DISTINCT DATE(created_at) as date
        FROM reflections 
        WHERE user_email = ${email}
        ORDER BY date DESC
        LIMIT 100
      `
    ])

    const totalReflections = totalReflectionsResult[0]?.count || 0

    // 연속 일수 계산
    let currentStreak = 0
    if (currentStreakResult.length > 0) {
      const dates = currentStreakResult.map(r => new Date(r.date))
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      // 오늘부터 역순으로 연속된 날짜 확인
      let checkDate = new Date(today)
      for (const date of dates) {
        const reflectionDate = new Date(date)
        reflectionDate.setHours(0, 0, 0, 0)
        
        if (reflectionDate.getTime() === checkDate.getTime()) {
          currentStreak++
          checkDate.setDate(checkDate.getDate() - 1)
        } else if (reflectionDate.getTime() < checkDate.getTime()) {
          // 날짜 간격이 있으면 연속 중단
          break
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalReflections: parseInt(totalReflections),
        currentStreak: currentStreak
      }
    })

  } catch (error) {
    console.error("통계 조회 실패:", error)
    return NextResponse.json({
      success: false,
      error: "통계 데이터를 가져오는 중 오류가 발생했습니다"
    }, { status: 500 })
  }
}