# AI Prompt Enhancement Template

## 무무노트 프로젝트 개발 요청 템플릿

### 사용법
1. 사용자 요청을 받으면 이 템플릿을 사용하여 구체화
2. 각 섹션을 프로젝트 맥락에 맞게 작성
3. 완성된 내용으로 GitHub 이슈 생성

---

## 🎯 Objective
[명확하고 구체적인 목표를 한 문장으로 작성]

**예시:**
- 사용자의 감정 트렌드와 목표 달성률을 직관적으로 시각화하는 통계 대시보드 구현
- 성찰 작성 시 감정을 직관적으로 선택할 수 있는 인터페이스 구현
- AI 응답 생성 성능을 최적화하여 사용자 대기 시간 단축

---

## 📋 Scope of Work

### ✅ 포함 사항
- [ ] [핵심 기능 1 - 구체적 설명]
- [ ] [핵심 기능 2 - 구체적 설명]
- [ ] [핵심 기능 3 - 구체적 설명]
- [ ] [테스트 및 검증]
- [ ] [문서 업데이트]

### ❌ 제외 사항
- [별도 이슈로 분리할 기능들]
- [향후 개발 예정 기능들]

---

## 🔄 Step-by-Step Plan

### 1. [설계 및 분석 단계]
- [ ] 기존 코드 분석 및 영향 범위 파악
- [ ] 데이터베이스 스키마 검토/수정
- [ ] API 인터페이스 설계

### 2. [핵심 로직 구현]
- [ ] 백엔드 API 엔드포인트 구현
- [ ] 비즈니스 로직 개발
- [ ] 데이터 유효성 검사

### 3. [프론트엔드 개발]
- [ ] 컴포넌트 구조 설계
- [ ] UI/UX 구현
- [ ] 상태 관리 통합

### 4. [통합 및 최적화]
- [ ] 프론트엔드-백엔드 통합
- [ ] 성능 최적화
- [ ] 에러 처리 개선

### 5. [품질 보증]
- [ ] 유닛 테스트 작성
- [ ] 통합 테스트 실행
- [ ] 사용자 시나리오 테스트

---

## 🎯 Quality & Constraints

### 성능 요구사항
- **페이지 로딩**: 2초 이내
- **API 응답**: 500ms 이내
- **AI 응답**: 5초 이내 (재시도 포함)
- **메모리 사용량**: [구체적 목표]

### 사용자 경험 (UX)
- **모바일 우선**: 반응형 디자인
- **터치 친화적**: 44px 최소 터치 영역
- **접근성**: ARIA 레이블, 키보드 네비게이션
- **다국어**: 자연스러운 한국어 표현

### 보안 고려사항
- **입력 검증**: 모든 사용자 입력 검증
- **인증/권한**: 적절한 접근 권한 확인
- **데이터 보호**: 민감 정보 암호화
- **환경 변수**: 보안 정보 적절한 관리

### 테스트 요구사항
- **유닛 테스트**: 핵심 로직 100% 커버리지
- **통합 테스트**: API 엔드포인트 테스트
- **E2E 테스트**: 주요 사용자 플로우
- **성능 테스트**: 부하 테스트 및 최적화

---

## 📁 Files to be Modified/Created

### 새로 생성할 파일
```
/components/[feature]/
├── [ComponentName].tsx      # 메인 컴포넌트
├── [ComponentName].test.tsx # 컴포넌트 테스트
└── types.ts                 # 타입 정의

/app/api/[endpoint]/
├── route.ts                 # API 엔드포인트
└── route.test.ts           # API 테스트

/lib/
├── [utility].ts            # 유틸리티 함수
└── [utility].test.ts       # 유틸리티 테스트
```

### 수정할 파일
```
/app/[page]/page.tsx         # 페이지 컴포넌트 수정
/lib/db.ts                   # 데이터베이스 스키마 업데이트
/lib/gemini.ts               # AI 로직 개선
/components/nav-bar.tsx      # 네비게이션 업데이트
```

---

## 🔍 무무노트 프로젝트 특화 고려사항

### 한국어 자연스러움
- **AI 응답 톤**: 친근하고 자연스러운 표현
- **UI 텍스트**: 직관적인 한국어 인터페이스
- **감정 표현**: 한국 문화에 맞는 감정 분류

### 기술 스택 활용
- **Next.js 15**: App Router 패턴 준수
- **shadcn/ui**: 일관된 디자인 시스템
- **Neon DB**: 효율적인 쿼리 작성
- **Gemini AI**: 프롬프트 최적화

### 사용자 경험 최적화
- **무무 캐릭터**: 브랜드 일관성 유지
- **감정 분석**: 정확한 감정 분류
- **목표 관리**: 단계별 진행률 표시
- **일정 추천**: 개인화된 추천 알고리즘

---

## 🏷️ GitHub 이슈 라벨

### 필수 라벨
- **타입**: `enhancement` / `bug` / `feature`
- **우선순위**: `priority: high` / `medium` / `low`

### 추가 라벨 (선택사항)
- **영역**: `ui/ux` / `backend` / `ai` / `database`
- **상태**: `in progress` / `review needed` / `testing`

---

## 📋 체크리스트

### 개발 시작 전
- [ ] 요구사항이 명확하게 정의되었는가?
- [ ] 기존 코드와의 호환성을 확인했는가?
- [ ] 필요한 환경 변수가 준비되었는가?
- [ ] 데이터베이스 스키마 변경사항을 확인했는가?

### 개발 진행 중
- [ ] 각 단계별 체크박스를 완료했는가?
- [ ] 코드 리뷰를 받았는가?
- [ ] 테스트가 통과하는가?
- [ ] 성능 목표를 달성했는가?

### 개발 완료 후
- [ ] 모든 기능이 정상 동작하는가?
- [ ] 문서가 업데이트되었는가?
- [ ] 배포가 성공했는가?
- [ ] 이슈가 자동으로 클로즈되었는가?

---

## 📝 사용 예시

### 원본 요청
```
"통계 페이지 좀 개선해줘"
```

### Enhanced 요청
```markdown
## 🎯 Objective
사용자의 감정 트렌드와 목표 달성률을 직관적으로 시각화하는 통계 대시보드 구현

## 📋 Scope of Work
### ✅ 포함 사항
- [ ] 감정 트렌드 차트 (최근 30일)
- [ ] 목표 달성률 시각화
- [ ] 성찰 작성 빈도 분석
- [ ] 모바일 반응형 차트

### ❌ 제외 사항
- 다른 사용자와의 비교 기능 (향후 개발)
- 상세 감정 분석 리포트 (별도 이슈)

## 🔄 Step-by-Step Plan
1. **통계 API 최적화** - `/app/api/stats/route.ts` 쿼리 성능 개선
2. **차트 컴포넌트 구현** - `/components/stats/emotion-trend-chart.tsx`
3. **대시보드 레이아웃** - `/app/stats/page.tsx` 반응형 그리드
4. **데이터 캐싱** - `lib/cache.ts` 통계 데이터 캐싱
5. **모바일 최적화** - 터치 친화적 차트 인터랙션

## 🎯 Quality & Constraints
- **성능**: 차트 렌더링 500ms 이내
- **UX**: 터치 제스처 지원
- **접근성**: 스크린 리더 지원
- **테스트**: 통계 계산 로직 유닛 테스트

## 📁 Files to be Modified/Created
- `/components/stats/emotion-trend-chart.tsx` - 새로 생성
- `/app/stats/page.tsx` - 수정
- `/app/api/stats/route.ts` - 쿼리 최적화
```

이 템플릿을 사용하여 모든 개발 요청을 구체화하고 체계적으로 관리하세요!