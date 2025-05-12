import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function summarizeTelegramMessage(text: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const prompt = `\n  다음 텔레그램 메시지를 분석하고 JSON으로 요약:\n  "${text}"\n\n  {\n    "title": "간결한 제목",\n    "suggestedDate": "YYYY-MM-DD 또는 null",\n    "confidence": 0~1 신뢰도",\n    "summary": "핵심요약"\n  }\n  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const textResult = response.text();

  try {
    return JSON.parse(textResult);
  } catch {
    return { title: '제목 추출 실패', suggestedDate: null, confidence: 0, summary: '' };
  }
}
