-- 1. reflections 테이블 생성(없으면)
CREATE TABLE IF NOT EXISTS reflections (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. recommendations 테이블 생성(없으면)
CREATE TABLE IF NOT EXISTS recommendations (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  startTime VARCHAR(10),
  endTime VARCHAR(10),
  category VARCHAR(50),
  reasoning TEXT,
  accepted BOOLEAN DEFAULT FALSE
);

-- 3. events 테이블 생성(없으면)
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  startTime VARCHAR(10),
  endTime VARCHAR(10),
  category VARCHAR(50),
  reflectionId INTEGER,
  isRecommended BOOLEAN DEFAULT FALSE
);

-- 4. 더미 데이터 삽입
INSERT INTO reflections (content) VALUES
('오늘 운동을 못 해서 아쉬웠다. 내일은 꼭 해보고 싶다.'),
('업무에 집중이 잘 안 됐다. 시간 관리가 필요하다.');

INSERT INTO recommendations (title, date, startTime, endTime, category, reasoning, accepted) VALUES
('운동 추천', '2025-04-21', '07:00', '08:00', '운동', '건강을 위해 아침 운동을 추천합니다.', false),
('책 읽기 추천', '2025-04-22', '21:00', '22:00', '자기계발', '자기계발을 위해 독서 시간을 가지세요.', false);

INSERT INTO events (title, date, startTime, endTime, category, isRecommended) VALUES
('회의', '2025-04-21', '10:00', '11:00', '업무', false),
('친구 만남', '2025-04-22', '19:00', '21:00', '사교', false);
