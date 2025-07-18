# 🚀 Reflect AI 개발 규칙

## 📋 기본 개발 워크플로우

### 1. 이슈 우선 생성
모든 기능 개발, 버그 수정, 개선 작업은 **반드시 GitHub 이슈부터 생성**해야 합니다.

```bash
# ❌ 잘못된 방식
git commit -m "feat: 새로운 기능 추가"

# ✅ 올바른 방식
1. GitHub에서 이슈 생성 (#123)
2. 개발 진행
3. 커밋 시 이슈 번호 참조
4. 이슈 자동 클로즈
```

### 2. 이슈 템플릿 활용
- **🚀 Feature Request**: 새로운 기능 구현
- **🐛 Bug Report**: 버그 수정
- **✨ Improvement**: 기존 기능 개선

### 3. 체크박스 기반 작업 관리
이슈 생성 시 모든 작업을 체크박스로 세분화:

```markdown
## 📝 작업 목록
### UI/UX
- [ ] 페이지 레이아웃 구성
- [ ] 컴포넌트 스타일링
- [ ] 반응형 디자인 적용

### 기능
- [ ] API 엔드포인트 구현
- [ ] 데이터 처리 로직
- [ ] 에러 핸들링

### 테스트
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 확인
```

## 🔗 커밋 & 이슈 연동

### 커밋 메시지 규칙
```bash
# 기본 형식
<type>: <description>

close #<issue-number>

# 예시
feat: 사용자 프로필 페이지 구현

- 프로필 정보 표시 기능
- 편집 모드 추가
- 아바타 업로드 기능

close #45
```

### ❌ 포트폴리오용 커밋 금지사항
- AI 도구 언급 금지: "Claude와 함께", "AI 지원" 등
- 협업 표현 제거: "Co-Authored-By" 등  
- 개발자 단독 작업으로 표현
- 순수 개인 프로젝트 커밋 히스토리 유지

### 자동 이슈 클로즈 키워드
- `close #123`
- `closes #123`
- `fix #123`
- `fixes #123`
- `resolve #123`
- `resolves #123`

## 📝 커밋 타입

| 타입 | 설명 | 예시 |
|------|------|------|
| `feat` | 새로운 기능 추가 | `feat: 통계 대시보드 구현` |
| `fix` | 버그 수정 | `fix: 로그인 에러 수정` |
| `improve` | 기능 개선 | `improve: 차트 성능 최적화` |
| `refactor` | 코드 리팩토링 | `refactor: API 호출 로직 정리` |
| `style` | 스타일 변경 | `style: 버튼 디자인 개선` |
| `docs` | 문서 수정 | `docs: README 업데이트` |
| `test` | 테스트 추가/수정 | `test: 회원가입 테스트 추가` |

## 🎯 이슈 라벨 시스템

### 우선순위
- `priority: high` - 높은 우선순위
- `priority: medium` - 중간 우선순위  
- `priority: low` - 낮은 우선순위

### 타입
- `enhancement` - 기능 추가/개선
- `bug` - 버그
- `feature` - 새로운 기능
- `improvement` - 기존 기능 개선

### 상태
- `in progress` - 진행 중
- `review needed` - 리뷰 필요
- `testing` - 테스트 중

## 🔄 Enhanced 개발 프로세스

### 1. 요구사항 분석 (NEW)
모든 개발 요청은 **AI Prompt Enhancer 시스템**을 통해 구체화합니다.

```markdown
# 기본 프로세스
1. 사용자 요청 접수
2. AI Prompt Enhancer 적용 (docs/PROMPT_ENHANCER.md 참조)
3. 구조화된 개발 계획 생성
4. GitHub 이슈 생성
```

### 2. 기존 개발 프로세스 (업데이트)
1. **요구사항 강화** → AI Prompt Enhancer 시스템 적용
2. **이슈 생성** → Enhanced 템플릿으로 GitHub 이슈 생성
3. **작업 시작** → 이슈에 코멘트로 시작 알림
4. **개발 진행** → 체크박스 하나씩 완료 표시
5. **커밋** → 이슈 번호와 함께 커밋
6. **푸시** → `close #이슈번호`로 자동 클로즈
7. **확인** → 배포 후 기능 동작 확인

