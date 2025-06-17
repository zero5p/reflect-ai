import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

// 재시도 기능이 있는 AI 분석 함수
export async function analyzeEmotionAndGenerateResponse(
  reflection: {
    title: string
    content: string
  }, 
  retryCount = 0,
  aiStyle?: string
): Promise<any> {
  const maxRetries = 3
  
  // API 키 확인
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.")
  }

  try {
    // AI 스타일에 따른 페르소나 설정
    const getPersona = (style: string) => {
      switch (style) {
        case 'coach':
          return '당신은 무무노트의 AI 코치 \'무무\'입니다. 직설적이고 현실적인 조언을 해주세요. 목표 달성에 집중하고, 구체적인 행동 방안을 제시하는 것이 특징입니다.'
        case 'friend':
          return '당신은 무무노트의 AI 친구 \'무무\'입니다. 따뜻하고 공감적인 대화를 해주세요. 사용자의 감정에 깊이 공감하고, 따뜻한 위로와 격려를 해주는 것이 특징입니다.'
        case 'mentor':
          return '당신은 무무노트의 AI 멘토 \'무무\'입니다. 의지력보다는 시스템과 환경 개선에 집중한 조언을 해주세요. Andy Kim의 철학을 반영하여 "그냥 하기" 접근법을 중시합니다.'
        case 'balanced':
        default:
          return '당신은 무무노트의 AI 상담사 \'무무\'입니다. 상황에 맞게 공감과 조언을 균형있게 해주세요. 사용자의 상태를 보고 때로는 따뜻하게, 때로는 구체적으로 대응합니다.'
      }
    }

    const prompt = `
${getPersona(aiStyle || 'balanced')}

성찰 제목: ${reflection.title}
내용: ${reflection.content}

다음 JSON 형식으로 응답해주세요:
{
  "emotion": "감정",
  "intensity": "강도", 
  "response": "상담 응답"
}

감정 분류: happy, sad, angry, anxious, excited, calm, confused, grateful
강도 분류: low, medium, high

응답 작성 가이드:
1. 첫 문장에서 사용자의 마음을 정확히 알아차렸다는 것을 보여주세요
2. "~네요", "~군요", "~겠어요" 같은 자연스러운 말투 사용
3. 구체적이고 실천 가능한 조언 포함 (예: 구체적인 행동, 시간, 방법)
4. 판단하거나 가르치려 하지 말고, 함께 생각해보는 느낌으로
5. 200-300자 정도의 적당한 길이

상황별 응답 예시:
• 힘든 감정: "정말 힘든 시간을 보내고 계시는군요. 이런 마음이 드는 건 너무 자연스러운 거예요. 오늘 하루만이라도 나 자신에게 조금 더 다정하게 대해보면 어떨까요?"

• 좋은 감정: "와, 정말 기분 좋은 하루였나봐요! 이런 순간들을 기록해두신 게 참 좋네요. 이 기분을 더 오래 간직하려면 어떤 것들이 도움이 될까 함께 생각해봐요."

• 혼란스러운 감정: "마음이 복잡하시군요. 이럴 때일수록 천천히 하나씩 정리해보는 게 도움이 될 거예요. 지금 가장 중요한 것 하나만 먼저 생각해보면 어떨까요?"

절대 피해야 할 표현:
- "당신은", "귀하는" 같은 딱딱한 표현  
- "~해야 합니다", "~하십시오" 같은 명령조
- "전문가로서", "상담사로서" 같은 거리감 있는 표현
- 너무 길고 형식적인 문장
- "무무가", "무무는" 같은 3인칭 표현 (자연스럽게 1인칭 관점으로)

무무의 따뜻하고 친근한 목소리로, 진심이 담긴 한국어로 응답하세요.
`

    console.log(`AI 분석 시도 중... (시도 ${retryCount + 1}/${maxRetries + 1})`)
    
    const result = await geminiModel.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log("AI 응답 원본:", text.substring(0, 200) + "...")
    
    // JSON 추출 개선
    let jsonText = text.trim()
    
    // 코드 블록 제거
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '')
    
    // JSON 객체 찾기
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("JSON 형식의 응답을 찾을 수 없습니다.")
    }
    
    const parsedResult = JSON.parse(jsonMatch[0])
    
    // 결과 검증
    if (!parsedResult.emotion || !parsedResult.intensity || !parsedResult.response) {
      throw new Error("AI 응답에 필수 필드가 누락되었습니다.")
    }
    
    // 감정 값 검증
    const validEmotions = ['happy', 'sad', 'angry', 'anxious', 'excited', 'calm', 'confused', 'grateful']
    const validIntensities = ['low', 'medium', 'high']
    
    if (!validEmotions.includes(parsedResult.emotion)) {
      console.warn("유효하지 않은 감정값, 기본값으로 설정:", parsedResult.emotion)
      parsedResult.emotion = 'calm'
    }
    
    if (!validIntensities.includes(parsedResult.intensity)) {
      console.warn("유효하지 않은 강도값, 기본값으로 설정:", parsedResult.intensity)
      parsedResult.intensity = 'medium'
    }
    
    console.log("AI 분석 성공")
    return parsedResult
    
  } catch (error) {
    console.error(`AI 분석 실패 (시도 ${retryCount + 1}):`, error)
    
    // 재시도 로직
    if (retryCount < maxRetries) {
      console.log(`${2 * (retryCount + 1)}초 후 재시도...`)
      await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)))
      return analyzeEmotionAndGenerateResponse(reflection, retryCount + 1)
    }
    
    // 최종 실패 시 구체적인 에러 메시지
    let errorMessage = "AI 감정 분석 및 응답 생성에 실패했습니다."
    
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        errorMessage = "AI 서비스 인증에 실패했습니다. 관리자에게 문의해주세요."
      } else if (error.message.includes("quota")) {
        errorMessage = "AI 서비스 사용량이 초과되었습니다. 잠시 후 다시 시도해주세요."
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        errorMessage = "네트워크 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요."
      }
    }
    
    throw new Error(errorMessage)
  }
}

