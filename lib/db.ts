import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export { sql }

export async function createTables() {
  try {
    // Create reflections table
    await sql`
      CREATE TABLE IF NOT EXISTS reflections (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        emotion VARCHAR(50),
        intensity VARCHAR(20),
        ai_response TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create events table (if not exists)
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        time TIME NOT NULL,
        type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log('Tables created successfully')
  } catch (error) {
    console.error('Error creating tables:', error)
    throw error
  }
}

export interface Reflection {
  id?: number
  user_email: string
  title: string
  content: string
  emotion: string
  intensity: string
  ai_response?: string
  created_at?: string
  updated_at?: string
}

export interface Event {
  id?: number
  user_email: string
  title: string
  description?: string
  date: string
  time: string
  type: string
  created_at?: string
  updated_at?: string
}