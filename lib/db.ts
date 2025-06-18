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

    // Create daily_tasks table for checklist functionality
    await sql`
      CREATE TABLE IF NOT EXISTS daily_tasks (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        goal_id INTEGER REFERENCES goals(id) ON DELETE CASCADE,
        task_title VARCHAR(255) NOT NULL,
        task_description TEXT,
        difficulty VARCHAR(20) DEFAULT 'easy',
        estimated_time VARCHAR(50),
        is_completed BOOLEAN DEFAULT FALSE,
        completion_date DATE,
        streak_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create goal_progress table for tracking individual progress
    await sql`
      CREATE TABLE IF NOT EXISTS goal_progress (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        goal_id INTEGER REFERENCES goals(id) ON DELETE CASCADE,
        current_phase_index INTEGER DEFAULT 0,
        completed_tasks TEXT DEFAULT '[]',
        daily_streak INTEGER DEFAULT 0,
        last_activity_date DATE,
        progress_percentage INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_email, goal_id)
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

export interface DailyTask {
  id?: number
  user_email: string
  goal_id: number
  task_title: string
  task_description?: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimated_time: string
  is_completed: boolean
  completion_date?: string
  streak_count: number
  created_at?: string
  updated_at?: string
}

export interface GoalProgress {
  id?: number
  user_email: string
  goal_id: number
  current_phase_index: number
  completed_tasks: number[]
  daily_streak: number
  last_activity_date?: string
  progress_percentage: number
  created_at?: string
  updated_at?: string
}