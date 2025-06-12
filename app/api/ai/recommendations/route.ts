import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/authOptions"
import { generateScheduleRecommendations } from "@/lib/gemini"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userRequest } = body

    // Fetch recent reflections from database
    const reflections = await sql`
      SELECT title, content, emotion, intensity, created_at
      FROM reflections 
      WHERE user_email = ${session.user?.email}
      ORDER BY created_at DESC
      LIMIT 10
    `

    // If no reflections exist, use sample data for recommendations
    const reflectionData = reflections.length > 0 ? 
      reflections.map(r => ({
        title: r.title,
        content: r.content,
        emotion: r.emotion,
        intensity: r.intensity,
        createdAt: r.created_at
      })) : [
        {
          title: "첫 번째 성찰을 위한 추천",
          content: "아직 성찰 기록이 없어서 일반적인 웰빙 활동을 추천드립니다.",
          emotion: "calm",
          intensity: "medium",
          createdAt: new Date().toISOString()
        }
      ]

    const recommendations = await generateScheduleRecommendations(reflectionData, userRequest)

    return NextResponse.json({ 
      success: true, 
      recommendations: recommendations.recommendations || []
    })
    
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return NextResponse.json({ error: "AI 추천 생성에 실패했습니다." }, { status: 500 })
  }
}