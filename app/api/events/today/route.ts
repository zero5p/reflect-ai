import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]

    const events = await sql`
      SELECT id, title, description, date, time, type
      FROM events 
      WHERE user_email = ${email} AND date = ${today}
      ORDER BY time ASC
    `

    return NextResponse.json({ 
      success: true, 
      events: events || [] 
    })
  } catch (error) {
    console.error('Error fetching today events:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch today events' 
    }, { status: 500 })
  }
}