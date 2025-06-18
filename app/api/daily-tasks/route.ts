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
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    // 오늘의 할 일 목록 조회
    const dailyTasks = await sql`
      SELECT 
        dt.*,
        g.title as goal_title,
        gp.current_phase_index,
        gp.daily_streak
      FROM daily_tasks dt
      JOIN goals g ON dt.goal_id = g.id
      LEFT JOIN goal_progress gp ON dt.goal_id = gp.goal_id AND gp.user_email = ${userEmail}
      WHERE dt.user_email = ${userEmail}
      AND (dt.completion_date = ${date} OR dt.completion_date IS NULL)
      ORDER BY dt.difficulty ASC, dt.created_at ASC
    `

    return NextResponse.json({
      success: true,
      data: dailyTasks
    })

  } catch (error) {
    console.error("일일 할 일 조회 실패:", error)
    return NextResponse.json({
      success: false,
      error: "일일 할 일을 가져오는 중 오류가 발생했습니다"
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userEmail = session.user.email
    const { goalId, taskTitle, taskDescription, difficulty, estimatedTime } = await request.json()

    if (!goalId || !taskTitle) {
      return NextResponse.json({ error: "Goal ID and task title are required" }, { status: 400 })
    }

    // 새로운 일일 할 일 추가
    const result = await sql`
      INSERT INTO daily_tasks (user_email, goal_id, task_title, task_description, difficulty, estimated_time)
      VALUES (${userEmail}, ${goalId}, ${taskTitle}, ${taskDescription || ''}, ${difficulty || 'easy'}, ${estimatedTime || '30분'})
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: result[0]
    })

  } catch (error) {
    console.error("일일 할 일 생성 실패:", error)
    return NextResponse.json({
      success: false,
      error: "일일 할 일 생성 중 오류가 발생했습니다"
    }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userEmail = session.user.email
    const { taskId, isCompleted } = await request.json()

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]

    // 할 일 완료/미완료 상태 업데이트
    const result = await sql`
      UPDATE daily_tasks 
      SET 
        is_completed = ${isCompleted},
        completion_date = ${isCompleted ? today : null},
        streak_count = CASE 
          WHEN ${isCompleted} THEN streak_count + 1 
          ELSE GREATEST(streak_count - 1, 0)
        END,
        updated_at = NOW()
      WHERE id = ${taskId} AND user_email = ${userEmail}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // 목표 진행률 업데이트
    if (isCompleted) {
      await updateGoalProgress(userEmail, result[0].goal_id)
    }

    return NextResponse.json({
      success: true,
      data: result[0]
    })

  } catch (error) {
    console.error("일일 할 일 업데이트 실패:", error)
    return NextResponse.json({
      success: false,
      error: "일일 할 일 업데이트 중 오류가 발생했습니다"
    }, { status: 500 })
  }
}

async function updateGoalProgress(userEmail: string, goalId: number) {
  try {
    // 해당 목표의 완료된 할 일 개수 조회
    const completedTasks = await sql`
      SELECT COUNT(*) as completed_count
      FROM daily_tasks
      WHERE user_email = ${userEmail} 
      AND goal_id = ${goalId} 
      AND is_completed = true
    `

    // 전체 할 일 개수 조회
    const totalTasks = await sql`
      SELECT COUNT(*) as total_count
      FROM daily_tasks
      WHERE user_email = ${userEmail} 
      AND goal_id = ${goalId}
    `

    const progressPercentage = totalTasks[0].total_count > 0 
      ? Math.round((completedTasks[0].completed_count / totalTasks[0].total_count) * 100)
      : 0

    const today = new Date().toISOString().split('T')[0]

    // 목표 진행률 업데이트 또는 생성
    await sql`
      INSERT INTO goal_progress (user_email, goal_id, progress_percentage, last_activity_date, daily_streak)
      VALUES (${userEmail}, ${goalId}, ${progressPercentage}, ${today}, 1)
      ON CONFLICT (user_email, goal_id)
      DO UPDATE SET
        progress_percentage = ${progressPercentage},
        last_activity_date = ${today},
        daily_streak = CASE 
          WHEN goal_progress.last_activity_date = ${today} THEN goal_progress.daily_streak
          WHEN goal_progress.last_activity_date = DATE(${today}::date - INTERVAL '1 day') THEN goal_progress.daily_streak + 1
          ELSE 1
        END,
        updated_at = NOW()
    `

    // goals 테이블의 progress도 업데이트
    await sql`
      UPDATE goals 
      SET progress = ${progressPercentage}, updated_at = NOW()
      WHERE id = ${goalId}
    `

  } catch (error) {
    console.error("목표 진행률 업데이트 실패:", error)
  }
}