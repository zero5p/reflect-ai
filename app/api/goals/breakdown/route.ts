import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/authOptions"
import { geminiModel } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { goalTitle, goalDescription } = await request.json()

    if (!goalTitle) {
      return NextResponse.json({ error: "Goal title is required" }, { status: 400 })
    }

    // AI로 목표 분해
    const breakdown = await breakdownGoalWithAI(goalTitle, goalDescription)

    return NextResponse.json({
      success: true,
      data: breakdown
    })

  } catch (error) {
    console.error("목표 분해 실패:", error)
    return NextResponse.json({
      success: false,
      error: "목표 분해 중 오류가 발생했습니다"
    }, { status: 500 })
  }
}

async function breakdownGoalWithAI(goalTitle: string, goalDescription?: string): Promise<{
  timeframe: string
  phases: Array<{
    title: string
    description: string
    duration: string
    tasks: Array<{
      title: string
      description: string
      timeEstimate: string
      difficulty: 'easy' | 'medium' | 'hard'
    }>
  }>
}> {
  try {
    const prompt = `
당신은 목표 달성 전문가 무무입니다. 사용자의 큰 목표를 실행 가능한 작은 단계들로 나누어주세요.

목표: ${goalTitle}
${goalDescription ? `상세 설명: ${goalDescription}` : ''}

다음 JSON 형식으로 응답해주세요:
{
  "timeframe": "전체 예상 소요 시간",
  "phases": [
    {
      "title": "1단계 제목",
      "description": "1단계 설명",
      "duration": "예상 소요 시간",
      "tasks": [
        {
          "title": "구체적인 작업 제목",
          "description": "작업 상세 설명",
          "timeEstimate": "예상 소요 시간",
          "difficulty": "easy|medium|hard"
        }
      ]
    }
  ]
}

목표 분해 원칙:
1. **현실적으로**: 실제 실행 가능한 크기로 나누기
2. **구체적으로**: "공부하기" → "매일 30분 영어 단어 10개 외우기"
3. **측정 가능하게**: 완료 여부를 명확히 판단할 수 있게
4. **단계별로**: 앞 단계 완료 후 다음 단계 진행
5. **무무 캐릭터**: 친근하고 응원하는 톤으로 작성

예시:
- 목표: "건강해지기" 
- 1단계: 기본 습관 만들기 (1-2주)
  - 매일 물 8잔 마시기 (쉬움, 5분)
  - 계단 오르기 (쉬움, 10분)
- 2단계: 운동 시작하기 (3-4주)
  - 주 3회 30분 산책 (보통, 30분)
  - 스트레칭 루틴 만들기 (보통, 15분)

응답은 3-4단계, 각 단계마다 3-5개 작업으로 구성해주세요.
`

    const result = await geminiModel.generateContent(prompt)
    const responseText = result.response.text()

    // JSON 파싱 시도
    let breakdown
    try {
      // JSON 코드 블록 제거
      const cleanedResponse = responseText.replace(/```json\s*|\s*```/g, '').trim()
      breakdown = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.warn("JSON 파싱 실패, 기본 구조 사용:", parseError)
      // 기본 구조 반환
      breakdown = {
        timeframe: "2-3개월",
        phases: [
          {
            title: "시작 단계",
            description: "기본적인 준비와 습관 만들기",
            duration: "2-3주",
            tasks: [
              {
                title: "목표 구체화하기",
                description: "목표를 더 세부적으로 정의하고 계획 세우기",
                timeEstimate: "1시간",
                difficulty: "easy"
              },
              {
                title: "첫 번째 작은 행동 시작하기",
                description: "가장 작고 쉬운 것부터 시작해서 습관 만들기",
                timeEstimate: "매일 10분",
                difficulty: "easy"
              }
            ]
          },
          {
            title: "발전 단계",
            description: "습관을 확장하고 심화하기",
            duration: "4-6주",
            tasks: [
              {
                title: "난이도 조금 올리기",
                description: "익숙해진 행동의 강도나 시간을 늘려보기",
                timeEstimate: "매일 20-30분",
                difficulty: "medium"
              },
              {
                title: "관련 활동 추가하기",
                description: "목표와 관련된 다른 활동들도 시도해보기",
                timeEstimate: "주 2-3회",
                difficulty: "medium"
              }
            ]
          }
        ]
      }
    }

    return breakdown

  } catch (error) {
    console.error("AI 목표 분해 실패:", error)
    throw error
  }
}