### 3. Enhanced 이슈 템플릿
```markdown
## 🎯 Enhanced Request

### 원래 요청
[사용자의 원래 요청 내용]

### 🎯 Objective
[명확하고 구체적인 목표 한 문장]

### 📋 Scope of Work
#### ✅ 포함 사항
- [ ] 핵심 기능 1
- [ ] 핵심 기능 2
- [ ] 핵심 기능 3

#### ❌ 제외 사항
- 별도 이슈로 분리할 기능들

### 🔄 Step-by-Step Plan
1. **[작업 1]** - 구체적 설명
2. **[작업 2]** - 구체적 설명
3. **[작업 3]** - 구체적 설명

### 🎯 Quality & Constraints
- **성능**: 구체적 성능 목표
- **접근성**: 접근성 요구사항
- **보안**: 보안 고려사항
- **테스트**: 테스트 계획

### 📁 Files to be Modified/Created
- `/path/to/new/file.tsx` - 새로 생성
- `/path/to/existing/file.tsx` - 수정

### 🏷️ Labels
- `enhancement` / `bug` / `feature`
- `priority: high` / `medium` / `low`
```

## 🐛 버그/문제 해결 워크플로우

### 1. 문제 발견 시 → 코드 분석 우선
```bash
# ❌ 바로 dev 서버 실행하지 말고
npm run dev

# ✅ 먼저 코드 분석
1. 관련 파일 읽기
2. 타입스크립트 에러 체크: npx tsc --noEmit
3. 로직 분석
4. 원인 파악 후 이슈 생성
```

### 2. 분석 단계
- [ ] **코드 검토**: 관련 파일들 확인
- [ ] **타입 에러**: TypeScript 검사
- [ ] **API 호출**: 엔드포인트 및 인증 확인
- [ ] **데이터 흐름**: 상태 관리 및 props 확인
- [ ] **의존성**: import/export 관계 점검

### 3. 이슈 생성 기준
**간단한 분석 후 이슈 생성**:
- 원인 파악됨 → 구체적인 버그 리포트
- 원인 불명 → 조사 필요한 이슈로 생성
- 복잡한 문제 → 여러 체크박스로 세분화

### 4. dev 서버 사용 최소화
- 코드 분석으로 해결 가능한 것들 우선
- 꼭 필요한 경우에만 실행
- 빌드 에러는 `npx tsc --noEmit`로 체크

## 🤝 협업 규칙

### 개발 진행 시
1. 먼저 이슈 생성
2. 작업 진행 상황 체크박스로 관리
3. 커밋 시 이슈 번호 포함
4. 완료 후 이슈 클로즈 확인

### 예시 워크플로우
```
1. 새로운 기능 아이디어 → GitHub 이슈 생성 (#47)
2. 체크박스 기반 작업 목록 작성
3. 단계별 개발 진행
4. "feat: 매출 트렌드 차트 추가 close #47" 커밋
5. 이슈 자동 클로즈
```

## 🏷️ 라벨 및 프로젝트 관리

### 라벨 생성 및 활용
```bash
# 우선순위 라벨
gh label create "priority: high" --color "d73a4a"
gh label create "priority: medium" --color "fbca04"  
gh label create "priority: low" --color "0e8a16"

# 타입 라벨
gh label create "improvement" --color "a2eeef"
```

### 이슈 생성 시 라벨 적용
```bash
gh issue create --title "[FEAT] 새 기능" --label "enhancement,priority: high"
```

### 프로젝트 보드 활용
- GitHub Projects를 통한 칸반 보드 관리
- 이슈를 To Do → In Progress → Done 단계로 관리
- 마일스톤 설정으로 버전별 목표 관리

## 📊 품질 관리

### 커밋 전 체크리스트
- [ ] 이슈가 생성되어 있는가?
- [ ] 적절한 라벨이 설정되어 있는가?
- [ ] 모든 체크박스가 완료되었는가?
- [ ] 커밋 메시지에 이슈 번호가 포함되어 있는가?
- [ ] 타입스크립트 에러가 없는가?
- [ ] 기본 기능이 동작하는가?

### 포트폴리오 품질 기준
- 체계적인 이슈 관리로 개발 프로세스 시연
- 명확한 커밋 히스토리로 작업 추적 가능
- 라벨과 프로젝트 보드로 전문적 관리
- 문서화를 통한 개발 철학 표현

이 규칙을 통해 체계적이고 추적 가능한 개발을 진행합니다! 🎯