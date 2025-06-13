import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

// 재시도 기능이 있는 AI 분석 함수
export async function analyzeEmotionAndGenerateResponse(reflection: {
  title: string
  content: string
}, retryCount = 0): Promise<any> {
  const maxRetries = 3
  
  // API 키 확인
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.")
  }

  try {
    const prompt = `
당신은 따뜻하고 공감적인 심리 상담사입니다. 사용자의 성찰 일기를 분석하여 감정을 파악하고 상담 응답을 제공해주세요.

성찰 제목: ${reflection.title}
내용: ${reflection.content}

다음 JSON 형식으로 정확히 응답해주세요 (코드 블록 없이 순수 JSON만):
{
  "emotion": "감정 (happy/sad/angry/anxious/excited/calm/confused/grateful 중 하나)",
  "intensity": "강도 (low/medium/high 중 하나)",
  "response": "상담사 응답 (4개 섹션: 1.공감과 인정 2.통찰과 관점 3.실천적 조언 4.격려 메시지)"
}

감정 분석 기준:
- happy: 기쁨, 만족, 성취감, 즐거움이 드러나는 경우
- sad: 슬픔, 실망, 우울, 상실감이 드러나는 경우  
- angry: 분노, 짜증, 화, 불만이 드러나는 경우
- anxious: 불안, 걱정, 두려움, 긴장이 드러나는 경우
- excited: 흥분, 기대, 열정이 드러나는 경우
- calm: 평온, 안정, 차분함이 드러나는 경우
- confused: 혼란, 갈등, 확신이 서지 않는 경우
- grateful: 감사, 고마움이 드러나는 경우

강도 분석 기준:
- low: 약한 감정 표현, 담담한 서술
- medium: 보통 정도의 감정 표현
- high: 강한 감정 표현, 격한 언어 사용

응답 스타일:
- 전문적이지만 친근하고 따뜻한 톤
- 마크다운 포맷 사용하지 말고 자연스러운 문장으로 작성
- "당신"보다는 좀 더 친근한 표현 사용
- 공감과 격려가 느껴지는 따뜻한 말투
- 4개 섹션을 자연스럽게 이어지는 하나의 글로 작성

한국어로 답변하세요.
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