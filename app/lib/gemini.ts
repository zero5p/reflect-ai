// app/lib/gemini.ts
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// API 키는 환경 변수에서 가져옵니다
const apiKey = process.env.GEMINI_API_KEY || '';

// API 키가 없으면 에러 표시
if (!apiKey) {
  console.warn('GEMINI_API_KEY가 설정되지 않았습니다. .env.local 파일에 설정해주세요.');
}

// Gemini API 초기화
export const genAI = new GoogleGenerativeAI(apiKey);

// 성찰 분석을 위한 모델 인스턴스 생성
export const getGeminiModel = (): GenerativeModel => {
  return genAI.getGenerativeModel({ model: "gemini-pro" });
};

/**
 * 성찰 데이터를 분석하여 인사이트를 추출합니다.
 * @param reflectionContent 성찰 내용
 * @param emotion 감정 상태
 * @returns 분석 결과 객체
 */
export async function analyzeReflection(reflectionContent: string, emotion: string) {
  try {
    const model = getGeminiModel();
    
    const prompt = `
      다음은 사용자의 성찰 일기와 감정 상태입니다. 이를 분석하여 유의미한 인사이트와 패턴을 추출해주세요.
      
      성찰 내용: "${reflectionContent}"
      감정 상태: ${emotion}
      
      다음 형식으로 JSON 객체를 반환해주세요:
      {
        "summary": "성찰의 핵심 요약",
        "keyInsights": ["인사이트1", "인사이트2", "인사이트3"],
        "emotionalPatterns": "감정 패턴에 대한 분석",
        "recommendedActions": ["추천 행동1", "추천 행동2"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResult = response.text();
    
    // JSON 형식 추출 (텍스트 응답에서 JSON 부분만 파싱)
    const jsonStart = textResult.indexOf('{');
    const jsonEnd = textResult.lastIndexOf('}') + 1;
    const jsonStr = textResult.substring(jsonStart, jsonEnd);
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('성찰 분석 중 오류 발생:', error);
    return {
      summary: '분석 중 오류가 발생했습니다.',
      keyInsights: [],
      emotionalPatterns: '데이터를 분석할 수 없습니다.',
      recommendedActions: ['나중에 다시 시도해보세요.']
    };
  }
}

/**
 * 성찰 데이터 기반으로 최적화된 일정을 추천합니다.
 * @param reflections 사용자의 성찰 데이터 배열
 * @param existingEvents 기존 일정 데이터 배열
 * @returns 추천 일정 객체 배열
 */
export async function generateScheduleRecommendations(reflections: any[], existingEvents: any[]) {
  try {
    const model = getGeminiModel();
    
    // 성찰 및 일정 데이터를 기반으로 프롬프트 구성
    const prompt = `
      사용자의 성찰 데이터와 기존 일정을 분석하여 최적화된 일정을 추천해주세요.
      
      사용자의 성찰 데이터:
      ${JSON.stringify(reflections)}
      
      사용자의 기존 일정:
      ${JSON.stringify(existingEvents)}
      
      다음 형식으로 3가지 추천 일정을 JSON 배열로 반환해주세요:
      [
        {
          "title": "활동 제목",
          "date": "YYYY-MM-DD",
          "startTime": "HH:MM",
          "endTime": "HH:MM",
          "category": "카테고리",
          "reasoning": "이 활동을 추천하는 이유"
        },
        ...
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResult = response.text();
    
    // JSON 형식 추출 (텍스트 응답에서 JSON 부분만 파싱)
    const jsonStart = textResult.indexOf('[');
    const jsonEnd = textResult.lastIndexOf(']') + 1;
    const jsonStr = textResult.substring(jsonStart, jsonEnd);
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('일정 추천 생성 중 오류 발생:', error);
    // 오류 발생 시 기본 추천 반환
    return [
      {
        title: "오류로 인해 추천을 생성할 수 없습니다",
        date: new Date().toISOString().split('T')[0],
        startTime: "09:00",
        endTime: "09:30",
        category: "오류",
        reasoning: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      }
    ];
  }
}

/**
 * 간격 반복 학습을 위한 복습 일정을 생성합니다.
 * @param reflectionId 성찰 ID
 * @param reflectionDate 성찰 작성일
 * @returns 복습 일정 날짜 배열
 */
export function generateSpacedRepetitionDates(reflectionId: string, reflectionDate: Date): Date[] {
  // 간격 반복 학습 간격 (피보나치 수열 활용): 1일, 2일, 3일, 5일, 8일, 13일, 21일 후...
  const intervals = [1, 2, 3, 5, 8, 13, 21];
  
  const repetitionDates = intervals.map(interval => {
    const date = new Date(reflectionDate);
    date.setDate(date.getDate() + interval);
    return date;
  });
  
  return repetitionDates;
}