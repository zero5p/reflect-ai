# 🤝 Contributing to Reflect AI

Reflect AI 프로젝트에 관심을 가져주셔서 감사합니다! 이 문서는 프로젝트 기여 방법을 안내합니다.

## 📋 기여 방법

### 1. 이슈 기반 개발
모든 기여는 GitHub Issues를 통해 이루어집니다.

```bash
# 1. 이슈 생성
gh issue create --title "[FEAT] 새로운 기능" --label "enhancement"

# 2. 브랜치 생성 (선택사항)
git checkout -b feature/issue-123

# 3. 개발 진행
# 4. 커밋 시 이슈 번호 포함
git commit -m "feat: 새로운 기능 구현

close #123"
```

### 2. 이슈 템플릿 활용
다음 템플릿 중 적절한 것을 선택하여 이슈를 생성해주세요:
- 🚀 **Feature Request**: 새로운 기능 구현
- 🐛 **Bug Report**: 버그 신고 및 수정
- ✨ **Improvement**: 기존 기능 개선

### 3. 코드 스타일
- **TypeScript**: 타입 안전성 유지
- **ESLint**: 코드 스타일 가이드 준수
- **Prettier**: 코드 포맷팅 자동화

```bash
# 코드 검사
npm run lint
npx tsc --noEmit
```

## 🔧 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- npm 또는 yarn
- PostgreSQL (개발용)

### 설치 과정
```bash
# 1. 저장소 클론
git clone https://github.com/zero5p/reflect-ai.git
cd reflect-ai

# 2. 의존성 설치
npm install

# 3. 환경변수 설정
cp .env.example .env.local
# .env.local 파일을 수정하여 필요한 환경변수 설정

# 4. 개발 서버 실행
npm run dev
```

### 환경변수 설정
```bash
# .env.local
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GEMINI_API_KEY="your-gemini-api-key"
```

## 📝 커밋 규칙

### 커밋 메시지 형식
```
<type>: <description>

[optional body]

close #<issue-number>
```

### 커밋 타입
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `improve`: 기능 개선
- `refactor`: 코드 리팩토링
- `style`: 스타일 변경
- `docs`: 문서 수정
- `test`: 테스트 추가/수정

### 예시
```bash
feat: 사용자 대시보드 구현

- 감정 트렌드 차트 추가
- 목표 달성률 표시
- 반응형 디자인 적용

close #45
```

## 🏷️ 라벨 시스템

### 우선순위
- `priority: high` - 높은 우선순위
- `priority: medium` - 중간 우선순위
- `priority: low` - 낮은 우선순위

### 타입
- `enhancement` - 기능 추가
- `bug` - 버그
- `improvement` - 기능 개선
- `documentation` - 문서화

### 상태
- `in progress` - 진행 중
- `review needed` - 리뷰 필요
- `testing` - 테스트 중

## 🧪 테스트 가이드

### 테스트 실행
```bash
# 타입 검사
npx tsc --noEmit

# 린트 검사
npm run lint

# 빌드 테스트
npm run build
```

### 테스트 커버리지
- API 엔드포인트 기능 테스트
- UI 컴포넌트 동작 확인
- 에러 케이스 처리 검증
- 모바일 반응형 확인

## 📊 프로젝트 구조

```
reflect-ai/
├── app/                    # Next.js App Router
│   ├── api/               # API 경로
│   ├── (pages)/           # 페이지 컴포넌트
│   └── globals.css        # 전역 스타일
├── components/            # 재사용 컴포넌트
│   ├── ui/               # UI 컴포넌트
│   └── ...
├── lib/                  # 유틸리티 함수
├── hooks/                # 커스텀 훅
├── .github/              # GitHub 템플릿
├── docs/                 # 문서
└── public/               # 정적 파일
```

## 🎯 기여 가이드라인

### 좋은 기여란?
1. **명확한 목적**: 이슈와 연결된 구체적인 개선
2. **작은 단위**: 하나의 기능/수정에 집중
3. **문서화**: 코드 변경 시 관련 문서 업데이트
4. **테스트**: 변경사항에 대한 적절한 테스트

### 피해야 할 것들
1. **대규모 리팩토링**: 기능 변경과 함께 하지 말 것
2. **무관한 변경**: 이슈와 관련 없는 수정 포함
3. **스타일만 변경**: 기능적 개선 없는 스타일 변경
4. **미완성 기능**: 부분적으로만 동작하는 기능

## 🔍 코드 리뷰

### 셀프 체크리스트
- [ ] TypeScript 에러 없음
- [ ] ESLint 경고 해결
- [ ] 불필요한 console.log 제거
- [ ] 적절한 주석 추가
- [ ] API 문서 업데이트 (해당하는 경우)

### 리뷰 기준
1. **기능성**: 요구사항 충족 여부
2. **안정성**: 에러 처리 및 예외 상황 고려
3. **성능**: 불필요한 렌더링이나 API 호출 없음
4. **가독성**: 명확하고 이해하기 쉬운 코드
5. **일관성**: 프로젝트 스타일 가이드 준수

## 📞 소통 채널

### 질문이나 제안이 있다면
1. **GitHub Issues**: 버그 리포트, 기능 요청
2. **GitHub Discussions**: 일반적인 질문, 아이디어 토론
3. **Email**: [contact@reflectai.dev](mailto:contact@reflectai.dev)

## 🎉 기여자 인정

모든 기여자는 다음과 같이 인정받습니다:
- README.md의 Contributors 섹션에 추가
- 릴리즈 노트에 기여 내용 언급
- 프로젝트 성공에 대한 공동 소유권

## 📄 라이선스

이 프로젝트에 기여함으로써, 당신의 기여가 프로젝트와 동일한 라이선스 하에 있음에 동의합니다.

---

**감사합니다!** 🙏

당신의 기여가 Reflect AI를 더 나은 플랫폼으로 만들어갑니다. 모든 기여를 환영하며, 함께 성장하는 개발 문화를 만들어나가요!