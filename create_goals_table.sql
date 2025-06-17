-- goals 테이블 생성
CREATE TABLE IF NOT EXISTS goals (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  timeframe VARCHAR(100),
  phases TEXT, -- JSON 형태로 저장
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_goals_user_email ON goals(user_email);
CREATE INDEX IF NOT EXISTS idx_goals_created_at ON goals(created_at);