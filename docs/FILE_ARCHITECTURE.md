# 📂 Reflect-AI 파일 아키텍처 가이드

## 🏗 전체 구조 개요

```
reflect-ai/
├── 📁 app/                    # Next.js 13+ App Router (페이지 & API)
├── 📁 components/             # 재사용 가능한 UI 컴포넌트
├── 📁 lib/                    # 비즈니스 로직 & 유틸리티
├── 📄 package.json            # 프로젝트 설정 & 의존성
├── 📄 tailwind.config.ts      # Tailwind CSS 설정
├── 📄 next.config.ts          # Next.js 빌드 설정
└── 📄 tsconfig.json           # TypeScript 컴파일러 설정
```

---

## 📱 App Directory (Next.js App Router)

### 🏠 Root Level Pages
```
app/
├── 📄 layout.tsx              # 🌐 전역 레이아웃 (모든 페이지 공통)
│   ├── 🔧 NextAuth 세션 프로바이더
│   ├── 🎨 테마 프로바이더 (다크모드)  
│   ├── ✨ 페이지 전환 애니메이션
│   └── 🌍 HTML 기본 구조
│
├── 📄 page.tsx                # 🏠 홈페이지 (메인 대시보드)
│   ├── 📊 최근 활동 요약
│   ├── 🎯 빠른 액션 버튼들
│   ├── 📈 개인 통계 미리보기
│   └── 🔗 주요 기능 링크
│
├── 📄 globals.css             # 🎨 전역 스타일시트
│   ├── Tailwind 기본 설정
│   ├── 커스텀 CSS 변수
│   └── 다크모드 색상 정의
│
└── 📄 session-provider.tsx    # 🔐 NextAuth 클라이언트 프로바이더
```

### 🔌 API Routes (`app/api/`)

#### 🔐 Authentication (`api/auth/`)
```
api/auth/
├── 📄 authOptions.ts          # 🔑 NextAuth 핵심 설정
│   ├── Google OAuth 설정
│   ├── 세션 전략 정의
│   ├── 콜백 함수들
│   └── JWT 토큰 처리
│
└── 📁 [...nextauth]/          # 🔄 NextAuth 동적 라우트
    └── 📄 route.ts            # OAuth 인증 핸들러
```

#### 📊 Data APIs
```
api/
├── 📄 dashboard/route.ts      # 🏠 통합 대시보드 API
│   ├── 🎯 홈 + 프로필 데이터 통합
│   ├── ⚡ 병렬 쿼리 실행
│   ├── 📱 최근 성찰 + 오늘 일정
│   ├── 📈 활동 통계 계산
│   └── 🗄 캐시 헤더 최적화
│
├── 📄 calendar/route.ts       # 📅 캘린더 최적화 API  
│   ├── 📆 월별 데이터 선택적 로딩
│   ├── 🎯 날짜 범위 필터링
│   ├── ⚡ 성찰 + 일정 통합 조회
│   └── 🚀 클라이언트 캐싱 지원
│
├── 📁 reflections/            # 📝 성찰 관련 API
│   ├── 📄 route.ts            # CRUD 작업 (생성, 조회, 수정, 삭제)
│   │   ├── POST: 새 성찰 저장 + AI 분석
│   │   ├── GET: 사용자 성찰 목록 조회
│   │   ├── 🤖 Gemini AI 감정 분석 통합
│   │   └── 🛡 에러 처리 및 데이터 보호
│   │
│   └── 📄 recent/route.ts     # 🔄 최근 성찰 조회 (홈화면용)
│
├── 📁 events/                 # 📅 일정 관련 API
│   ├── 📄 route.ts            # 일정 CRUD 작업
│   └── 📄 today/route.ts      # 오늘 일정 조회 (홈화면용)
│
└── 📁 profile/                # 👤 프로필 관련 API
    └── 📄 stats/route.ts      # 📊 개인 활동 통계
```

### 📱 Feature Pages

