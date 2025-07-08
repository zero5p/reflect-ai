# 🚀 Flutter Web 빠른 시작 가이드

## 1️⃣ 즉시 해야 할 작업 (오늘)

### ✅ 환경 확인
```bash
# Flutter 설치 확인
flutter doctor

# Web 지원 활성화
flutter config --enable-web

# 사용 가능한 디바이스 확인
flutter devices
```

### ✅ 프로젝트 생성
```bash
# 현재 디렉토리에서
cd /mnt/c/users/denny/reflect-ai

# Flutter 프로젝트 생성
flutter create flutter_app
cd flutter_app

# Web에서 실행 테스트
flutter run -d chrome
```

### ✅ 기본 폴더 구조 생성
```bash
mkdir -p lib/{models,services,providers,screens,widgets,utils,config}
mkdir -p lib/screens/{home,goals,reflection,profile}
mkdir -p lib/widgets/{common,custom}
```

## 2️⃣ 첫 번째 주 계획

### Day 1: 프로젝트 설정
- [ ] Flutter 프로젝트 생성
- [ ] pubspec.yaml 의존성 추가
- [ ] 기본 테마 설정
- [ ] Git 초기 커밋

### Day 2-3: 디자인 시스템
- [ ] 무무 컬러 팔레트 적용
- [ ] 기본 위젯 컴포넌트 생성
- [ ] 네비게이션 바 구현

### Day 4-5: 인증 시스템
- [ ] API 서비스 클래스 생성
- [ ] Google OAuth 연동
- [ ] 로그인/로그아웃 플로우

### Day 6-7: 홈 화면 기본 구조
- [ ] 홈 화면 레이아웃
- [ ] 통계 카드 위젯
- [ ] 기본 데이터 연동

## 3️⃣ 필수 파일 템플릿

### pubspec.yaml
```yaml
name: mumu_note
description: AI 기반 성찰 및 목표 관리 앱

version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  
  # HTTP 및 API
  http: ^1.1.0
  dio: ^5.3.2
  
  # 상태 관리
  provider: ^6.1.1
  
  # 로컬 저장소
  shared_preferences: ^2.2.2
  
  # UI 관련
  google_fonts: ^6.1.0
  flutter_svg: ^2.0.9
  
  # 유틸리티
  intl: ^0.19.0
  url_launcher: ^6.2.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  
  assets:
    - assets/images/
    - assets/icons/
```

### lib/main.dart
```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';

import 'providers/auth_provider.dart';
import 'screens/home/home_screen.dart';
import 'screens/auth/login_screen.dart';
import 'utils/theme.dart';

void main() {
  runApp(const MumuNoteApp());
}

class MumuNoteApp extends StatelessWidget {
  const MumuNoteApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: MaterialApp(
        title: '무무노트',
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        home: const AuthWrapper(),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}

class AuthWrapper extends StatelessWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, auth, _) {
        if (auth.isLoading) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }
        
        return auth.isAuthenticated 
          ? const HomeScreen() 
          : const LoginScreen();
      },
    );
  }
}
```

### lib/utils/theme.dart
```dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // 무무 브랜드 컬러
  static const Color mumuBrown = Color(0xFF8B4513);
  static const Color mumuBrownDark = Color(0xFF654321);
  static const Color mumuCream = Color(0xFFFDF6E3);
  static const Color mumuAccent = Color(0xFFDEB887);

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: mumuBrown,
        brightness: Brightness.light,
      ),
      textTheme: GoogleFonts.notoSansKrTextTheme(),
      appBarTheme: const AppBarTheme(
        backgroundColor: mumuCream,
        foregroundColor: mumuBrownDark,
        elevation: 0,
      ),
      cardTheme: CardTheme(
        color: mumuCream.withOpacity(0.8),
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: mumuBrown,
        brightness: Brightness.dark,
      ),
      textTheme: GoogleFonts.notoSansKrTextTheme(
        ThemeData.dark().textTheme,
      ),
    );
  }
}
```

## 4️⃣ Vercel 배포 설정

### vercel.json
```json
{
  "buildCommand": "cd flutter_app && flutter build web",
  "outputDirectory": "flutter_app/build/web",
  "framework": null,
  "installCommand": "flutter pub get",
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 5️⃣ 다음 단계

1. **오늘**: Flutter 프로젝트 생성 및 기본 설정
2. **내일**: 첫 번째 화면 만들어보기
3. **이번 주**: 인증 + 홈 화면 완성

---

**시작할 준비되셨나요?** 🚀

첫 번째로 Flutter 환경 확인부터 해보시죠!