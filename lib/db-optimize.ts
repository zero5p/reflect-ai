import { sql } from './db'

// 데이터베이스 성능 최적화를 위한 인덱스 생성
export async function createIndexes() {
  try {
    // reflections 테이블 인덱스
    await sql`
      CREATE INDEX IF NOT EXISTS idx_reflections_user_email 
      ON reflections(user_email)
    `
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_reflections_user_created 
      ON reflections(user_email, created_at DESC)
    `
    
    // events 테이블 인덱스
    await sql`
      CREATE INDEX IF NOT EXISTS idx_events_user_email 
      ON events(user_email)
    `
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_events_user_date 
      ON events(user_email, date)
    `
    
    console.log('Database indexes created successfully')
  } catch (error) {
    console.error('Error creating indexes:', error)
  }
}

// 통계 데이터를 더 효율적으로 가져오는 함수
export async function getOptimizedDashboardData(userEmail: string) {
  const today = new Date().toISOString().split('T')[0]
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0]

  // 단일 쿼리로 모든 필요한 데이터를 한 번에 가져오기
  const dashboardData = await sql`
    WITH recent_reflection AS (
      SELECT id, title, content, emotion, intensity, created_at
      FROM reflections 
      WHERE user_email = ${userEmail}
      ORDER BY created_at DESC
      LIMIT 1
    ),
    today_events AS (
      SELECT id, title, description, date, time, type
      FROM events 
      WHERE user_email = ${userEmail} AND date = ${today}
      ORDER BY time ASC
    ),
    stats AS (
      SELECT 
        (SELECT COUNT(*) FROM reflections WHERE user_email = ${userEmail}) as total_reflections,
        (SELECT COUNT(*) FROM events WHERE user_email = ${userEmail} AND date < ${today}) as completed_events,
        (SELECT COUNT(DISTINCT DATE(created_at)) FROM reflections 
         WHERE user_email = ${userEmail} AND created_at >= ${thirtyDaysAgoStr}) as recent_reflection_days
    ),
    reflection_dates AS (
      SELECT DISTINCT DATE(created_at) as date
      FROM reflections 
      WHERE user_email = ${userEmail}
      ORDER BY date DESC
      LIMIT 30
    )
    SELECT 
      'recent_reflection' as type,
      json_agg(recent_reflection.*) as data
    FROM recent_reflection
    UNION ALL
    SELECT 
      'today_events' as type,
      json_agg(today_events.*) as data
    FROM today_events
    UNION ALL
    SELECT 
      'stats' as type,
      json_agg(stats.*) as data
    FROM stats
    UNION ALL
    SELECT 
      'reflection_dates' as type,
      json_agg(reflection_dates.*) as data
    FROM reflection_dates
  `

  // 결과 파싱
  const result: any = {
    recentReflection: null,
    todayEvents: [],
    stats: {
      totalReflections: 0,
      completedEvents: 0,
      consecutiveDays: 0,
      achievementRate: 0
    }
  }

  dashboardData.forEach((row: any) => {
    const data = row.data[0]
    switch (row.type) {
      case 'recent_reflection':
        result.recentReflection = data
        break
      case 'today_events':
        result.todayEvents = row.data.filter((item: any) => item !== null)
        break
      case 'stats':
        result.stats.totalReflections = parseInt(data.total_reflections)
        result.stats.completedEvents = parseInt(data.completed_events)
        result.stats.achievementRate = Math.round((data.recent_reflection_days / 30) * 100)
        break
      case 'reflection_dates':
        // 연속 사용일 계산
        const dates = row.data.filter((item: any) => item !== null).map((item: any) => new Date(item.date))
        const todayDate = new Date()
        todayDate.setHours(0, 0, 0, 0)
        
        let consecutiveDays = 0
        for (let i = 0; i < dates.length; i++) {
          const expectedDate = new Date(todayDate)
          expectedDate.setDate(todayDate.getDate() - i)
          
          const currentDate = new Date(dates[i])
          currentDate.setHours(0, 0, 0, 0)
          
          if (currentDate.getTime() === expectedDate.getTime()) {
            consecutiveDays++
          } else {
            break
          }
        }
        result.stats.consecutiveDays = consecutiveDays
        break
    }
  })

  return result
}