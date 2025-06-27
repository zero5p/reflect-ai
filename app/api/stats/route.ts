import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/authOptions"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: "Unauthorized" 
      }, { status: 401 })
    }

    const userEmail = session.user.email
    const { searchParams } = new URL(request.url)
    const days = Math.max(1, Math.min(365, parseInt(searchParams.get('days') || '7')))

    // 각 쿼리를 안전하게 실행
    let emotionTrends: any[] = []
    let routineStats: any[] = []
    let goalProgress: any[] = []
    let activitySummary: any = {}
    let recentActivity: any[] = []

    try {
      // 감정 트렌드 데이터 (지난 N일)
      emotionTrends = await sql`
        SELECT 
          DATE(created_at) as date,
          emotion,
          intensity,
          COUNT(*) as count
        FROM reflections 
        WHERE user_email = ${userEmail} 
          AND created_at >= CURRENT_DATE - INTERVAL '${sql.unsafe(days.toString())} days'
        GROUP BY DATE(created_at), emotion, intensity
        ORDER BY date DESC
      `
    } catch (error) {
      console.error('감정 트렌드 쿼리 실패:', error)
    }

    try {
      // 루틴 달성률 (지난 N일)
      routineStats = await sql`
        SELECT 
          DATE(updated_at) as date,
          COUNT(*) as total_tasks,
          COUNT(CASE WHEN is_completed = true THEN 1 END) as completed_tasks
        FROM daily_tasks 
        WHERE user_email = ${userEmail}
          AND updated_at >= CURRENT_DATE - INTERVAL '${sql.unsafe(days.toString())} days'
        GROUP BY DATE(updated_at)
        ORDER BY date DESC
      `
    } catch (error) {
      console.error('루틴 통계 쿼리 실패:', error)
    }

    try {
      // 목표 진행도
      goalProgress = await sql`
        SELECT 
          g.title,
          g.description
        FROM goals g
        WHERE g.user_email = ${userEmail}
        ORDER BY g.created_at DESC
      `
    } catch (error) {
      console.error('목표 진행도 쿼리 실패:', error)
    }

    try {
      // 전체 활동 요약
      const summaryResult = await sql`
        SELECT 
          (SELECT COUNT(*) FROM reflections WHERE user_email = ${userEmail}) as total_reflections,
          (SELECT COUNT(*) FROM daily_tasks WHERE user_email = ${userEmail} AND is_completed = true) as completed_tasks,
          (SELECT COUNT(*) FROM goals WHERE user_email = ${userEmail}) as total_goals,
          3 as avg_emotion_score
      `
      activitySummary = summaryResult[0] || {
        total_reflections: 0,
        completed_tasks: 0,
        total_goals: 0,
        avg_emotion_score: 3
      }
    } catch (error) {
      console.error('활동 요약 쿼리 실패:', error)
      activitySummary = {
        total_reflections: 0,
        completed_tasks: 0,
        total_goals: 0,
        avg_emotion_score: 3
      }
    }

    try {
      // 최근 회고 활동
      recentActivity = await sql`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as reflection_count
        FROM reflections 
        WHERE user_email = ${userEmail}
          AND created_at >= CURRENT_DATE - INTERVAL '${sql.unsafe(days.toString())} days'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `
    } catch (error) {
      console.error('최근 활동 쿼리 실패:', error)
    }

    return NextResponse.json({
      success: true,
      data: {
        emotionTrends: emotionTrends || [],
        routineStats: routineStats || [],
        goalProgress: goalProgress || [],
        activitySummary: activitySummary,
        recentActivity: recentActivity || [],
        period: `${days}일간`
      }
    })

  } catch (error) {
    console.error("통계 데이터 조회 실패:", error)
    return NextResponse.json({
      success: false,
      error: "통계 데이터를 가져오는 중 오류가 발생했습니다",
      data: {
        emotionTrends: [],
        routineStats: [],
        goalProgress: [],
        activitySummary: {
          total_reflections: 0,
          completed_tasks: 0,
          total_goals: 0,
          avg_emotion_score: 3
        },
        recentActivity: [],
        period: "7일간"
      }
    }, { status: 200 }) // 500 대신 200으로 변경하여 빈 데이터라도 반환
  }
}