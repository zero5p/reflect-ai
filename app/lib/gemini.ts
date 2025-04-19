// app/lib/gemini.ts
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// API 키는 환경 변수에서 가져옵니다
const apiKey = process.env.GEMINI_API_KEY || '';

// API 키가 없을 때 모의 응답을 반환할지 여부
const useMockResponses = !apiKey || process.env.NODE_ENV === 'development';

// API 키가 없으면 경고 표시
if (!apiKey) {
  console.warn('GEMINI_API_KEY가 설정되지 않았습니다. 모의 데이터를 사용합니다.');
}

// Gemini API 초기화 (사용 가능한 경우)
let genAI: GoogleGenerativeAI | null = null;
try {
  if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('Gemini API가 초기화되었습니다.');
  }
} catch (error) {
  console.error('Gemini API 초기화 오류:', error);
  genAI = null;
}

// 모델 인스턴스 가져오기
export const getGeminiModel = (): GenerativeModel | null => {
  if (!genAI) return null;
  try {
    // 모델명을 "gemini-2.0-flash"로 명시적으로 지정 (curl 예시와 동일)
    return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  } catch (error) {
    console.error('Gemini 모델 생성 오류:', error);
    return null;
  }
};

/**
 * 성찰 데이터를 분석하여 인사이트를 추출합니다.
 * @param reflectionContent 성찰 내용
 * @param emotion 감정 상태
 * @returns 분석 결과 객체
 */
export async function analyzeReflection(reflectionContent: string, emotion: string) {
  if (useMockResponses || !genAI) {
    return {};
  }
  try {
    const model = getGeminiModel();
    if (!model) return {};
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

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });
    const response = await result.response;
    const textResult = await response.text();
    
    // JSON 형식 추출 (텍스트 응답에서 JSON 부분만 파싱)
    const jsonStart = textResult.indexOf('{');
    const jsonEnd = textResult.lastIndexOf('}') + 1;
    const jsonStr = textResult.substring(jsonStart, jsonEnd);
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('성찰 분석 중 오류 발생:', error);
    return {};
  }
}

/**
 * 성찰 데이터 기반으로 최적화된 일정을 추천합니다.
 * @param reflections 사용자의 성찰 데이터 배열
 * @param existingEvents 기존 일정 데이터 배열
 * @returns 추천 일정 객체 배열
 */
export async function generateScheduleRecommendations(reflections: unknown[], existingEvents: unknown[]) {
  if (useMockResponses || !genAI) {
    return [];
  }
  try {
    const model = getGeminiModel();
    if (!model) return [];
    const prompt = `
      사용자의 성찰 데이터와 기존 일정을 분석하여 최적화된 일정을 추천해주세요.
      
      사용자의 성찰 데이터:
      ${JSON.stringify(reflections)}
      
      사용자의 기존 일정:
      ${JSON.stringify(existingEvents)}
      
      아래 형식의 JSON 배열로 2~3개의 추천 일정을 반환하세요:
      [
        {
          "title": "추천 일정 제목",
          "date": "YYYY-MM-DD",
          "startTime": "HH:mm",
          "endTime": "HH:mm",
          "category": "카테고리",
          "reasoning": "추천 사유"
        }
      ]
    `;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });
    const response = await result.response;
    const textResult = await response.text();

    // JSON 배열만 추출
    const jsonStart = textResult.indexOf('[');
    const jsonEnd = textResult.lastIndexOf(']') + 1;
    const jsonStr = textResult.substring(jsonStart, jsonEnd);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('일정 추천 생성 중 오류 발생:', error);
    return [];
  }
}

/**
 * 간격 반복 학습을 위한 복습 일정을 생성합니다.
 * @param reflectionId 성찰 ID
 * @param reflectionDate 성찰 작성일
 * @returns 복습 일정 날짜 배열
 */
export function generateSpacedRepetitionDates(reflectionId: string, reflectionDate: Date): Date[] {
  const dates: Date[] = [];
  const intervals = [1, 3, 7, 14, 30]; // days later
  for (const interval of intervals) {
    const nextDate = new Date(reflectionDate);
    nextDate.setDate(nextDate.getDate() + interval);
    dates.push(nextDate);
  }
  return dates;
}