import { NextRequest, NextResponse } from 'next/server';
import { addDays } from 'date-fns';
import { CalendarEvent } from '@/app/types/calendar';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 추천 일정 타입 명시
interface Recommendation {
  id: string;
  title: string;
  date: Date | string;
  startTime: string;
  endTime: string;
  category: string;
  reasoning: string;
  accepted: boolean;
}

// 임시 더미 추천 데이터
const generateDummyRecommendations = (): Recommendation[] => [
  {
    id: Date.now().toString() + '1',
    title: '운동: 30분 조깅',
    date: addDays(new Date(), 1),
    startTime: '08:00',
    endTime: '08:30',
    category: '건강',
    reasoning: '최근 성찰 기록에서 운동 후 긍정적인 기분 변화가 관찰되었습니다. 아침 조깅이 하루를 활기차게 시작하는 데 도움을 줄 것으로 예상됩니다.',
    accepted: false,
  },
  {
    id: Date.now().toString() + '2',
    title: '독서 시간',
    date: addDays(new Date(), 2),
    startTime: '20:00',
    endTime: '21:00',
    category: '자기계발',
    reasoning: '저녁 시간 독서가 수면의 질을 향상시키는데 도움이 된다는 성찰 기록이 있습니다. 규칙적인 독서 습관 형성을 위해 추천합니다.',
    accepted: false,
  },
  {
    id: Date.now().toString() + '3',
    title: '명상 연습',
    date: addDays(new Date(), 3),
    startTime: '07:30',
    endTime: '07:45',
    category: '정신건강',
    reasoning: '높은 스트레스를 언급한 성찰 기록이 있습니다. 짧은 아침 명상이 하루 중 스트레스 관리에 도움을 줄 수 있습니다.',
    accepted: false,
  },
];

// Gemini API를 이용한 추천 생성 함수
async function generateAIRecommendations(
  reflections: object[],
  existingEvents: object[]
): Promise<Recommendation[]> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
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
        "reasoning": "이 활동을 추천하는 이유",
        "accepted": false
      }
    ]
  `;
  const result = await model.generateContent(prompt);
  const response = result.response;
  const responseText = await response.text();
  try {
    const recommendations: Recommendation[] = JSON.parse(responseText);
    return recommendations;
  } catch (error) {
    console.error('Failed to parse Gemini API response:', error);
    throw new Error('AI 추천 생성 중 오류가 발생했습니다.');
  }
}

// GET: AI 추천 일정 가져오기
export async function GET() {
  try {
    // 실제 데이터베이스 연동 필요시 아래 부분 구현
    const reflections: object[] = [];
    const existingEvents: object[] = [];
    const recommendations = await generateAIRecommendations(reflections, existingEvents);
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    const recommendations = generateDummyRecommendations();
    return NextResponse.json(recommendations);
  }
}

// POST: 추천 일정 수락하기
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id || !body.recommendation) {
      return NextResponse.json(
        { error: '추천 ID와 추천 데이터는 필수입니다.' },
        { status: 400 }
      );
    }
    const recommendation = body.recommendation as Recommendation;
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: recommendation.title,
      date: new Date(recommendation.date),
      startTime: recommendation.startTime,
      endTime: recommendation.endTime,
      category: recommendation.category,
      isRecommended: true,
    };
    return NextResponse.json({
      success: true,
      event: newEvent,
    });
  } catch (error) {
    console.error('Error accepting recommendation:', error);
    return NextResponse.json(
      { error: '추천 수락 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}