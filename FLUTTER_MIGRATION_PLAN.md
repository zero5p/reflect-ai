# 🚀 무무노트 Flutter Web 전환 계획

## 📋 전환 개요

### 현재 상태
- **프론트엔드**: NextJS (React)
- **백엔드**: NextJS API Routes
- **데이터베이스**: PostgreSQL (Vercel Postgres)
- **인증**: NextAuth.js (Google OAuth)
- **배포**: Vercel

### 목표 상태
- **프론트엔드**: Flutter Web
- **백엔드**: NextJS API Routes (유지)
- **데이터베이스**: PostgreSQL (유지)
- **인증**: Flutter + API 연동
- **배포**: Vercel (Flutter Web + NextJS API)

## 🎯 단계별 전환 계획

### Phase 1: 환경 설정 및 기본 구조 (1-2일)

#### 1.1 Flutter 프로젝트 초기 설정
- [ ] Flutter SDK 설치 확인
- [ ] Flutter Web 활성화 (`flutter config --enable-web`)
- [ ] 새 Flutter 프로젝트 생성
- [ ] 프로젝트 구조 설정
- [ ] Vercel 배포 설정

#### 1.2 필수 패키지 설치
```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0              # API 호출
  shared_preferences: ^2.2.2 # 로컬 저장소
  provider: ^6.1.1          # 상태 관리
  google_fonts: ^6.1.0      # 폰트
  flutter_svg: ^2.0.9       # SVG 지원
  url_launcher: ^6.2.1      # 링크 열기
  intl: ^0.19.0             # 날짜/시간 포맷
```

#### 1.3 프로젝트 구조 설정
```
lib/
├── main.dart
├── models/              # 데이터 모델
│   ├── user.dart
│   ├── goal.dart
│   ├── reflection.dart
│   └── daily_task.dart
├── services/            # API 서비스
│   ├── api_service.dart
│   ├── auth_service.dart
│   └── storage_service.dart
├── providers/           # 상태 관리
│   ├── auth_provider.dart
│   ├── goal_provider.dart
│   └── task_provider.dart
├── screens/             # 화면
│   ├── home/
│   ├── goals/
│   ├── reflection/
│   └── profile/
├── widgets/             # 재사용 위젯
│   ├── common/
│   └── custom/
├── utils/               # 유틸리티
│   ├── constants.dart
│   ├── theme.dart
│   └── helpers.dart
└── config/              # 설정
    └── app_config.dart
```

### Phase 2: 디자인 시스템 및 기본 위젯 (2-3일)

#### 2.1 테마 및 컬러 시스템
- [ ] 무무 브랜드 컬러 정의
- [ ] Material 3 테마 커스터마이징
- [ ] 다크모드 지원
- [ ] 반응형 디자인 기준 설정

#### 2.2 공통 위젯 개발
- [ ] CustomButton
- [ ] CustomCard
- [ ] CustomTextField
- [ ] LoadingWidget
- [ ] EmptyStateWidget
- [ ] NavigationBar

#### 2.3 아이콘 및 에셋
- [ ] 무무 마스코트 SVG 변환
- [ ] 아이콘 세트 정리
- [ ] 이미지 에셋 최적화

### Phase 3: 인증 시스템 구현 (2-3일)

#### 3.1 API 연동 서비스
- [ ] HTTP 클라이언트 설정
- [ ] API 베이스 URL 설정
- [ ] 토큰 관리 시스템
- [ ] 에러 핸들링

#### 3.2 Google OAuth 구현
- [ ] 구글 로그인 패키지 연동
- [ ] 토큰 저장/관리
- [ ] 자동 로그인 구현
- [ ] 로그아웃 처리

#### 3.3 인증 상태 관리
- [ ] AuthProvider 구현
- [ ] 로그인 상태 전역 관리
- [ ] 보호된 라우트 처리

### Phase 4: 핵심 화면 구현 (4-5일)

#### 4.1 홈 화면
- [ ] 통계 카드 구현
- [ ] 일일 할일 체크리스트
- [ ] 캘린더 위젯
- [ ] 최근 성찰 리스트
- [ ] 진행 중인 목표

#### 4.2 목표 관리 화면
- [ ] 목표 리스트 뷰
- [ ] 목표 생성 폼
- [ ] 목표별 할일 관리
- [ ] 진행률 표시
- [ ] AI 목표 분해 연동

