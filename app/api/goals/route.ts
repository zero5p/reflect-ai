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

    // goals 테이블 생성 (없으면)
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS goals (
          id SERIAL PRIMARY KEY,
          user_email VARCHAR(255) NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          timeframe VARCHAR(100),
          phases TEXT,
          progress INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    } catch (tableError) {
      console.error("Error creating goals table:", tableError)
    }

    // 사용자 목표 조회
    const goals = await sql`
      SELECT * FROM goals 
      WHERE user_email = ${userEmail}
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      success: true,
      data: goals.map(goal => ({
        ...goal,
        phases: goal.phases ? JSON.parse(goal.phases) : []
      }))
    })

  } catch (error) {
    console.error("목표 조회 실패:", error)
    return NextResponse.json({
      success: false,
      error: "목표를 가져오는 중 오류가 발생했습니다"
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
    const body = await request.json()
    const { title, description, timeframe, phases } = body

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // goals 테이블 생성 (없으면)
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS goals (
          id SERIAL PRIMARY KEY,
          user_email VARCHAR(255) NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          timeframe VARCHAR(100),
          phases TEXT,
          progress INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    } catch (tableError) {
      console.error("Error creating goals table:", tableError)
    }

    // 목표 저장
    const result = await sql`
      INSERT INTO goals (user_email, title, description, timeframe, phases, progress, created_at, updated_at)
      VALUES (${userEmail}, ${title}, ${description || ''}, ${timeframe || ''}, ${JSON.stringify(phases || [])}, 0, NOW(), NOW())
      RETURNING *
    `

    const savedGoal = result[0]

    // 목표 생성 시 자동으로 일일 할 일들도 생성
    await createDailyTasksFromGoal(userEmail, savedGoal.id, phases || [])

    return NextResponse.json({
      success: true,
      data: {
        ...savedGoal,
        phases: savedGoal.phases ? JSON.parse(savedGoal.phases) : []
      }
    })

  } catch (error) {
    console.error("목표 저장 실패:", error)
    return NextResponse.json({
      success: false,
      error: "목표 저장 중 오류가 발생했습니다"
    }, { status: 500 })
  }
}

async function createDailyTasksFromGoal(userEmail: string, goalId: number, phases: any[]) {
  try {
    // 첫 번째 단계의 일일 가능한 작업들을 daily_tasks로 생성
    if (phases.length > 0) {
      const firstPhase = phases[0]
      
      for (const task of firstPhase.tasks || []) {
        // 매일 할 수 있는 작업들만 필터링 (더 엄격한 기준)
        if (task.timeEstimate?.includes('매일') || 
            task.title?.includes('매일') ||
            task.description?.includes('매일') ||
            task.timeEstimate?.includes('하루')) {
          
          await sql`
            INSERT INTO daily_tasks (user_email, goal_id, task_title, task_description, difficulty, estimated_time)
            VALUES (
              ${userEmail}, 
              ${goalId}, 
              ${task.title}, 
              ${task.description || ''}, 
              ${task.difficulty || 'easy'}, 
              ${task.timeEstimate || '30분'}
            )
          `
        }
      }
    }

    // 목표 진행률 초기화
    await sql`
      INSERT INTO goal_progress (user_email, goal_id, current_phase_index, progress_percentage)
      VALUES (${userEmail}, ${goalId}, 0, 0)
      ON CONFLICT (user_email, goal_id) DO NOTHING
    `

    console.log(`목표 ${goalId}에 대한 일일 할 일들이 생성되었습니다.`)
  } catch (error) {
    console.error("일일 할 일 생성 실패:", error)
  }
}