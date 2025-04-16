# 리플렉트 AI (Reflect AI)

성찰 데이터를 AI로 분석하여 최적화된 일정을 추천하는, 자기 성장에 초점을 맞춘 앱입니다.

## 프로젝트 개요

리플렉트 AI는 사용자의 성찰 일기와 감정 기록을 바탕으로 AI가 개인화된 일정을 추천해주는 애플리케이션입니다. 간격 반복 알림을 통해 중요한 깨달음을 잊지 않도록 도와줍니다.

### 핵심 기능

- 일기/성찰 기록 및 감정 추적
- 성찰 데이터 기반 AI 일정 최적화
- 자체 캘린더 시스템
- 간격 반복 알림으로 복습 유도

## 기술 스택

- **프론트엔드**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **백엔드**: Vercel Serverless Functions
- **데이터베이스**: Vercel Postgres (예정)
- **AI**: Google Gemini API
- **배포**: Vercel
- **버전 관리**: GitHub

## 시작하기

```bash
# 프로젝트 클론
git clone https://github.com/yourusername/reflect-ai.git
cd reflect-ai

# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 앱을 확인할 수 있습니다.

## 프로젝트 구조

```
reflect-ai/
  ├── app/
  │   ├── api/              # API 라우트
  │   ├── calendar/         # 캘린더 페이지
  │   ├── reflection/       # 성찰 페이지
  │   ├── schedule/         # 일정 추천 페이지
  │   ├── components/       # 공통 컴포넌트
  │   ├── types/            # 타입 정의
  │   ├── layout.tsx        # 앱 기본 레이아웃
  │   └── page.tsx          # 메인 페이지
  ├── public/               # 정적 파일
  ├── package.json
  ├── tsconfig.json
  ├── next.config.js
  └── tailwind.config.js
```

## 기여하기

1. 이 저장소를 포크합니다.
2. 새 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`).
3. 변경 사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`).
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`).
5. Pull Request를 생성합니다.

## 라이선스

MIT License