import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const reflections = await sql`
      SELECT id, title, content, emotion, intensity, created_at
      FROM reflections 
      WHERE user_email = ${email}
      ORDER BY created_at DESC
      LIMIT 1
    `

    return NextResponse.json({ 
      success: true, 
      reflection: reflections[0] || null 
    })
  } catch (error) {
    console.error('Error fetching recent reflection:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch recent reflection' 
    }, { status: 500 })
  }
}