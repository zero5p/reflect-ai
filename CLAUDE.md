# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**무무노트 (Reflect AI)** is a Korean AI-powered reflection and scheduling app. Users write reflections/journal entries, and the AI analyzes emotions to provide personalized schedule recommendations. The app includes features like goal tracking, calendar integration, and spaced repetition reminders.

## Tech Stack & Architecture

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Vercel Serverless Functions
- **Database**: Neon PostgreSQL
- **AI**: Google Gemini API
- **Authentication**: NextAuth.js with Google OAuth
- **Deployment**: Vercel

## Common Development Commands

```bash
# Development
npm run dev          # Start development server on localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type checking
npx tsc --noEmit     # Check TypeScript errors without emitting files
```

## Key Directories & Files

### Application Structure
- `app/` - Next.js 15 App Router pages and API routes
- `components/` - Reusable React components including shadcn/ui components
- `lib/` - Core utilities and configurations
- `hooks/` - Custom React hooks
- `public/` - Static assets

### Database Layer
- `lib/db.ts` - Neon PostgreSQL connection and table schemas
- `*.sql` files in root - Database migration scripts

### AI Integration
- `lib/gemini.ts` - Google Gemini API integration with retry logic and persona-based responses
- `app/api/ai/` - AI-related API endpoints

### Authentication
- `app/api/auth/` - NextAuth.js configuration
- `app/api/auth/authOptions.ts` - Main auth configuration

## Database Schema

Main tables:
- `reflections` - User journal entries with emotion analysis
- `events` - Calendar events and AI recommendations
- `goals` - User goals with breakdown phases
- `daily_tasks` - Task tracking with streak counters
- `goal_progress` - Individual goal progress tracking

## AI System Architecture

The AI system uses Google Gemini with different personas:
- **coach**: Direct, goal-focused advice
- **friend**: Warm, empathetic responses
- **mentor**: System-focused, "just do it" philosophy
- **balanced**: Situational balance of empathy and advice

AI responses are structured JSON with emotion classification and Korean natural language responses.

## Key Features

1. **Reflection System**: Users write journal entries, AI analyzes emotions and provides personalized responses
2. **Goal Tracking**: Multi-phase goal breakdown with daily task generation
3. **Calendar Integration**: Custom calendar with AI-recommended events
4. **Statistics Dashboard**: Emotion trends and goal progress visualization
5. **Just-Do-It Mode**: Simplified task completion interface

## Important Development Notes

- All user-facing text is in Korean
- Use `@/` path aliases for imports
- Database uses user email as primary identifier
- AI responses include retry logic for reliability
- Mobile-first responsive design with theme support

## API Endpoints Structure

```
/api/
├── auth/           # Authentication (NextAuth.js)
├── ai/             # AI analysis and recommendations
├── reflections/    # Journal entries CRUD
├── goals/          # Goal management
├── events/         # Calendar events
├── daily-tasks/    # Task management
└── stats/          # Analytics and statistics
```

## Environment Variables Required

```
DATABASE_URL=           # Neon PostgreSQL connection
GEMINI_API_KEY=        # Google Gemini API key
GOOGLE_CLIENT_ID=      # Google OAuth client ID
GOOGLE_CLIENT_SECRET=  # Google OAuth client secret
NEXTAUTH_URL=          # App URL for NextAuth
NEXTAUTH_SECRET=       # NextAuth secret key
```

## Enhanced Development Workflow

### AI Prompt Enhancement System
All development requests must go through the **AI Prompt Enhancer** system for optimal results:

1. **Requirement Analysis**: Use `docs/PROMPT_ENHANCER.md` to transform vague requests into structured plans
2. **Enhanced Issue Creation**: Apply `docs/PROMPT_TEMPLATE.md` for comprehensive GitHub issues
3. **Quality-First Development**: Include testing, performance, and accessibility from the start

### Development Process (from RULE.md)
1. **Enhance Request** → Apply AI Prompt Enhancer system
2. **Create Enhanced Issue** → Use structured template with objectives, scope, and constraints
3. **Checkbox Management** → Track progress with detailed task breakdowns
4. **Korean Commits** → Follow format: `feat: 기능 설명 close #123`
5. **Auto-close Issues** → Use proper keywords for issue linking
6. **Portfolio Standards** → No AI collaboration mentions in commit history

### Enhanced Issue Template Structure
```markdown
## 🎯 Objective
[Clear, specific goal in one sentence]

## 📋 Scope of Work
✅ Included / ❌ Excluded items

## 🔄 Step-by-Step Plan
1. Analysis & Design
2. Implementation
3. Testing & Quality Assurance

## 🎯 Quality & Constraints
- Performance targets
- Accessibility requirements
- Security considerations
- Korean language optimization

## 📁 Files to be Modified/Created
- Specific file paths and purposes
```

## Testing & Quality

- TypeScript strict mode enabled
- ESLint configured for Next.js
- Run `npx tsc --noEmit` before committing
- Database migrations handled through SQL files
- Error handling includes retry logic for AI API calls

## Korean Language Considerations

- All UI text and AI responses in Korean
- Natural Korean speech patterns in AI responses
- Use informal but respectful tone ("~네요", "~군요")
- Avoid formal/clinical language in AI responses

## AI Prompt Enhancement Guidelines

### When to Use Enhanced Prompts
- **Simple Questions**: Minimal enhancement needed
- **Small Tasks**: Targeted enhancement with risk analysis
- **Major Features**: Comprehensive multi-phase enhancement

### Enhancement Principles for 무무노트
1. **Korean-First Design**: Always consider natural Korean UX patterns
2. **Emotion-Aware Development**: Account for emotional data sensitivity  
3. **Mobile-First Implementation**: Prioritize touch-friendly interfaces
4. **AI Integration**: Optimize for Gemini API performance and retry logic
5. **Goal-Oriented UX**: Align features with user growth objectives

### Project-Specific Enhancement Rules
- **Database Queries**: Always consider Neon PostgreSQL performance
- **AI Responses**: Include persona consistency and retry mechanisms
- **Authentication**: Ensure NextAuth.js security patterns
- **Responsive Design**: Mobile-first with 44px minimum touch targets
- **Performance**: 2s page load, 500ms API response targets
- **Testing**: Include Korean language edge cases

### File Organization for Enhanced Features
```
/components/[feature-name]/
├── [FeatureName].tsx           # Main component
├── [FeatureName].test.tsx      # Component tests
├── types.ts                    # Feature-specific types
└── hooks/                      # Feature-specific hooks

/app/api/[feature-name]/
├── route.ts                    # API endpoints
├── route.test.ts              # API tests
└── validation.ts              # Input validation
```

Use `docs/PROMPT_ENHANCER.md` and `docs/PROMPT_TEMPLATE.md` for all development planning.