#### 4.3 성찰 화면
- [ ] 성찰 작성 폼
- [ ] 감정 선택 위젯
- [ ] 성찰 리스트
- [ ] 성찰 상세보기

#### 4.4 프로필 화면
- [ ] 사용자 정보 표시
- [ ] 설정 메뉴
- [ ] 통계 요약
- [ ] 로그아웃

### Phase 5: 고급 기능 구현 (3-4일)

#### 5.1 상태 관리 고도화
- [ ] Provider 패턴 적용
- [ ] 상태 지속성 구현
- [ ] 오프라인 지원

#### 5.2 성능 최적화
- [ ] 이미지 최적화
- [ ] 번들 크기 최적화
- [ ] 지연 로딩 구현

#### 5.3 PWA 기능
- [ ] 서비스 워커 설정
- [ ] 앱 설치 배너
- [ ] 오프라인 페이지

### Phase 6: 테스트 및 배포 (2-3일)

#### 6.1 테스트
- [ ] 단위 테스트 작성
- [ ] 위젯 테스트
- [ ] 크로스 브라우저 테스트
- [ ] 모바일 반응형 테스트

#### 6.2 Vercel 배포
- [ ] 빌드 설정 최적화
- [ ] 환경변수 설정
- [ ] 도메인 연결
- [ ] 성능 모니터링 설정

## 🔄 API 연동 계획

### 기존 API 유지
현재 NextJS API Routes를 그대로 사용:
- `POST /api/auth/callback/google` - 구글 로그인
- `GET /api/goals` - 목표 조회
- `POST /api/goals` - 목표 생성
- `GET /api/daily-tasks` - 일일 할일 조회
- `PATCH /api/daily-tasks` - 할일 상태 업데이트
- `GET /api/stats` - 통계 데이터
- `GET /api/reflections` - 성찰 조회
- `POST /api/reflections` - 성찰 작성

### Flutter HTTP 클라이언트
```dart
class ApiService {
  static const String baseUrl = 'https://your-domain.vercel.app';
  
  static Future<Map<String, dynamic>> get(String endpoint) async {
    // HTTP GET 구현
  }
  
  static Future<Map<String, dynamic>> post(String endpoint, Map<String, dynamic> data) async {
    // HTTP POST 구현
  }
}
```

## 📱 반응형 디자인 전략

### 브레이크포인트
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### 레이아웃 적응
- Mobile: 단일 컬럼, 하단 네비게이션
- Tablet: 2컬럼 레이아웃
- Desktop: 사이드바 네비게이션

## ⚡ 성능 최적화 계획

### 번들 크기 최적화
- Tree shaking 활용
- 불필요한 패키지 제거
- 이미지 최적화 (WebP 사용)

### 로딩 성능
- 지연 로딩 구현
- 캐싱 전략 수립
- API 응답 최적화

## 🔧 개발 도구 설정

### VS Code 확장
- Flutter
- Dart
- Flutter Widget Snippets
- Awesome Flutter Snippets

### 디버깅 도구
- Flutter Inspector
- DevTools
- 브라우저 개발자 도구

## 📅 예상 일정

| Phase | 기간 | 주요 작업 |
|-------|------|-----------|
| Phase 1 | 1-2일 | 환경 설정, 프로젝트 구조 |
| Phase 2 | 2-3일 | 디자인 시스템, 기본 위젯 |
| Phase 3 | 2-3일 | 인증 시스템 |
| Phase 4 | 4-5일 | 핵심 화면 구현 |
| Phase 5 | 3-4일 | 고급 기능 |
| Phase 6 | 2-3일 | 테스트 및 배포 |
| **총 기간** | **14-20일** | **완전 전환** |

## 🎯 마일스톤

### Week 1: 기반 구축
- ✅ Flutter 환경 설정
- ✅ 기본 UI 컴포넌트
- ✅ 인증 시스템

### Week 2: 핵심 기능
- ✅ 홈 화면 완성
- ✅ 목표 관리 완성
- ✅ 성찰 기능 완성

### Week 3: 마무리
- ✅ 성능 최적화
- ✅ 테스트 완료
- ✅ 배포 완료

---

**다음 단계**: Phase 1부터 시작하여 단계별로 진행하겠습니다! 🚀