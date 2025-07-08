import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { geminiModel } from '../../../../lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
    }

    const { mood, topic, recentActivities } = await request.json()

    // Gemini AI를 사용한 성찰 질문 생성
    const prompt = `
당신은 성찰과 자기계발을 돕는 AI 코치입니다. 사용자의 현재 감정 상태와 관심사를 바탕으로 깊이 있는 성찰 질문을 만들어주세요.

현재 감정: ${mood || '알 수 없음'}
관심 주제: ${topic || '일반적인 하루'}
최근 활동: ${recentActivities?.join(', ') || '특별한 활동 없음'}

다음 JSON 형식으로 5개의 성찰 질문을 생성해주세요:
{
  "success": true,
  "data": {
    "questions": [
      "질문1",
      "질문2", 
      "질문3",
      "질문4",
      "질문5"
    ]
  }
}

질문 작성 가이드:
1. 현재 감정에 맞는 깊이 있는 질문
2. 구체적이고 실천 가능한 성찰로 이어지는 질문
3. "왜", "어떻게", "무엇을" 활용한 열린 질문
4. 자기 이해와 성장으로 이어지는 방향성
5. 부담스럽지 않은 친근한 톤

예시:
- "오늘 하루 중 가장 만족스러웠던 순간은 언제였나요?"
- "지금 이 감정이 나에게 전하려는 메시지는 무엇일까요?"
- "내가 진정으로 원하는 것은 무엇인지 생각해보셨나요?"
`

    let result
    let attempt = 0
    const maxAttempts = 3

    while (attempt < maxAttempts) {
      try {
        const response = await geminiModel.generateContent(prompt)
        const text = response.response.text()
        
        // JSON 추출
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0])
          break
        }
        
        throw new Error('JSON 형식을 찾을 수 없습니다.')
        
      } catch (error) {
        attempt++
        console.error(`성찰 질문 생성 시도 ${attempt} 실패:`, error)
        
        if (attempt === maxAttempts) {
          // 폴백 질문들
          result = {
            success: true,
            data: {
              questions: [
                "오늘 하루를 한 단어로 표현한다면 무엇인가요?",
                "지금 이 순간 나의 마음 상태는 어떤가요?",
                "오늘 가장 기억에 남는 순간은 무엇이었나요?",
                "내가 지금 가장 감사하게 생각하는 것은 무엇인가요?",
                "내일을 위해 오늘 배운 것이 있다면 무엇인가요?"
              ]
            }
          }
        }
      }
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('성찰 질문 생성 에러:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '성찰 질문 생성 중 오류가 발생했습니다.' 
      }, 
      { status: 500 }
    )
  }
}