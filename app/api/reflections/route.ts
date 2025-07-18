import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/authOptions"
import { analyzeEmotionAndGenerateResponse } from "@/lib/gemini"
import { sql, createTables } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    // Environment check
    console.log("Environment check:", {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET
    })

    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, aiStyle } = body

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    // Ensure tables exist
    try {
      await createTables()
    } catch (tableError) {
      console.error("Error creating tables:", tableError)
      return NextResponse.json({ 
        error: "Database connection failed",
        details: tableError instanceof Error ? tableError.message : String(tableError)
      }, { status: 500 })
    }

    // Analyze emotion and generate AI response
    let emotion = "calm"
    let intensity = "medium"
    let aiResponse
    try {
      const analysis = await analyzeEmotionAndGenerateResponse({
        title,
        content
      }, 0, aiStyle)
      emotion = analysis.emotion
      intensity = analysis.intensity
      aiResponse = analysis.response
    } catch (aiError) {
      console.error("AI emotion analysis failed:", aiError)
      aiResponse = "AI 감정 분석 및 응답 생성에 실패했습니다."
    }

    // Save to database
    console.log("Attempting to save reflection to database...")
    const result = await sql`
      INSERT INTO reflections (user_email, title, content, emotion, intensity, ai_response)
      VALUES (${session.user?.email}, ${title}, ${content}, ${emotion}, ${intensity}, ${aiResponse})
      RETURNING *
    `
    console.log("Reflection saved successfully:", result[0]?.id)

    const reflection = result[0]

    return NextResponse.json({ 
      success: true, 
      reflection,
      aiResponse,
      message: "성찰이 성공적으로 저장되었습니다!" 
    })
  } catch (error) {
    console.error("Error saving reflection:", error)
    console.error("Error details:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch reflections from database
    const reflections = await sql`
      SELECT * FROM reflections 
      WHERE user_email = ${session.user?.email}
      ORDER BY created_at DESC
    `

    return NextResponse.json({ 
      success: true,
      data: reflections 
    })
  } catch (error) {
    console.error("Error fetching reflections:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}