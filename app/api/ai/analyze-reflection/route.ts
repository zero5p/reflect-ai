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

    const { reflectionContent, mood, tags } = await request.json()

    if (!reflectionContent) {
      return NextResponse.json({ error: '성찰 내용이 필요합니다.' }, { status: 400 })
    }

    // Gemini AI를 사용한 성찰 분석
    const prompt = `
당신은 심리학과 자기계발 전문가입니다. 사용자의 성찰 내용을 깊이 있게 분석하고 맞춤형 피드백을 제공해주세요.

성찰 내용: ${reflectionContent}
현재 감정: ${mood || '명시되지 않음'}
관련 태그: ${tags?.join(', ') || '없음'}

다음 JSON 형식으로 분석 결과를 제공해주세요:
{
  "success": true,
  "data": {
    "emotion": "분석된 감정",
    "intensity": "감정 강도 (1-5)",
    "keyInsights": [
      "핵심 인사이트1",
      "핵심 인사이트2",
      "핵심 인사이트3"
    ],
    "response": "맞춤형 상담 응답",
    "actionSuggestions": [
      "실천 제안1",
      "실천 제안2"
    ],
    "emotionTrend": "감정 패턴 분석"
  }
}

분석 가이드:
1. 감정 분류: happy, sad, angry, anxious, excited, calm, confused, grateful 중 선택
2. 감정 강도: 1(매우 약함) ~ 5(매우 강함)
3. 핵심 인사이트: 성찰에서 발견할 수 있는 중요한 깨달음
4. 맞춤형 응답: 공감과 격려, 구체적 조언 (200-300자)
5. 실천 제안: 구체적이고 실현 가능한 행동 제안
6. 감정 패턴: 성찰 내용에서 드러나는 감정의 특징

응답 스타일:
- 따뜻하고 공감적인 톤
- 판단하지 않고 이해하려는 자세
- 구체적이고 실용적인 조언
- 희망과 동기부여 제공
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
          const parsed = JSON.parse(jsonMatch[0])
          
          // 결과 검증
          if (parsed.data && parsed.data.emotion && parsed.data.response) {
            result = parsed
            break
          }
        }
        
        throw new Error('유효한 분석 결과를 생성할 수 없습니다.')
        
      } catch (error) {
        attempt++
        console.error(`성찰 분석 시도 ${attempt} 실패:`, error)
        
        if (attempt === maxAttempts) {
          // 폴백 응답
          result = {
            success: true,
            data: {
              emotion: 'calm',
              intensity: '3',
              keyInsights: [
                "자신의 감정을 글로 표현하려는 노력이 보입니다.",
                "성찰을 통해 자기 이해를 높이려는 의지가 느껴집니다.",
                "지속적인 성찰 습관이 성장에 도움이 될 것입니다."
              ],
              response: "소중한 성찰을 나눠주셔서 감사합니다. 자신의 마음을 들여다보고 글로 표현하는 것만으로도 큰 의미가 있어요. 이런 작은 성찰들이 모여 더 나은 자신을 만들어갈 거예요. 오늘도 수고 많으셨습니다.",
              actionSuggestions: [
                "매일 5분씩 성찰 시간을 가져보세요",
                "긍정적인 순간들을 기록해보세요"
              ],
              emotionTrend: "안정적이고 성찰적인 상태"
            }
          }
        }
      }
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('성찰 분석 에러:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '성찰 분석 중 오류가 발생했습니다.' 
      }, 
      { status: 500 }
    )
  }
}