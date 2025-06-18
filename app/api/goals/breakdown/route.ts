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
    
    // 에러 발생 시 기본 구조 반환
    const defaultBreakdown = {
      timeframe: "2-3개월",
      phases: [
        {
          title: "준비 단계",
          description: `${goalTitle} 목표를 위한 기본 준비`,
          duration: "1-2주",
          tasks: [
            {
              title: "목표 구체화하기",
              description: "목표를 더 세부적으로 계획해보세요",
              timeEstimate: "30분",
              difficulty: "easy"
            }
          ]
        }
      ]
    }
    
    return NextResponse.json({
      success: true,
      data: defaultBreakdown
    })
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
    const prompt = `목표: "${goalTitle}"
${goalDescription ? `설명: ${goalDescription}` : ''}

이 목표를 달성하기 위한 실행 계획을 JSON 형식으로 만들어주세요.

JSON 응답 예시:
{
  "timeframe": "3개월",
  "phases": [
    {
      "title": "1단계: 기초 준비",
      "description": "기본적인 준비 작업",
      "duration": "1주",
      "tasks": [
        {
          "title": "목표 세부 계획 세우기",
          "description": "구체적인 실행 계획 작성",
          "timeEstimate": "1시간",
          "difficulty": "easy"
        }
      ]
    },
    {
      "title": "2단계: 실행 시작",
      "description": "본격적인 실행",
      "duration": "4주",
      "tasks": [
        {
          "title": "첫 번째 액션 실행",
          "description": "가장 중요한 첫 걸음",
          "timeEstimate": "매일 30분",
          "difficulty": "medium"
        }
      ]
    }
  ]
}

JSON만 응답하세요. 다른 텍스트는 포함하지 마세요.`

    console.log('목표 분해 AI 프롬프트:', prompt)
    
    const result = await geminiModel.generateContent(prompt)
    const responseText = result.response.text()
    
    console.log('목표 분해 AI 응답:', responseText)

    // JSON 파싱 시도
    let breakdown
    try {
      // 다양한 형식의 응답 처리
      let cleanedResponse = responseText.trim()
      
      // JSON 코드 블록 제거
      cleanedResponse = cleanedResponse.replace(/```json\s*|\s*```/g, '')
      
      // 마크다운 코드 블록 제거
      cleanedResponse = cleanedResponse.replace(/```\s*|\s*```/g, '')
      
      // 불필요한 텍스트 제거 (첫 번째 { 부터 마지막 } 까지만 추출)
      const firstBrace = cleanedResponse.indexOf('{')
      const lastBrace = cleanedResponse.lastIndexOf('}')
      
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanedResponse = cleanedResponse.substring(firstBrace, lastBrace + 1)
      }
      
      console.log('정리된 응답:', cleanedResponse)
      breakdown = JSON.parse(cleanedResponse)
      console.log('파싱된 목표 분해:', breakdown)
    } catch (parseError) {
      console.warn("JSON 파싱 실패, 기본 구조 사용:", parseError)
      console.warn('파싱 실패한 응답:', responseText)
      // AI 분석에 기반한 기본 구조 생성
      breakdown = generateFallbackBreakdown(goalTitle, goalDescription)
    }

    return breakdown

  } catch (error) {
    console.error("AI 목표 분해 실패:", error)
    return generateFallbackBreakdown(goalTitle, goalDescription)
  }
}

