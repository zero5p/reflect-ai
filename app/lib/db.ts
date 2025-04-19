import { Pool } from 'pg';

// 전역 풀 인스턴스
let pool: Pool | null = null;

// 풀 초기화 함수
export function initPool() {
  if (!pool) {
    // 환경 변수에서 데이터베이스 URL 가져오기
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!connectionString) {
      console.warn('경고: 데이터베이스 URL이 설정되지 않았습니다.');
      // 개발 환경에서 모의 데이터를 사용할 수 있도록 null 반환
      return null;
    }
    
    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' 
        ? { rejectUnauthorized: false } 
        : false
    });
    
    // 연결 테스트
    pool.on('connect', () => {
      console.log('데이터베이스에 연결되었습니다');
    });
    
    pool.on('error', (err) => {
      console.error('데이터베이스 연결 오류:', err);
    });
  }
  
  return pool;
}

// 쿼리 실행 함수
export async function query(text: string, params?: unknown[]) {
  // 풀이 없으면 초기화 시도
  if (!pool) {
    pool = initPool();
    
    // 여전히 풀이 없으면 모의 데이터 반환 (개발 모드)
    if (!pool) {
      console.log('개발 모드: 모의 데이터 반환', { text });
      return mockQueryResponse(text, params as string[]);
    }
  }
  
  try {
    const start = Date.now();
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('쿼리 실행 완료', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('쿼리 실행 오류:', error);
    throw error;
  }
}

// 클라이언트 가져오기
export async function getClient() {
  if (!pool) {
    pool = initPool();
    if (!pool) {
      throw new Error('데이터베이스 연결을 초기화할 수 없습니다.');
    }
  }
  
  const client = await pool.connect();
  const originalQuery = client.query.bind(client);
  const originalRelease = client.release.bind(client);

  // 타임스탬프를 기록하기 위한 모니터링 래퍼
  type QueryParam = string | { text: string; values?: unknown[] };
  
  client.query = async function(...args: unknown[]) {
    const start = Date.now();
    let result;
    try {
      if (typeof args[0] === 'string') {
        result = await originalQuery(args[0], args[1] as unknown[]);
      } else if (args[0] && typeof args[0] === 'object') {
        const queryConfig = args[0] as { text: string; values?: unknown[] };
        result = await originalQuery(queryConfig.text, queryConfig.values);
      } else {
        throw new Error('지원되지 않는 쿼리 형식입니다.');
      }
      const duration = Date.now() - start;
      const queryText = typeof args[0] === 'string' ? args[0] : (args[0] as { text?: string })?.text || 'unknown';
      console.log('클라이언트 쿼리 실행', { text: queryText, duration, rows: result.rowCount });
      return result;
    } catch (err) {
      console.error('쿼리 실행 실패:', err);
      throw err;
    }
  };

  // 클라이언트가 특정 시간 후에 자동으로 반환되도록 함
  client.release = () => {
    client.query = originalQuery;
    client.release = originalRelease;
    return originalRelease();
  };

  return client;
}

// 모의 데이터 함수 (개발 환경에서 사용)
function mockQueryResponse(text: string, params?: string[]) {
  console.log('모의 데이터 사용 중:', { text, params });
  
  // reflections 테이블 모의 데이터
  const mockReflections = [
    {
      id: '1',
      content: '오늘은 프로젝트를 시작했다. 새로운 도전에 대한 기대감이 크다.',
      emotion: '기쁨',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      content: '팀 미팅에서 의견 충돌이 있었다. 내 주장을 더 명확히 설명했어야 했는데.',
      emotion: '화남',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      content: '오랜만에 친구를 만나서 좋은 시간을 보냈다. 일상에서 벗어나는 시간이 필요했다.',
      emotion: '평온',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  // events 테이블 모의 데이터
  const mockEvents = [
    {
      id: '1',
      title: '운동하기',
      date: new Date(),
      start_time: '10:00',
      end_time: '11:00',
      category: '건강'
    },
    {
      id: '2',
      title: '독서 시간',
      date: new Date(),
      start_time: '15:00',
      end_time: '16:00',
      category: '취미',
      is_recommended: true
    }
  ];
  
  // SQL 쿼리 분석하여 적절한 모의 데이터 반환
  if (text.includes('SELECT * FROM reflections')) {
    // 특정 ID 조회인 경우
    if (params && params.length > 0) {
      const id = params[0];
      const reflection = mockReflections.find(r => r.id === id);
      return {
        rows: reflection ? [reflection] : [],
        rowCount: reflection ? 1 : 0
      };
    }
    // 전체 조회
    return {
      rows: mockReflections,
      rowCount: mockReflections.length
    };
  } 
  else if (text.includes('SELECT * FROM events')) {
    // 이벤트 조회
    if (params && params.length > 0) {
      const id = params[0];
      const event = mockEvents.find(e => e.id === id);
      return {
        rows: event ? [event] : [],
        rowCount: event ? 1 : 0
      };
    }
    return {
      rows: mockEvents,
      rowCount: mockEvents.length
    };
  }
  else if (text.includes('INSERT INTO') || text.includes('UPDATE') || text.includes('DELETE')) {
    // 삽입/수정/삭제 작업은 성공 응답 반환
    return {
      rows: [{id: '999', ...(params && params.length > 0 ? { param: params[0] } : {})}],
      rowCount: 1
    };
  }
  
  // 기본 빈 응답
  return {
    rows: [],
    rowCount: 0
  };
}