#### 📝 Reflection Pages (`app/reflection/`)
```
reflection/
├── 📄 page.tsx                # 📚 성찰 목록 페이지
│   ├── 📋 과거 성찰 일기 목록
│   ├── 🔍 검색 및 필터링
│   ├── 😊 감정별 아이콘 표시
│   └── 📱 모바일 최적화 리스트
│
└── 📁 new/                    # ✍️ 새 성찰 작성
    └── 📄 page.tsx            # 성찰 작성 페이지
        ├── 📝 제목 + 내용 입력 폼
        ├── 🤖 AI 분석 진행 상태
        ├── ⏳ 로딩 중 영감 명언 표시
        ├── 🔄 AI 실패 시 재시도 기능
        ├── 💾 성찰 데이터 보호 로직
        └── 📋 AI 추천 일정 생성 옵션
```

#### 📅 Calendar Page (`app/calendar/`)
```
📄 page.tsx                   # 📅 통합 캘린더 뷰
├── 🗓 월간 캘린더 그리드
├── 📝 성찰 기록 표시 (감정 이모지)
├── 📅 일정 아이템 표시
├── 🎯 날짜별 상세 정보
├── ⬅️➡️ 월 이동 네비게이션
├── 📱 모바일 터치 최적화
└── ⚡ 월별 데이터 lazy loading
```

#### 👤 Profile Page (`app/profile/`)
```
📄 page.tsx                   # 👤 사용자 프로필 페이지
├── 👤 사용자 정보 (이름, 이메일, 프로필 사진)
├── 📊 활동 통계 대시보드
│   ├── 📝 작성한 성찰 수
│   ├── ✅ 완료한 일정 수  
│   ├── 🔥 연속 사용일
│   └── 🎯 목표 달성률
├── ⚙️ 설정 메뉴 (준비 중)
└── 🔐 로그아웃 기능
```

#### 🔐 Login Page (`app/login/`)
```
📄 page.tsx                   # 🔐 로그인 페이지
├── 🌟 브랜드 소개
├── 🔑 Google OAuth 로그인 버튼
├── 📱 반응형 디자인
└── 🎨 그라데이션 배경
```

---

## 🧩 Components Directory

### 🎨 UI Components (`components/ui/`)
shadcn/ui 기반 재사용 가능한 기본 컴포넌트들
```
ui/
├── 📄 button.tsx              # 🔘 버튼 컴포넌트
├── 📄 card.tsx                # 📋 카드 컨테이너
├── 📄 input.tsx               # ⌨️ 입력 필드
├── 📄 textarea.tsx            # 📝 텍스트 영역
├── 📄 label.tsx               # 🏷 라벨
├── 📄 switch.tsx              # 🔄 토글 스위치
└── 📄 ...                     # 기타 UI 요소들
```

### 🎯 Feature Components (`components/`)
```
├── 📄 page-transition.tsx     # ✨ 페이지 전환 애니메이션
│   ├── 🍎 iOS 스타일 슬라이드 효과
│   ├── 👆 스와이프 제스처 뒤로가기
│   ├── 🎭 부드러운 페이지 진입/종료
│   └── 📱 네이티브 앱 느낌 구현
│
├── 📄 nav-bar.tsx             # 🧭 하단 네비게이션 바
│   ├── 🏠 홈, 📅 캘린더, 📝 성찰, 📋 일정, 👤 프로필
│   ├── 📍 현재 페이지 하이라이트
│   ├── 🎨 아이콘 + 라벨 조합
│   └── 📱 모바일 최적화 터치 영역
│
├── 📄 nav-item.tsx            # 🔗 네비게이션 개별 아이템
│   ├── 🎯 active/inactive 상태 관리
│   ├── 🎨 색상 전환 애니메이션
│   └── 📱 터치 피드백
│
├── 📄 action-card.tsx         # 🎯 액션 카드 (홈화면)
│   ├── 🎨 그라데이션 배경
│   ├── 📝 제목, 설명, 아이콘
│   ├── ➡️ 액션 버튼
│   └── 🔗 링크 래퍼
│
├── 📄 feature-card.tsx        # 🌟 기능 소개 카드
│   ├── 📖 Reflect-AI 기능 설명
│   ├── 🎨 일관된 디자인 시스템
│   └── 📱 반응형 레이아웃
│
└── 📄 theme-toggle.tsx        # 🌙 다크모드 토글
    ├── ☀️ 라이트/다크 모드 전환
    ├── 🎨 부드러운 전환 애니메이션
    └── 💾 로컬 스토리지 설정 저장
```

---

## 📚 Lib Directory (핵심 비즈니스 로직)

