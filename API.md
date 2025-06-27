# 📚 Reflect AI API Documentation

## 개요
Reflect AI의 백엔드 API 엔드포인트 문서입니다. 모든 API는 Next-Auth 기반 인증이 필요합니다.

## 인증
모든 API 요청은 유효한 세션이 필요합니다.
```javascript
// 인증 확인
const session = await getServerSession(authOptions)
if (!session?.user?.email) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
```

---

## 📝 회고/성찰 API

### GET /api/reflections
사용자의 모든 회고 목록을 조회합니다.

**응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_email": "user@example.com",
      "title": "오늘의 성찰",
      "content": "오늘은 새로운 것을 배웠다...",
      "emotion": "좋음",
      "intensity": "보통",
      "ai_response": "긍정적인 하루였네요...",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### POST /api/reflections
새로운 회고를 생성합니다.

**요청 바디:**
```json
{
  "title": "제목",
  "content": "회고 내용",
  "emotion": "좋음",
  "intensity": "높음"
}
```

---

## 🎯 목표 관리 API

### GET /api/goals
사용자의 모든 목표를 조회합니다.

**응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_email": "user@example.com",
      "title": "영어 실력 향상",
      "description": "3개월 내 토익 800점 달성",
      "timeframe": "3개월",
      "phases": [
        {
          "title": "기초 단어 암기",
          "tasks": [
            {
              "title": "매일 단어 20개 암기",
              "description": "토익 단어장 활용",
              "difficulty": "easy",
              "timeEstimate": "30분"
            }
          ]
        }
      ],
      "progress": 0,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### POST /api/goals
새로운 목표를 생성합니다.

**요청 바디:**
```json
{
  "title": "목표 제목",
  "description": "목표 설명",
  "timeframe": "기간",
  "phases": [
    {
      "title": "단계 제목",
      "tasks": [
        {
          "title": "작업 제목",
          "description": "작업 설명",
          "difficulty": "easy|medium|hard",
          "timeEstimate": "예상 시간"
        }
      ]
    }
  ]
}
```

---

## ✅ 일일 할일 API

### GET /api/daily-tasks
사용자의 일일 할일 목록을 조회합니다.

**쿼리 파라미터:**
- `date` (선택): 특정 날짜 (YYYY-MM-DD)

**응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_email": "user@example.com",
      "goal_id": 1,
      "task_title": "매일 단어 20개 암기",
      "task_description": "토익 단어장 활용",
      "difficulty": "easy",
      "estimated_time": "30분",
      "is_completed": false,
      "completion_date": null,
      "streak_count": 5,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### PATCH /api/daily-tasks/[id]
일일 할일의 완료 상태를 업데이트합니다.

**요청 바디:**
```json
{
  "is_completed": true
}
```

---

## 📊 통계 API

### GET /api/stats
사용자의 활동 통계를 조회합니다.

**쿼리 파라미터:**
- `days` (선택): 조회 기간 (기본값: 7)

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "emotionTrends": [
      {
        "date": "2024-01-15",
        "emotion": "좋음",
        "intensity": "높음",
        "count": 3
      }
    ],
    "routineStats": [
      {
        "date": "2024-01-15",
        "total_tasks": 5,
        "completed_tasks": 3
      }
    ],
    "goalProgress": [
      {
        "title": "영어 실력 향상",
        "progress_percentage": 25,
        "daily_streak": 7,
        "current_phase_index": 0
      }
    ],
    "activitySummary": {
      "total_reflections": 15,
      "completed_tasks": 42,
      "total_goals": 3,
      "avg_emotion_score": 3.8
    },
    "period": "7일간"
  }
}
```

---

## 📅 일정 관리 API

### GET /api/events
사용자의 일정을 조회합니다.

**쿼리 파라미터:**
- `date` (선택): 특정 날짜 (YYYY-MM-DD)

**응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_email": "user@example.com",
      "title": "회고 작성",
      "description": "오늘 하루 돌아보기",
      "date": "2024-01-15",
      "time": "21:00",
      "type": "reflection",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### POST /api/events
새로운 일정을 생성합니다.

**요청 바디:**
```json
{
  "title": "일정 제목",
  "description": "일정 설명",
  "date": "2024-01-15",
  "time": "21:00",
  "type": "reflection|goal|personal"
}
```

---

## 🔧 대시보드 API

### GET /api/dashboard
대시보드용 요약 데이터를 조회합니다.

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "todayTasks": {
      "total": 5,
      "completed": 3,
      "percentage": 60
    },
    "weeklyProgress": {
      "reflections": 5,
      "avgEmotion": 3.8,
      "goalAchievement": 75
    },
    "streaks": {
      "reflection": 7,
      "goals": 3
    },
    "recentReflection": {
      "title": "오늘의 성찰",
      "summary": "긍정적인 하루였다...",
      "emotion": "좋음"
    }
  }
}
```

---

## 🗄️ 데이터베이스 스키마

### reflections 테이블
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL | 기본키 |
| user_email | VARCHAR(255) | 사용자 이메일 |
| title | VARCHAR(255) | 회고 제목 |
| content | TEXT | 회고 내용 |
| emotion | VARCHAR(50) | 감정 상태 |
| intensity | VARCHAR(20) | 감정 강도 |
| ai_response | TEXT | AI 응답 |
| created_at | TIMESTAMP | 생성일시 |

### goals 테이블
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL | 기본키 |
| user_email | VARCHAR(255) | 사용자 이메일 |
| title | VARCHAR(255) | 목표 제목 |
| description | TEXT | 목표 설명 |
| timeframe | VARCHAR(100) | 목표 기간 |
| phases | TEXT | 단계별 계획 (JSON) |
| progress | INTEGER | 진행률 (0-100) |
| created_at | TIMESTAMP | 생성일시 |

### daily_tasks 테이블
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL | 기본키 |
| user_email | VARCHAR(255) | 사용자 이메일 |
| goal_id | INTEGER | 목표 ID (FK) |
| task_title | VARCHAR(255) | 할일 제목 |
| difficulty | VARCHAR(20) | 난이도 |
| is_completed | BOOLEAN | 완료 여부 |
| streak_count | INTEGER | 연속 달성 수 |
| created_at | TIMESTAMP | 생성일시 |

---

## 🚨 에러 응답

모든 API는 다음과 같은 형태의 에러 응답을 반환합니다:

```json
{
  "success": false,
  "error": "에러 메시지"
}
```

### 일반적인 에러 코드
- `401 Unauthorized`: 인증 실패
- `400 Bad Request`: 잘못된 요청
- `404 Not Found`: 리소스 없음
- `500 Internal Server Error`: 서버 오류

---

## 📈 사용 예시

### JavaScript/React에서 API 호출
```javascript
// 회고 목록 조회
const response = await fetch('/api/reflections')
const data = await response.json()

// 새 목표 생성
const response = await fetch('/api/goals', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: '운동 습관 만들기',
    description: '매일 30분 운동하기',
    timeframe: '3개월'
  })
})
```

---

## 📝 개발 노트

### 인증 처리
- Next-Auth의 `getServerSession` 사용
- 모든 API에서 사용자 이메일로 데이터 필터링

### 데이터 검증
- 클라이언트와 서버 양쪽에서 데이터 검증
- TypeScript 인터페이스로 타입 안전성 보장

### 성능 최적화
- 적절한 인덱싱으로 쿼리 성능 향상
- 페이지네이션 고려 (필요시 구현)