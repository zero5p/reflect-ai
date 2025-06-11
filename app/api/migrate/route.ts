import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    // Check if reflections table exists and get its structure
    const tables = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'reflections'
      ORDER BY ordinal_position
    `

    console.log("Current reflections table structure:", tables)

    // Add missing columns if they don't exist
    const columnExists = (columnName: string) => 
      tables.some(row => row.column_name === columnName)

    const migrations = []

    if (!columnExists('user_email')) {
      migrations.push(sql`ALTER TABLE reflections ADD COLUMN user_email VARCHAR(255)`)
    }

    if (!columnExists('title')) {
      migrations.push(sql`ALTER TABLE reflections ADD COLUMN title VARCHAR(255)`)
    }

    if (!columnExists('emotion')) {
      migrations.push(sql`ALTER TABLE reflections ADD COLUMN emotion VARCHAR(50)`)
    }

    if (!columnExists('intensity')) {
      migrations.push(sql`ALTER TABLE reflections ADD COLUMN intensity VARCHAR(20)`)
    }

    if (!columnExists('ai_response')) {
      migrations.push(sql`ALTER TABLE reflections ADD COLUMN ai_response TEXT`)
    }

    if (!columnExists('updated_at')) {
      migrations.push(sql`ALTER TABLE reflections ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`)
    }

    // Execute migrations
    for (const migration of migrations) {
      await migration
    }

    // If user_id exists but user_email doesn't, we might need to handle data migration
    if (columnExists('user_id') && columnExists('user_email')) {
      // Copy data from user_id to user_email if user_email is empty
      await sql`
        UPDATE reflections 
        SET user_email = user_id 
        WHERE user_email IS NULL AND user_id IS NOT NULL
      `
    }

    return NextResponse.json({ 
      success: true, 
      message: "Database migration completed",
      migrationsApplied: migrations.length
    })

  } catch (error) {
    console.error("Migration error:", error)
    return NextResponse.json({ 
      error: "Migration failed",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}