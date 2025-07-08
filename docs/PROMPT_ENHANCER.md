# AI Prompt Enhancer System

## 무무노트 프로젝트 전용 프롬프트 강화 시스템

### 1. 시스템 개요
모호하고 단순한 개발 요청을 구체적이고 실행 가능한 고품질 개발 계획으로 변환하는 AI 보조 시스템입니다.

### 2. 무무노트 프로젝트 특화 Enhancement Rules

#### 한국어 고려사항
- AI 응답 톤앤매너: 자연스럽고 친근한 한국어 표현
- 사용자 인터페이스: 직관적인 한국어 UI/UX
- 감정 표현: 한국 문화에 맞는 감정 분류 및 표현

#### 기술 스택 최적화
- **Next.js 15**: App Router 패턴 준수
- **TypeScript**: 엄격한 타입 안전성
- **Neon PostgreSQL**: 쿼리 성능 최적화
- **Google Gemini AI**: 프롬프트 최적화 및 재시도 로직
- **NextAuth.js**: 보안 인증 패턴

#### 데이터베이스 설계
- 이메일 기반 사용자 식별
- 감정 분석 데이터 구조
- 목표 및 진행률 추적
- 일정 추천 시스템

### 3. Enhancement Process Template

```markdown
# 개발 요청 분석 템플릿

## 🎯 Objective
[명확하고 구체적인 목표 한 문장]

## 📋 Scope of Work
### ✅ 포함 사항
- [ ] 핵심 기능 1
- [ ] 핵심 기능 2
- [ ] 핵심 기능 3

### ❌ 제외 사항
- 별도 이슈로 분리할 기능들
- 향후 개발 예정 사항

## 🔄 Step-by-Step Plan
1. **[컴포넌트/API 설계]** - 구체적 파일 경로와 함께
2. **[데이터베이스 스키마]** - 필요시 테이블 수정/추가
3. **[비즈니스 로직 구현]** - 핵심 기능 구현
4. **[UI/UX 통합]** - 사용자 인터페이스 구현
5. **[테스트 및 검증]** - 품질 확보

## 🎯 Quality & Constraints
### 성능 요구사항
- 페이지 로딩: 2초 이내
- API 응답: 500ms 이내
- AI 응답: 5초 이내 (재시도 포함)

### 사용자 경험
- 모바일 우선 반응형 디자인
- 44px 최소 터치 영역
- 접근성: ARIA 레이블, 키보드 네비게이션

### 보안 고려사항
- 입력 데이터 검증
- 인증/권한 확인
- 환경 변수 보안

### 테스트 요구사항
- 유닛 테스트: 핵심 로직
- 통합 테스트: API 엔드포인트
- E2E 테스트: 사용자 플로우

## 📁 Files to be Modified/Created
### 새로 생성할 파일
- `/components/...` - 컴포넌트 파일
- `/app/api/...` - API 엔드포인트
- `/lib/...` - 유틸리티 함수

### 수정할 파일
- `existing-file.tsx` - 수정 내용 설명
- `lib/db.ts` - 데이터베이스 스키마 업데이트

## 🔍 Korean Language Considerations
- 자연스러운 한국어 표현 패턴
- 감정 분석 정확도 고려
- 문화적 맥락 반영

## 🎨 Design System Integration
- shadcn/ui 컴포넌트 활용
- 무무노트 브랜딩 일관성
- 다크/라이트 테마 지원
```

### 4. 실제 적용 예시

#### Before (기존 요청)
```
"통계 페이지 개선해줘"
```

#### After (Enhanced 요청)
```markdown
# 🎯 Objective
사용자의 감정 트렌드와 목표 달성률을 직관적으로 시각화하는 통계 대시보드 구현

# 📋 Scope of Work
## ✅ 포함 사항
- [ ] 감정 트렌드 차트 (최근 30일)
- [ ] 목표 달성률 시각화
- [ ] 성찰 작성 빈도 분석
- [ ] 모바일 반응형 차트

## ❌ 제외 사항
- 다른 사용자와의 비교 기능 (향후 개발)
- 상세 감정 분석 리포트 (별도 이슈)

# 🔄 Step-by-Step Plan
1. **통계 API 최적화** - `/app/api/stats/route.ts` 쿼리 성능 개선
2. **차트 컴포넌트 구현** - `/components/stats/emotion-trend-chart.tsx`
3. **대시보드 레이아웃** - `/app/stats/page.tsx` 반응형 그리드
4. **데이터 캐싱** - `lib/cache.ts` 통계 데이터 캐싱
5. **모바일 최적화** - 터치 친화적 차트 인터랙션

# 🎯 Quality & Constraints
## 성능 요구사항
- 차트 렌더링: 500ms 이내
- 데이터 로딩: 1초 이내
- 메모리 사용량: 50MB 이하

## 사용자 경험
- 차트 애니메이션: 부드러운 전환
- 터치 제스처: 확대/축소 지원
- 접근성: 스크린 리더 지원

# 📁 Files to be Modified/Created
## 새로 생성할 파일
- `/components/stats/emotion-trend-chart.tsx`
- `/components/stats/goal-progress-chart.tsx`
- `/components/stats/stats-summary-cards.tsx`

## 수정할 파일
- `/app/stats/page.tsx` - 새로운 차트 컴포넌트 통합
- `/app/api/stats/route.ts` - 쿼리 최적화
- `/lib/db.ts` - 통계 쿼리 함수 추가
```

### 5. 품질 체크리스트

#### 개발 전 확인사항
- [ ] 요구사항이 구체적으로 정의되었는가?
- [ ] 기존 코드 패턴과 일치하는가?
- [ ] 성능 목표가 명확한가?
- [ ] 테스트 계획이 포함되었는가?

#### 개발 후 확인사항
- [ ] 모든 체크박스가 완료되었는가?
- [ ] 타입 에러가 없는가? (`npx tsc --noEmit`)
- [ ] 린트 규칙을 준수하는가? (`npm run lint`)
- [ ] 모바일에서 정상 동작하는가?

### 6. 이슈 템플릿 연동

GitHub 이슈 생성 시 다음 템플릿 사용:

```markdown
## 🎯 Enhanced Request

### Original Request
[사용자의 원래 요청]

### Enhanced Plan
[위의 Enhancement Process Template 적용 결과]

### 📋 체크박스 작업 목록
- [ ] 작업 1
- [ ] 작업 2
- [ ] 작업 3
- [ ] 테스트 완료
- [ ] 문서 업데이트

### 🏷️ 라벨
- `enhancement` / `bug` / `feature`
- `priority: high` / `priority: medium` / `priority: low`
```

이 시스템을 통해 무무노트 프로젝트의 개발 품질과 효율성을 크게 향상시킬 수 있습니다.