import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/authOptions"
import { sql } from "@/lib/db"
import { geminiModel } from "@/lib/gemini"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userEmail = session.user.email

    // 의지력 고갈 상태 분석
    const burnoutAnalysis = await analyzeBurnoutPattern(userEmail)
    
    // 사용자 맥락 정보 수집 (목표, 최근 성찰)
    const userContext = await getUserContext(userEmail)
    
    // 맥락 기반 마이크로 액션 생성
    const microActions = await generateMicroActions(burnoutAnalysis, userContext)

    return NextResponse.json({
      success: true,
      data: {
        burnoutLevel: burnoutAnalysis.level,
        reason: burnoutAnalysis.reason,
        microActions: microActions
      }
    })

  } catch (error) {
    console.error("그냥 하기 모드 실패:", error)
    return NextResponse.json({
      success: false,
      error: "마이크로 액션 생성 중 오류가 발생했습니다"
    }, { status: 500 })
  }
}

async function analyzeBurnoutPattern(userEmail: string): Promise<{
  level: 'low' | 'medium' | 'high'
  reason: string
  patterns: string[]
}> {
  try {
    // 최근 성찰 기록 확인
    const recentReflections = await sql`
      SELECT created_at, title, content, emotion 
      FROM reflections 
      WHERE user_email = ${userEmail}
      ORDER BY created_at DESC 
      LIMIT 10
    `

    const now = new Date()
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    let burnoutLevel: 'low' | 'medium' | 'high' = 'low'
    let reason = ''
    let patterns: string[] = []

    // 패턴 1: 성찰 중단 분석
    const recentCount = recentReflections.filter(r => 
      new Date(r.created_at) > threeDaysAgo
    ).length

    if (recentCount === 0) {
      const weekCount = recentReflections.filter(r => 
        new Date(r.created_at) > weekAgo
      ).length
      
      if (weekCount === 0) {
        burnoutLevel = 'high'
        reason = '일주일 이상 성찰을 작성하지 않으셨네요'
        patterns.push('성찰 중단')
      } else if (weekCount < 2) {
        burnoutLevel = 'medium'
        reason = '최근 며칠간 성찰이 줄어들었어요'
        patterns.push('성찰 감소')
      }
    }

    // 패턴 2: 감정 상태 분석
    const recentEmotions = recentReflections.slice(0, 3).map(r => r.emotion)
    const negativeEmotions = recentEmotions.filter(e => 
      ['sad', 'angry', 'anxious', 'complex'].includes(e)
    )

    if (negativeEmotions.length >= 2) {
      burnoutLevel = burnoutLevel === 'high' ? 'high' : 'medium'
      if (!reason) reason = '최근 감정 상태가 힘들어 보여요'
      patterns.push('부정적 감정 반복')
    }

    // 패턴 3: 키워드 분석 (부정적 단어 반복)
    const recentContent = recentReflections.slice(0, 5).map(r => r.content || '').join(' ')
    const burnoutKeywords = ['힘들', '포기', '싫', '짜증', '지쳐', '못하겠', '그만']
    const keywordMatches = burnoutKeywords.filter(keyword => 
      recentContent.includes(keyword)
    ).length

    if (keywordMatches >= 2) {
      patterns.push('부정적 키워드 반복')
      if (burnoutLevel === 'low') {
        burnoutLevel = 'medium'
        reason = '최근 힘든 감정이 많이 보여요'
      }
    }

    // 기본값 설정
    if (!reason) {
      reason = '가끔 의지력이 떨어질 때가 있죠'
    }

    return { level: burnoutLevel, reason, patterns }

  } catch (error) {
    console.error("의지력 패턴 분석 실패:", error)
    return {
      level: 'medium',
      reason: '조금 지쳐 보이시네요',
      patterns: ['기본']
    }
  }
}

async function getUserContext(userEmail: string): Promise<{
  goals: Array<{ title: string; description: string }>
  recentReflections: Array<{ title: string; content: string }>
  interests: string[]
}> {
  try {
    // 사용자 목표 가져오기 (실제로는 goals 테이블에서)
    // 현재는 mock 데이터 사용
    const goals = [
      { title: "영어 실력 늘리기", description: "매일 조금씩 영어 공부하기" }
    ]

    // 최근 성찰 내용
    const reflectionRows = await sql`
      SELECT title, content 
      FROM reflections 
      WHERE user_email = ${userEmail}
      ORDER BY created_at DESC 
      LIMIT 3
    `

    const recentReflections = reflectionRows.map(row => ({
      title: row.title as string,
      content: row.content as string
    }))

    // 관심사 추출 (성찰 내용에서 키워드 분석)
    const interests = extractInterests(recentReflections.map(r => r.content).join(' '))

    return {
      goals: goals,
      recentReflections: recentReflections,
      interests: interests
    }

  } catch (error) {
    console.error("사용자 맥락 수집 실패:", error)
    return { goals: [], recentReflections: [], interests: [] }
  }
}

