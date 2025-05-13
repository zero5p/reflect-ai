import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENAI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * 입력 텍스트를 한 줄 요약(제목)으로 생성 (Google Generative AI)
 * 실패 시 원본 텍스트 반환
 */
export async function summarizeToTitle(text: string): Promise<string> {
  if (!genAI) return text;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `다음 내용을 한 줄짜리 일정 제목으로 요약해줘.\n내용: ${text}\n제목:`;
    const result = await model.generateContent(prompt);
    const summary = result.response.text().trim();
    // 한 줄만 추출
    return summary.split("\n")[0].replace(/^[-•*\d.\s]+/, "").slice(0, 50) || text;
  } catch {
    return text;
  }
}
