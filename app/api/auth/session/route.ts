import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie')
    const sessionToken = extractSessionToken(cookieHeader)
    
    if (!sessionToken) {
      return NextResponse.json({ 
        success: false, 
        error: "No session token found" 
      }, { status: 401 })
    }

    // 토큰 검증
    const userData = validateSessionToken(sessionToken)
    
    if (!userData) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid session token" 
      }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: userData
    })

  } catch (error) {
    console.error("세션 검증 실패:", error)
    return NextResponse.json({
      success: false,
      error: "Session validation failed"
    }, { status: 500 })
  }
}

function extractSessionToken(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null
  
  const cookies = cookieHeader.split(';').map(c => c.trim())
  for (const cookie of cookies) {
    if (cookie.startsWith('next-auth.session-token=')) {
      return cookie.substring('next-auth.session-token='.length)
    }
  }
  return null
}

function validateSessionToken(token: string): any | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const payload = JSON.parse(decoded)
    
    // 토큰 만료 확인
    if (payload.exp && Date.now() > payload.exp) {
      return null
    }
    
    return {
      id: payload.userId,
      email: payload.email
    }
  } catch (error) {
    return null
  }
}