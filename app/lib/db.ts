import { Pool } from 'pg';

let pool: Pool;

if (!pool) {
  pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false // Vercel에서는 이 설정이 필요할 수 있습니다
    }
  });
}

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: result.rowCount });
  return result;
}

export async function getClient() {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;

  // 타임스탬프를 기록하기 위한 모니터링 래퍼
  client.query = async (...args: any[]) => {
    const start = Date.now();
    const result = await query.apply(client, args);
    const duration = Date.now() - start;
    console.log('Executed query', { text: args[0], duration, rows: result.rowCount });
    return result;
  };

  // 클라이언트가 특정 시간 후에 자동으로 반환되도록 합니다
  client.release = () => {
    client.query = query;
    client.release = release;
    return release.apply(client);
  };

  return client;
}
