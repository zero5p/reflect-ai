import { NextRequest, NextResponse } from "next/server"
import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()
    
    if (!idToken) {
      return NextResponse.json({ 
        success: false, 
        error: "ID token is required" 
      }, { status: 400 })
    }

    // Google ID 토큰 검증
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    
    const payload = ticket.getPayload()
    if (!payload) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid token" 
      }, { status: 401 })
    }

    // 사용자 정보 추출
    const userData = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      image: payload.picture,
    }

    // 세션 토큰 생성 (간단한 JWT 대신 임시로 사용자 ID 사용)
    const sessionToken = Buffer.from(JSON.stringify({
      userId: userData.id,
      email: userData.email,
      exp: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30일
    })).toString('base64')

    return NextResponse.json({
      success: true,
      data: {
        user: userData,
        token: sessionToken
      }
    })

  } catch (error) {
    console.error("Google 인증 실패:", error)
    return NextResponse.json({
      success: false,
      error: "Authentication failed"
    }, { status: 500 })
  }
}