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
    // 최신 API 버전 및 모델명 사용 (v1beta API에서 지원하는 모델)
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
  // 모의 응답 또는 API 키가 없는 경우
  if (useMockResponses || !genAI) {
    console.log('모의 성찰 분석 결과 사용');
    return getMockReflectionAnalysis(reflectionContent, emotion);
  }
  
  try {
    const model = getGeminiModel();
    if (!model) throw new Error('Gemini 모델을 초기화할 수 없습니다.');
    
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
    return getMockReflectionAnalysis(reflectionContent, emotion);
  }
}

/**
 * 성찰 데이터 기반으로 최적화된 일정을 추천합니다.
 * @param reflections 사용자의 성찰 데이터 배열
 * @param existingEvents 기존 일정 데이터 배열
 * @returns 추천 일정 객체 배열
 */
export async function generateScheduleRecommendations(reflections: unknown[], existingEvents: unknown[]) {
  // 모의 응답 사용 또는 API 키가 없는 경우
  if (useMockResponses || !genAI) {
    console.log('모의 일정 추천 사용');
    return getMockScheduleRecommendations();
  }
  
  try {
    const model = getGeminiModel();
    if (!model) throw new Error('Gemini 모델을 초기화할 수 없습니다.');
    
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
    return getMockScheduleRecommendations();
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

// 모의 성찰 분석 결과 생성
function getMockReflectionAnalysis(content: string, emotion: string) {
  const summaries = [
    "최근 새로운 도전에 대한 기대와 불안이 공존하고 있습니다.",
    "대인관계에서 소통의 중요성을 인식하고 있습니다.",
    "일과 삶의 균형을 찾는 과정에서 긍정적인 변화가 나타나고 있습니다."
  ];
  
  const insightsList = [
    ["새로운 경험에 대한 열린 태도가 긍정적인 결과로 이어지고 있습니다.", "계획적인 접근보다 유연한 대처가 더 효과적임을 발견했습니다.", "자기 시간 확보의 중요성을 인식하고 있습니다."],
    ["타인의 관점을 이해하려는 노력이 관계 개선에 도움이 됩니다.", "명확한 의사 표현이 오해를 줄이는 데 중요합니다.", "갈등 상황에서 감정 조절의 중요성을 경험했습니다."],
    ["규칙적인 운동이 전반적인 웰빙에 긍정적인 영향을 줍니다.", "업무 시간과 휴식 시간의 명확한 구분이 생산성을 높입니다.", "취미 활동이 스트레스 해소에 효과적입니다."]
  ];
  
  const emotionalPatterns = [
    "긍정적인 감정과 부정적인 감정 사이의 균형을 찾아가고 있습니다. 새로운 상황에서는 불안감이 먼저 나타나지만, 점차 자신감으로 전환되는 패턴이 관찰됩니다.",
    "대인관계에서 발생하는 갈등이 주요 스트레스 요인이며, 이에 대한 해결책을 찾으려는 노력이 계속되고 있습니다.",
    "혼자만의 시간을 통해 안정감을 찾고, 이를 기반으로 외부 활동에 에너지를 투입하는 사이클이 형성되고 있습니다."
  ];
  
  const recommendedActionsList = [
    ["매일 15분씩 명상하기", "주간 목표 설정 및 진행 상황 기록하기", "새로운 취미 활동 시작하기"],
    ["어려운 대화를 피하지 않고 직접 소통하기", "감사 일기 작성하기", "주변 사람들에게 피드백 요청하기"],
    ["규칙적인 운동 루틴 만들기", "디지털 디톡스 시간 설정하기", "자신에게 보상 주기"]
  ];
  
  // 감정에 따른 인덱스 결정
  let index = 0;
  if (emotion === '슬픔' || emotion === '화남' || emotion === '불안') {
    index = 1;
  } else if (emotion === '평온' || emotion === '만족') {
    index = 2;
  }
  
  // 내용 길이에 따른 요약 세부 조정
  const contentLength = content.length;
  const insightCount = contentLength > 100 ? 3 : (contentLength > 50 ? 2 : 1);
  
  return {
    summary: summaries[index],
    keyInsights: insightsList[index].slice(0, insightCount),
    emotionalPatterns: emotionalPatterns[index],
    recommendedActions: recommendedActionsList[index].slice(0, insightCount + 1)
  };
}

// 모의 일정 추천 생성
function getMockScheduleRecommendations() {
  const today = new Date();
  
  const formatDate = (daysToAdd: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
  };
  
  return [
    {
      title: "아침 명상 시간",
      date: formatDate(1),
      startTime: "07:30",
      endTime: "08:00",
      category: "정신건강",
      reasoning: "최근 성찰 기록에서 스트레스 증가 패턴이 관찰되었습니다. 아침 명상은 하루를 차분하게 시작하고 집중력을 높이는 데 도움이 될 것입니다."
    },
    {
      title: "30분 조깅",
      date: formatDate(2),
      startTime: "18:00",
      endTime: "18:30",
      category: "건강",
      reasoning: "규칙적인 운동이 기분 개선에 효과적이라는 패턴이 성찰 데이터에서 확인되었습니다. 퇴근 후 가벼운 조깅은 신체 건강과 정신 건강에 모두 도움이 됩니다."
    },
    {
      title: "독서 시간",
      date: formatDate(3),
      startTime: "21:00",
      endTime: "22:00",
      category: "자기계발",
      reasoning: "취침 전 스크린 시간을 줄이고 독서를 통해 마음을 편안하게 하는 시간이 수면의 질을 개선하는 데 도움이 됩니다. 성찰 기록에서 양질의 수면과 다음 날 기분 사이의 상관관계가 발견되었습니다."
    }
  ];
}