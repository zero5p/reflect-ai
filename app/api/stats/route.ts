import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/authOptions"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userEmail = session.user.email
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '7')

    // 감정 트렌드 데이터 (지난 N일)
    const emotionTrends = await sql`
      SELECT 
        DATE(created_at) as date,
        emotion,
        intensity,
        COUNT(*) as count
      FROM reflections 
      WHERE user_email = ${userEmail} 
        AND created_at >= NOW() - INTERVAL ${days + ' days'}
      GROUP BY DATE(created_at), emotion, intensity
      ORDER BY date DESC
    `

    // 루틴 달성률 (지난 N일)
    const routineStats = await sql`
      SELECT 
        DATE(updated_at) as date,
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN is_completed = true THEN 1 END) as completed_tasks
      FROM daily_tasks 
      WHERE user_email = ${userEmail}
        AND updated_at >= NOW() - INTERVAL ${days + ' days'}
      GROUP BY DATE(updated_at)
      ORDER BY date DESC
    `

    // 목표 진행도
    const goalProgress = await sql`
      SELECT 
        g.title,
        g.description,
        gp.progress_percentage,
        gp.daily_streak,
        gp.current_phase_index
      FROM goals g
      LEFT JOIN goal_progress gp ON g.id = gp.goal_id
      WHERE g.user_email = ${userEmail}
      ORDER BY g.created_at DESC
    `

    // 전체 활동 요약
    const activitySummary = await sql`
      SELECT 
        (SELECT COUNT(*) FROM reflections WHERE user_email = ${userEmail}) as total_reflections,
        (SELECT COUNT(*) FROM daily_tasks WHERE user_email = ${userEmail} AND is_completed = true) as completed_tasks,
        (SELECT COUNT(*) FROM goals WHERE user_email = ${userEmail}) as total_goals,
        (SELECT AVG(
          CASE 
            WHEN intensity = '매우 좋음' THEN 5
            WHEN intensity = '좋음' THEN 4
            WHEN intensity = '보통' THEN 3
            WHEN intensity = '나쁨' THEN 2
            WHEN intensity = '매우 나쁨' THEN 1
            ELSE 3
          END
        ) FROM reflections WHERE user_email = ${userEmail}) as avg_emotion_score
    `

    // 최근 회고 활동
    const recentActivity = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as reflection_count
      FROM reflections 
      WHERE user_email = ${userEmail}
        AND created_at >= NOW() - INTERVAL ${days + ' days'}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `

    return NextResponse.json({
      success: true,
      data: {
        emotionTrends: emotionTrends,
        routineStats: routineStats,
        goalProgress: goalProgress,
        activitySummary: activitySummary[0] || {
          total_reflections: 0,
          completed_tasks: 0,
          total_goals: 0,
          avg_emotion_score: 3
        },
        recentActivity: recentActivity,
        period: `${days}일간`
      }
    })

  } catch (error) {
    console.error("통계 데이터 조회 실패:", error)
    return NextResponse.json({
      success: false,
      error: "통계 데이터를 가져오는 중 오류가 발생했습니다"
    }, { status: 500 })
  }
}