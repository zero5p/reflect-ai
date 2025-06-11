-- events 테이블 업데이트 - 사용자별 일정 관리를 위한 스키마 개선
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS user_email VARCHAR(255);

-- 인덱스 추가로 성능 향상
CREATE INDEX IF NOT EXISTS idx_events_user_email ON events(user_email);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- 기존 데이터가 있다면 user_email을 NULL로 설정 (나중에 사용자가 다시 추가할 수 있도록)
-- UPDATE events SET user_email = NULL WHERE user_email IS NULL;