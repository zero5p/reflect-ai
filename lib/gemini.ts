import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export const geminiModel = genAI.getModel("gemini-2.0-flash-exp")

export async function generateReflectionResponse(reflection: {
  title: string
  content: string
  emotion: string
  intensity: string
}) {
  try {
    const prompt = `
당신은 따뜻하고 공감적인 심리 상담사입니다. 사용자의 성찰 일기를 읽고 격려와 통찰을 제공해주세요.

성찰 제목: ${reflection.title}
내용: ${reflection.content}
감정: ${reflection.emotion}
강도: ${reflection.intensity}

다음 형식으로 답변해주세요:
1. 공감과 인정 (2-3문장)
2. 통찰과 관점 (2-3문장) 
3. 실천적 조언 (2-3문장)
4. 격려 메시지 (1-2문장)

따뜻하고 개인적인 톤으로 작성하되, 한국어로 답변하세요.
`

    const result = await geminiModel.generateContent(prompt)
    const response = await result.response
    return response.text()
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
}>) {
  try {
    const reflectionSummary = reflections.map(r => 
      `날짜: ${r.createdAt}, 감정: ${r.emotion}, 내용: ${r.content.substring(0, 100)}...`
    ).join('\n')

    const prompt = `
당신은 개인 성장과 웰빙을 위한 AI 코치입니다. 사용자의 최근 성찰 기록을 분석하여 맞춤형 일정을 추천해주세요.

최근 성찰 기록:
${reflectionSummary}

사용자의 감정 패턴과 성찰 내용을 바탕으로 다음 5가지 카테고리에서 각각 1-2개의 구체적인 일정을 추천해주세요:

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