import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/authOptions"
import { geminiModel } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  let goalTitle = ""
  let goalDescription = ""
  
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const requestBody = await request.json()
    goalTitle = requestBody.goalTitle
    goalDescription = requestBody.goalDescription

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
          description: `${goalTitle || "목표"} 달성을 위한 기본 준비`,
          duration: "1-2주",
          tasks: [
            {
              title: "목표 구체화하기",
              description: "목표를 더 세부적으로 계획해보세요",
              timeEstimate: "30분",
              difficulty: "easy" as const
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

function generateFallbackBreakdown(goalTitle: string, goalDescription?: string): {
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
} {
  // 목표 키워드 분석을 통한 맞춤형 분해
  const goal = goalTitle.toLowerCase()
  
  let phases = []
  let timeframe = "2-3개월"
  
  if (goal.includes('운동') || goal.includes('건강') || goal.includes('다이어트') || goal.includes('체중')) {
    phases = [
      {
        title: "1단계: 기초 습관 만들기",
        description: "매일 할 수 있는 간단한 건강 습관 형성",
        duration: "2-3주",
        tasks: [
          {
            title: "매일 10분 스트레칭하기",
            description: "아침 기상 후 또는 잠들기 전 간단한 스트레칭",
            timeEstimate: "매일 10분",
            difficulty: "easy" as const
          },
          {
            title: "매일 물 8잔 마시기",
            description: "하루 종일 충분한 수분 섭취하기",
            timeEstimate: "매일",
            difficulty: "easy" as const
          },
          {
            title: "매일 30분 걷기",
            description: "산책이나 가벼운 걷기로 몸을 움직이기",
            timeEstimate: "매일 30분",
            difficulty: "easy" as const
          },
          {
            title: "운동 계획 세우기",
            description: "본격적인 운동을 위한 계획과 목표 수립",
            timeEstimate: "1시간",
            difficulty: "easy" as const
          }
        ]
      },
      {
        title: "2단계: 본격적인 운동 시작",
        description: "체계적인 운동 루틴을 시작하는 단계",
        duration: "4-6주",
        tasks: [
          {
            title: "주 3회 근력 운동하기",
            description: "집에서 할 수 있는 기본 근력 운동 시작",
            timeEstimate: "주 3회 30분",
            difficulty: "medium" as const
          },
          {
            title: "유산소 운동 강화하기",
            description: "걷기에서 조깅, 러닝으로 단계적 발전",
            timeEstimate: "주 4회 40분",
            difficulty: "medium" as const
          },
          {
            title: "체중/체성분 측정하기",
            description: "주 1회 정기적인 몸 상태 체크",
            timeEstimate: "주 1회 10분",
            difficulty: "easy" as const
          }
        ]
      }
    ]
  } else if (goal.includes('공부') || goal.includes('학습') || goal.includes('시험') || goal.includes('언어')) {
    phases = [
      {
        title: "1단계: 학습 습관 만들기",
        description: "매일 할 수 있는 학습 루틴 형성",
        duration: "2-3주",
        tasks: [
          {
            title: "매일 30분 학습하기",
            description: "부담 없는 시간으로 매일 꾸준히 학습",
            timeEstimate: "매일 30분",
            difficulty: "easy" as const
          },
          {
            title: "매일 학습 일지 작성하기",
            description: "오늘 배운 내용과 느낀 점을 간단히 기록",
            timeEstimate: "매일 5분",
            difficulty: "easy" as const
          },
          {
            title: "학습 환경 정리하기",
            description: "집중할 수 있는 깔끔한 학습 공간 만들기",
            timeEstimate: "1시간",
            difficulty: "easy" as const
          },
          {
            title: "학습 계획 수립하기",
            description: "구체적인 학습 목표와 로드맵 작성",
            timeEstimate: "2시간",
            difficulty: "easy" as const
          }
        ]
      },
      {
        title: "2단계: 심화 학습",
        description: "체계적이고 깊이 있는 학습 진행",
        duration: "6-8주",
        tasks: [
          {
            title: "학습 시간 확장하기",
            description: "30분에서 1-2시간으로 점진적 증가",
            timeEstimate: "매일 1-2시간",
            difficulty: "medium" as const
          },
          {
            title: "주간 복습하기",
            description: "배운 내용을 주 1-2회 정기적으로 복습",
            timeEstimate: "주 2회 1시간",
            difficulty: "medium" as const
          },
          {
            title: "모의시험/실습하기",
            description: "실제 시험이나 실습을 통한 실력 점검",
            timeEstimate: "주 1회 2시간",
            difficulty: "medium" as const
          }
        ]
      }
    ]
  } else if (goal.includes('독서') || goal.includes('책')) {
    phases = [
      {
        title: "1단계: 독서 습관 만들기",
        description: "매일 꾸준한 독서 루틴 형성",
        duration: "3-4주",
        tasks: [
          {
            title: "매일 20분 독서하기",
            description: "부담 없는 시간으로 매일 꾸준히 독서",
            timeEstimate: "매일 20분",
            difficulty: "easy" as const
          },
          {
            title: "매일 독서 기록하기",
            description: "읽은 페이지 수와 간단한 감상 기록",
            timeEstimate: "매일 5분",
            difficulty: "easy" as const
          },
          {
            title: "읽고 싶은 책 목록 만들기",
            description: "관심 있는 책들을 장르별로 정리하기",
            timeEstimate: "1시간",
            difficulty: "easy" as const
          },
          {
            title: "독서 환경 만들기",
            description: "편안하고 집중할 수 있는 독서 공간 조성",
            timeEstimate: "30분",
            difficulty: "easy" as const
          }
        ]
      },
      {
        title: "2단계: 깊이 있는 독서",
        description: "더 많이, 더 깊이 있게 읽고 사고하기",
        duration: "4-6주",
        tasks: [
          {
            title: "독서 시간 확장하기",
            description: "20분에서 40분-1시간으로 점진적 증가",
            timeEstimate: "매일 40분-1시간",
            difficulty: "medium" as const
          },
          {
            title: "독서 노트 작성하기",
            description: "인상 깊은 구절과 생각을 상세히 기록",
            timeEstimate: "독서 후 15분",
            difficulty: "medium" as const
          },
          {
            title: "독서 토론/공유하기",
            description: "읽은 책에 대해 다른 사람과 이야기 나누기",
            timeEstimate: "주 1회 30분",
            difficulty: "medium" as const
          }
        ]
      }
    ]
  } else {
    // 일반적인 목표
    phases = [
      {
        title: "1단계: 기초 습관 만들기",
        description: `${goalTitle} 달성을 위한 매일 할 수 있는 기초 습관 형성`,
        duration: "2-3주",
        tasks: [
          {
            title: "매일 15분 관련 활동하기",
            description: `${goalTitle}와 관련된 가장 기본적인 활동을 매일 15분씩`,
            timeEstimate: "매일 15분",
            difficulty: "easy" as const
          },
          {
            title: "매일 진행상황 기록하기",
            description: "오늘 한 일과 느낀 점을 간단히 기록",
            timeEstimate: "매일 5분",
            difficulty: "easy" as const
          },
          {
            title: "목표 세부 계획 세우기",
            description: "구체적이고 측정 가능한 세부 목표들로 나누어 보기",
            timeEstimate: "2시간",
            difficulty: "easy" as const
          },
          {
            title: "필요한 자료/도구 준비하기",
            description: "목표 달성에 필요한 것들을 미리 준비해두기",
            timeEstimate: "1-2시간",
            difficulty: "easy" as const
          }
        ]
      },
      {
        title: "2단계: 본격적인 실행",
        description: "체계적이고 지속적인 실행을 통한 목표 달성",
        duration: "4-6주",
        tasks: [
          {
            title: "활동 시간 확장하기",
            description: "15분에서 30분-1시간으로 점진적 확장",
            timeEstimate: "매일 30분-1시간",
            difficulty: "medium" as const
          },
          {
            title: "관련 활동 다양화하기",
            description: "목표와 관련된 다양한 활동들을 추가로 시도",
            timeEstimate: "주 2-3회",
            difficulty: "medium" as const
          },
          {
            title: "주간 점검 및 조정하기",
            description: "정기적으로 목표 달성 정도를 확인하고 계획 조정",
            timeEstimate: "주 1회 30분",
            difficulty: "easy" as const
          },
          {
            title: "성과 정리 및 공유하기",
            description: "달성한 성과를 정리하고 다른 사람과 공유",
            timeEstimate: "2주마다 1시간",
            difficulty: "medium" as const
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