function generateFallbackBreakdown(goalTitle: string, goalDescription?: string) {
  // 목표 키워드 분석을 통한 맞춤형 분해
  const goal = goalTitle.toLowerCase()
  
  let phases = []
  let timeframe = "2-3개월"
  
  if (goal.includes('운동') || goal.includes('건강') || goal.includes('다이어트') || goal.includes('체중')) {
    phases = [
      {
        title: "1단계: 기초 체력 다지기",
        description: "운동 습관을 만들고 기초 체력을 향상시키는 단계",
        duration: "2-3주",
        tasks: [
          {
            title: "매일 10분 스트레칭하기",
            description: "아침이나 저녁에 간단한 스트레칭으로 몸을 풀어주세요",
            timeEstimate: "매일 10분",
            difficulty: "easy"
          },
          {
            title: "주 3회 30분 걷기",
            description: "가벼운 산책부터 시작해서 걷기 습관을 만드세요",
            timeEstimate: "주 3회 30분",
            difficulty: "easy"
          },
          {
            title: "물 하루 8잔 마시기",
            description: "충분한 수분 섭취로 건강한 몸 만들기",
            timeEstimate: "하루 종일",
            difficulty: "easy"
          }
        ]
      },
      {
        title: "2단계: 본격적인 운동 시작",
        description: "체계적인 운동 루틴을 만들어 나가는 단계",
        duration: "4-6주",
        tasks: [
          {
            title: "근력 운동 추가하기",
            description: "집에서 할 수 있는 간단한 근력 운동 시작",
            timeEstimate: "주 3회 20분",
            difficulty: "medium"
          },
          {
            title: "운동 강도 높이기",
            description: "걷기에서 조깅으로, 시간과 강도를 점진적으로 증가",
            timeEstimate: "주 4회 40분",
            difficulty: "medium"
          }
        ]
      }
    ]
  } else if (goal.includes('공부') || goal.includes('학습') || goal.includes('시험') || goal.includes('언어')) {
    phases = [
      {
        title: "1단계: 학습 환경 구축",
        description: "효과적인 학습을 위한 기반을 마련하는 단계",
        duration: "1-2주",
        tasks: [
          {
            title: "학습 계획 세우기",
            description: "구체적인 학습 목표와 일정을 계획해보세요",
            timeEstimate: "2시간",
            difficulty: "easy"
          },
          {
            title: "학습 공간 정리하기",
            description: "집중할 수 있는 깔끔한 학습 공간 만들기",
            timeEstimate: "1시간",
            difficulty: "easy"
          },
          {
            title: "매일 30분 기초 학습",
            description: "부담 없는 시간으로 학습 습관 만들기",
            timeEstimate: "매일 30분",
            difficulty: "easy"
          }
        ]
      },
      {
        title: "2단계: 본격적인 학습",
        description: "체계적이고 깊이 있는 학습을 진행하는 단계",
        duration: "6-8주",
        tasks: [
          {
            title: "학습 시간 늘리기",
            description: "30분에서 1시간으로 점진적으로 시간 증가",
            timeEstimate: "매일 1시간",
            difficulty: "medium"
          },
          {
            title: "복습 시스템 만들기",
            description: "배운 내용을 정기적으로 복습하는 시스템 구축",
            timeEstimate: "주 2회 30분",
            difficulty: "medium"
          }
        ]
      }
    ]
  } else if (goal.includes('독서') || goal.includes('책')) {
    phases = [
      {
        title: "1단계: 독서 습관 만들기",
        description: "꾸준한 독서 습관을 형성하는 단계",
        duration: "2-3주",
        tasks: [
          {
            title: "매일 15분 독서하기",
            description: "부담 없는 시간으로 독서 습관 시작하기",
            timeEstimate: "매일 15분",
            difficulty: "easy"
          },
          {
            title: "읽고 싶은 책 목록 만들기",
            description: "관심 있는 책들을 리스트업해서 동기부여하기",
            timeEstimate: "30분",
            difficulty: "easy"
          }
        ]
      },
      {
        title: "2단계: 깊이 있는 독서",
        description: "더 많이, 더 깊이 있게 읽는 단계",
        duration: "4-6주",
        tasks: [
          {
            title: "독서 시간 늘리기",
            description: "15분에서 30분, 1시간으로 점진적 증가",
            timeEstimate: "매일 30분-1시간",
            difficulty: "medium"
          },
          {
            title: "독서 노트 작성하기",
            description: "인상 깊은 구절이나 생각을 기록하기",
            timeEstimate: "독서 후 10분",
            difficulty: "medium"
          }
        ]
      }
    ]
  } else {
    // 일반적인 목표
    phases = [
      {
        title: "1단계: 목표 구체화 및 준비",
        description: `${goalTitle} 달성을 위한 기초 준비 단계`,
        duration: "1-2주",
        tasks: [
          {
            title: "목표 세부 계획 세우기",
            description: "구체적이고 측정 가능한 세부 목표들로 나누어 보세요",
            timeEstimate: "1시간",
            difficulty: "easy"
          },
          {
            title: "필요한 자료/도구 준비하기",
            description: "목표 달성에 필요한 것들을 미리 준비해두세요",
            timeEstimate: "2시간",
            difficulty: "easy"
          },
          {
            title: "첫 번째 작은 행동 시작하기",
            description: "가장 작고 쉬운 것부터 시작해서 동기를 유지하세요",
            timeEstimate: "매일 15분",
            difficulty: "easy"
          }
        ]
      },
      {
        title: "2단계: 본격적인 실행",
        description: "계획한 것들을 실제로 실행에 옮기는 단계",
        duration: "4-6주",
        tasks: [
          {
            title: "활동 강도 높이기",
            description: "익숙해진 활동의 시간이나 강도를 점진적으로 늘려보세요",
            timeEstimate: "매일 30분-1시간",
            difficulty: "medium"
          },
          {
            title: "관련 활동 추가하기",
            description: "목표와 관련된 다른 유익한 활동들도 시도해보세요",
            timeEstimate: "주 2-3회",
            difficulty: "medium"
          },
          {
            title: "진행상황 점검하기",
            description: "정기적으로 목표 달성 정도를 확인하고 조정하세요",
            timeEstimate: "주 1회 30분",
            difficulty: "easy"
          }
        ]
      }
    ]
  }
  
  return {
    timeframe,
    phases
  }
}