function extractInterests(content: string): string[] {
  const interestKeywords = {
    '운동': ['운동', '헬스', '요가', '달리기', '산책'],
    '독서': ['책', '독서', '소설', '읽기'],
    '요리': ['요리', '음식', '레시피', '먹기'],
    '음악': ['음악', '노래', '듣기', '연주'],
    '영어': ['영어', '단어', '공부', '학습'],
    '일': ['일', '업무', '회사', '프로젝트'],
    '가족': ['가족', '엄마', '아빠', '형제'],
    '친구': ['친구', '만나기', '연락']
  }

  const foundInterests = []
  for (const [interest, keywords] of Object.entries(interestKeywords)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      foundInterests.push(interest)
    }
  }

  return foundInterests.slice(0, 3) // 최대 3개
}

async function generateMicroActions(
  analysis: {
    level: 'low' | 'medium' | 'high'
    reason: string
    patterns: string[]
  },
  context: {
    goals: Array<{ title: string; description: string }>
    recentReflections: Array<{ title: string; content: string }>
    interests: string[]
  }
): Promise<Array<{
  title: string
  description: string
  timeEstimate: string
  difficulty: 'easy'
  category: string
}>> {
  try {
    const prompt = `
당신은 무무입니다. 사용자가 의지력이 고갈된 상태에서도 실행할 수 있는 아주 작은 행동들을 추천해주세요.

현재 상황:
- 의지력 수준: ${analysis.level}
- 이유: ${analysis.reason}
- 패턴: ${analysis.patterns.join(', ')}

사용자 맥락 정보:
- 목표: ${context.goals.map(g => g.title).join(', ') || '없음'}
- 관심사: ${context.interests.join(', ') || '없음'}
- 최근 성찰 키워드: ${context.recentReflections.map(r => r.title).join(', ') || '없음'}

다음 JSON 형식으로 5개의 마이크로 액션을 추천해주세요:
{
  "actions": [
    {
      "title": "액션 제목 (10자 이내)",
      "description": "구체적인 설명 (30자 이내)",
      "timeEstimate": "예상 소요 시간",
      "difficulty": "easy",
      "category": "카테고리"
    }
  ]
}

마이크로 액션 원칙:
1. **30초-2분 내** 완료 가능
2. **의지력 거의 불필요**: "그냥 하기" 수준
3. **구체적이고 측정 가능**: "3번 심호흡" vs "마음 다스리기"
4. **성취감 즉시**: 완료 시 바로 기분 좋아짐
5. **개인 맥락 연관**: 사용자의 목표나 관심사와 연결
6. **무무 톤**: 친근하고 응원하는 느낌

맥락 기반 액션 예시:
- 영어 목표: "영어 단어 1개 검색", "Hello 3번 말하기"
- 운동 관심: "팔 3번 돌리기", "제자리에서 발끝 올리기"  
- 독서 관심: "책 제목 하나 읽기", "좋아하는 작가 생각하기"
- 일 스트레스: "오늘 잘한 일 1개 떠올리기", "책상 물건 하나 정리"
- 관계 고민: "고마운 사람 1명 생각하기", "미소 3번 짓기"

일반 액션 (맥락 없을 때):
- 몸: "물 한 컵 마시기", "3번 기지개 켜기"
- 마음: "좋은 기억 하나 떠올리기", "감사한 일 1개 생각하기"  
- 공간: "책상 위 물건 하나 정리", "휴지통 비우기"

의지력 수준별 조정:
- high: 정말 아주 간단한 것들만 (10-30초)
- medium: 조금 더 의미있는 것들 (30초-1분)
- low: 평상시보다 작은 것들 (1-2분)
`

    const result = await geminiModel.generateContent(prompt)
    const responseText = result.response.text()

    let actions
    try {
      const cleanedResponse = responseText.replace(/```json\s*|\s*```/g, '').trim()
      const parsed = JSON.parse(cleanedResponse)
      actions = parsed.actions
    } catch (parseError) {
      console.warn("마이크로 액션 JSON 파싱 실패:", parseError)
      // 기본 액션들
      actions = [
        {
          title: "물 한 모금 마시기",
          description: "책상 위 물컵으로 한 모금만",
          timeEstimate: "10초",
          difficulty: "easy",
          category: "몸"
        },
        {
          title: "3번 심호흡",
          description: "천천히 숨 들이쉬고 내쉬기",
          timeEstimate: "30초",
          difficulty: "easy", 
          category: "마음"
        },
        {
          title: "책상 정리",
          description: "물건 하나만 제자리에 두기",
          timeEstimate: "1분",
          difficulty: "easy",
          category: "공간"
        },
        {
          title: "감사 인사",
          description: "가족에게 '고마워' 메시지",
          timeEstimate: "30초",
          difficulty: "easy",
          category: "관계"
        },
        {
          title: "스트레칭",
          description: "목을 좌우로 천천히 돌리기",
          timeEstimate: "20초",
          difficulty: "easy",
          category: "몸"
        }
      ]
    }

    return actions

  } catch (error) {
    console.error("마이크로 액션 생성 실패:", error)
    throw error
  }
}