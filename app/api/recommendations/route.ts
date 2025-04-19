import { NextRequest, NextResponse } from 'next/server';
import { addDays } from 'date-fns';
import { CalendarEvent } from '@/app/types/calendar';
import { query } from '@/app/lib/db';

// 임시 더미 추천 데이터 (실제로는 AI 모델이 생성)
const generateDummyRecommendations = () => {
  return [
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
};

// GET: AI 추천 일정 가져오기
export async function GET() {
  try {
    // 실제로는 여기서 Gemini API를 사용하여 사용자의 성찰 및 일정 데이터를 분석해
    // 개인화된 추천을 생성할 예정입니다.
    
    // 임시: 더미 데이터 반환
    const recommendations = generateDummyRecommendations();
    
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: '추천 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 추천 일정 수락하기
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 필수 필드 검증
    if (!body.id || !body.recommendation) {
      return NextResponse.json(
        { error: '추천 ID와 추천 데이터는 필수입니다.' },
        { status: 400 }
      );
    }
    
    // 수락된 추천 일정을 실제 일정으로 변환
    // 실제로는 아래 코드가 데이터베이스에 새 일정을 추가합니다.
    const recommendation = body.recommendation;
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: recommendation.title,
      date: new Date(recommendation.date),
      startTime: recommendation.startTime,
      endTime: recommendation.endTime,
      category: recommendation.category,
      isRecommended: true, // AI 추천 일정임을 표시
    };
    
    // 임시 응답 (실제로는 데이터베이스에 저장한 후 반환)
    return NextResponse.json({ 
      success: true,
      event: newEvent
    });
  } catch (error) {
    console.error('Error accepting recommendation:', error);
    return NextResponse.json(
      { error: '추천 수락 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: AI 일정 추천 요청
export async function POST_AI() {
  try {
    // 최근 성찰 데이터 가져오기
    const reflectionsResult = await query(
      'SELECT * FROM reflections ORDER BY created_at DESC LIMIT 10'
    );
    
    // 변수를 실제로 사용하도록 수정
    const reflectionCount = reflectionsResult.rows.length;
    console.log(`Found ${reflectionCount} reflections for analysis`);
    
    // 여기에 실제 Gemini API 호출 코드가 들어갑니다
    // 지금은 모의 데이터를 반환합니다
    
    const recommendedSchedule = {
      title: '집중력 최적화 일정',
      description: '최근 성찰 기록 분석 결과, 오전 시간에 집중력이 높고 오후 3시 이후에는 피로감을 자주 느끼는 패턴이 발견되었습니다.',
      items: [
        { startTime: '09:00', endTime: '11:30', description: '집중 작업 시간 (회의 없음)' },
        { startTime: '11:30', endTime: '12:30', description: '점심 식사 및 가벼운 산책' },
        { startTime: '12:30', endTime: '15:00', description: '회의 및 협업 시간' },
        { startTime: '15:00', endTime: '16:00', description: '휴식 및 명상' },
        { startTime: '16:00', endTime: '18:00', description: '가벼운 작업 및 마무리' }
      ]
    };
    
    return NextResponse.json(recommendedSchedule);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: '일정 추천에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 나중에 Gemini API를 사용하여 AI 추천 생성하는 함수
// 지금은 임시 더미 데이터를 사용하지만, 아래와 같은 함수를 구현할 예정
/*
async function generateAIRecommendations(reflections, existingEvents) {
  // Gemini API 클라이언트 설정
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // 프롬프트 구성
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
      }
    ]
  `;

  // Gemini API 호출
  const result = await model.generateContent(prompt);
  const response = result.response;
  const responseText = response.text();
  
  // JSON 파싱 및 반환
  try {
    const recommendations = JSON.parse(responseText);
    return recommendations;
  } catch (error) {
    console.error('Failed to parse Gemini API response:', error);
    throw new Error('AI 추천 생성 중 오류가 발생했습니다.');
  }
}
*/