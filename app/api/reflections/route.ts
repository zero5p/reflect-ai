import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/authOptions"
import { generateReflectionResponse } from "@/lib/gemini"
import { sql, createTables } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, emotion, intensity } = body

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    // Ensure tables exist
    await createTables()

    // Generate AI response
    const aiResponse = await generateReflectionResponse({
      title,
      content,
      emotion,
      intensity
    })

    // Save to database
    const result = await sql`
      INSERT INTO reflections (user_email, title, content, emotion, intensity, ai_response)
      VALUES (${session.user?.email}, ${title}, ${content}, ${emotion}, ${intensity}, ${aiResponse})
      RETURNING *
    `

    const reflection = result[0]

    return NextResponse.json({ 
      success: true, 
      reflection,
      aiResponse,
      message: "성찰이 성공적으로 저장되었습니다!" 
    })
  } catch (error) {
    console.error("Error saving reflection:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
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

    return NextResponse.json({ reflections })
  } catch (error) {
    console.error("Error fetching reflections:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}