// 기존 함수 호환성 유지
export async function generateReflectionResponse(reflection: {
  title: string
  content: string
  emotion: string
  intensity: string
}) {
  try {
    const result = await analyzeEmotionAndGenerateResponse({
      title: reflection.title,
      content: reflection.content
    })
    return result.response
  } catch (error) {
    console.error("Error generating reflection response:", error)
    throw new Error("AI 응답 생성에 실패했습니다.")
  }
}

export async function generateScheduleRecommendations(reflections: Array<{
  title: string
  content: string
  emotion: string
  intensity: string
  createdAt: string
}>, userRequest?: string) {
  try {
    const reflectionSummary = reflections.map(r => 
      `날짜: ${r.createdAt}, 감정: ${r.emotion}, 내용: ${r.content.substring(0, 100)}...`
    ).join('\n')

    const prompt = `
당신은 개인 성장과 웰빙을 위한 AI 코치입니다. 사용자의 최근 성찰 기록을 분석하여 맞춤형 일정을 추천해주세요.

최근 성찰 기록:
${reflectionSummary}

${userRequest ? `사용자의 추가 요청사항:
${userRequest}

사용자의 요청사항을 우선적으로 고려하여 맞춤형 일정을 추천해주세요.` : ''}

사용자의 감정 패턴과 성찰 내용${userRequest ? ' 및 요청사항' : ''}을 바탕으로 다음 5가지 카테고리에서 각각 1-2개의 구체적인 일정을 추천해주세요:

1. 정신건강/자기관리
2. 사회활동/인간관계  
3. 학습/성장
4. 운동/건강
5. 취미/여가

각 추천 일정은 다음 형식으로 작성해주세요:
- 제목: [구체적인 활동명]
- 설명: [이 활동이 도움이 되는 이유와 실천 방법]
- 추천 시간: [적절한 시간대 제안]

JSON 형식으로 응답해주세요:
{
  "recommendations": [
    {
      "category": "카테고리",
      "title": "일정 제목", 
      "description": "설명",
      "recommendedTime": "시간",
      "type": "ai_recommended"
    }
  ]
}
`

    const result = await geminiModel.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // JSON 응답에서 코드 블록 제거
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error("Invalid JSON response")
    
  } catch (error) {
    console.error("Error generating schedule recommendations:", error)
    throw new Error("AI 일정 추천 생성에 실패했습니다.")
  }
}