### 🗄 Database Layer (`lib/`)
```
├── 📄 db.ts                   # 🗄 데이터베이스 핵심 연결
│   ├── 🔌 Neon PostgreSQL 연결 설정
│   ├── 🏗 테이블 생성 함수 (reflections, events)
│   ├── 📋 TypeScript 인터페이스 정의
│   └── 🔧 SQL 쿼리 헬퍼
│
├── 📄 db-optimize.ts          # ⚡ 데이터베이스 성능 최적화
│   ├── 📈 인덱스 생성 함수
│   ├── 🚀 최적화된 쿼리 예제
│   └── 📊 성능 모니터링 유틸리티
│
└── 📄 cache.ts               # 🗂 클라이언트 사이드 캐싱
    ├── 💾 메모리 기반 SimpleCache 클래스
    ├── ⏰ TTL (Time To Live) 관리
    ├── 🔄 cachedFetch 함수
    └── 🧹 자동 캐시 정리 로직
```

### 🤖 AI Integration (`lib/`)
```
📄 gemini.ts                  # 🧠 Google Gemini AI 통합
├── 🔑 API 키 관리 및 모델 설정
├── 🎭 감정 분석 메인 함수
│   ├── analyzeEmotionAndGenerateResponse()
│   ├── 🔄 3회 자동 재시도 메커니즘
│   ├── 🛡 JSON 파싱 및 검증 강화
│   ├── 📝 프롬프트 엔지니어링
│   └── ⚠️ 구체적 에러 분류 및 처리
├── 🗓 일정 추천 함수
│   ├── generateScheduleRecommendations()
│   ├── 📊 성찰 패턴 분석
│   └── 🎯 5개 카테고리별 맞춤 추천
└── 🔄 레거시 호환성 함수들
```

### 🎨 Utilities (`lib/`)
```
├── 📄 quotes.ts               # 💭 영감을 주는 명언 데이터
│   ├── 📚 322개 엄선된 명언 컬렉션
│   ├── 🎲 getRandomQuote() 함수
│   ├── 🎯 getRandomQuotes(count) 함수
│   └── 💪 동기부여, 성찰, 성장 관련 문구
│
└── 📄 utils.ts                # 🔧 공통 유틸리티 함수
    ├── 🎨 클래스명 조합 (clsx)
    ├── 📅 날짜 포맷팅 헬퍼
    ├── 🔤 문자열 처리 함수
    └── 📱 반응형 유틸리티
```

---

## ⚙️ Configuration Files

### 📦 Package Management
```
📄 package.json               # 📋 프로젝트 설정 & 의존성
├── 🚀 Next.js 15.3.1 (최신)
├── ⚛️ React 18 (안정화)
├── 🎨 Tailwind CSS + shadcn/ui
├── ✨ Framer Motion (애니메이션)
├── 👆 React Use Gesture (제스처)
├── 🔐 NextAuth.js (인증)
├── 🗄 Neon Database (PostgreSQL)
├── 🤖 Google Generative AI
└── 📝 TypeScript 지원
```

### 🎨 Styling Configuration  
```
📄 tailwind.config.ts         # 🎨 Tailwind CSS 설정
├── 🌈 커스텀 색상 팔레트
├── 🌙 다크모드 설정 
├── 📱 반응형 브레이크포인트
├── ✨ 커스텀 애니메이션
├── 📏 간격 및 크기 체계
└── 🔤 타이포그래피 설정
```

### 🔧 Build Configuration
```
📄 next.config.ts             # ⚙️ Next.js 빌드 설정
├── 📦 번들 최적화 옵션
├── 🖼 이미지 최적화 설정
├── 🔐 환경 변수 관리
├── 🚀 성능 최적화 설정
└── 📱 PWA 준비 설정

📄 tsconfig.json              # 📝 TypeScript 컴파일러
├── 🎯 strict 모드 활성화
├── 📂 절대 경로 import 설정
├── 🔧 Next.js 최적화 옵션
└── 📋 타입 체크 규칙
```

---

## 🔄 Data Flow Architecture

### 📊 데이터 흐름 다이어그램
```
🖥 Frontend (React/Next.js)
     ↕ HTTP Requests
🔌 API Routes (/api/*)
     ↕ SQL Queries  
🗄 Database (Neon PostgreSQL)

🤖 AI Analysis Flow:
사용자 입력 → Gemini API → 감정 분석 → DB 저장 → UI 업데이트
```

