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