### 🗂 State Management
```
📱 Client State:
├── 🔐 useSession (NextAuth)     # 사용자 인증 상태
├── 🌙 useTheme                  # 다크모드 설정
├── 📊 useState                  # 컴포넌트 로컬 상태
└── 🗂 cachedFetch               # 클라이언트 캐싱

🌐 Server State:
├── 🗄 PostgreSQL               # 영구 데이터 저장
├── 📋 HTTP Cache Headers       # 브라우저 캐싱
└── 💾 Memory Cache             # 서버 메모리 캐싱
```

---

## 🚀 성능 최적화 아키텍처

### ⚡ 3단계 캐싱 전략
```
1️⃣ Browser Cache (HTTP Headers)
   ├── 📋 Cache-Control 헤더
   ├── ⏰ 5분 브라우저 캐싱
   └── 🔄 stale-while-revalidate

2️⃣ Client Memory Cache  
   ├── 💾 JavaScript Map 기반
   ├── ⏰ 1-2분 TTL
   └── 🧹 자동 정리 로직

3️⃣ Server Cache
   ├── 📊 API 응답 캐싱
   ├── ⏰ 1분 서버 캐싱
   └── 🚀 CDN 준비
```

### 📊 Database Optimization
```
🔍 Index Strategy:
├── idx_reflections_user_created    # 사용자별 최신 성찰
├── idx_events_user_date           # 사용자별 일정 조회
└── idx_reflections_emotion        # 감정별 분석 (향후)

⚡ Query Optimization:
├── 📅 날짜 범위 필터링 (월별 로딩)
├── 🔄 병렬 쿼리 실행
├── 📋 필요한 컬럼만 SELECT
└── 🎯 LIMIT 활용한 페이지네이션
```

---

## 🔒 Security Architecture

### 🛡 Authentication Flow
```
1️⃣ Google OAuth Login
2️⃣ NextAuth Session Creation  
3️⃣ JWT Token Management
4️⃣ Server-side Session Validation
5️⃣ Protected API Routes
```

### 🔐 Data Protection
```
📧 User Identification: 이메일 기반
🔑 API Access: 세션 기반 인증
🛡 Input Validation: TypeScript + Zod
🚫 SQL Injection: Parameterized Queries
🔒 Environment Secrets: .env.local
```

---

## 📱 Mobile-First Architecture

### 📐 Responsive Design Strategy
```
📱 Mobile First (320px+)
   ├── 🏠 Single column layout
   ├── 👆 Touch-optimized buttons  
   ├── 🧭 Bottom navigation
   └── ⚡ Optimized loading

💻 Tablet & Desktop (768px+)
   ├── 📊 Multi-column layouts
   ├── 🖱 Hover interactions
   ├── ⌨️ Keyboard shortcuts
   └── 🖼 Larger content areas
```

### ✨ Animation System
```
🎭 Framer Motion:
├── 📱 Page transitions (iOS-style)
├── 👆 Gesture-based navigation
├── 🔄 Loading animations
└── 🎨 Micro-interactions

📱 Native App Feel:
├── ↔️ Swipe to go back
├── 🎯 Pull to refresh (준비 중)
├── 📳 Haptic feedback (준비 중)
└── 🌊 Smooth scrolling
```

---

## 🔮 Future Architecture Plans

### 🚀 Scalability Improvements
- [ ] 📊 Real-time analytics dashboard
- [ ] 🔄 WebSocket connections for live updates  
- [ ] 🌐 Multi-language support (i18n)
- [ ] 📱 Progressive Web App (PWA) features

### ⚡ Performance Enhancements
- [ ] 🗂 Redis caching layer
- [ ] 🌐 CDN integration
- [ ] 📦 Bundle size optimization
- [ ] 🖼 Image optimization pipeline

### 🤖 AI/ML Extensions
- [ ] 🧠 Multiple AI model support
- [ ] 📊 Advanced sentiment analysis
- [ ] 🎯 Predictive scheduling
- [ ] 📈 Behavioral pattern recognition

---

**📋 아키텍처 문서 버전**: v1.0  
**📅 마지막 업데이트**: 2025년 1월 13일  
**👨‍💻 아키텍트**: Claude AI + 사용자  
**🎯 다음 리뷰 예정**: 2025년 2월 13일