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

/**
 * Gemini를 사용하여 한 번에 제목과 날짜를 추출
 * @param text 입력 문장
 * @returns { title: string, deadline?: Date }
 */
export async function extractTitleAndDate(text: string): Promise<{ title: string, deadline?: Date }> {
  if (!genAI) return { title: text };
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `아래 문장에서 일정 제목과 날짜를 각각 한 줄로 추출해줘.\n- 제목: (한 줄 요약)\n- 날짜: (YYYY-MM-DD 또는 YYYY-MM-DD HH:mm 형식, 없으면 '없음')\n문장: ${text}\n결과:`;
    const result = await model.generateContent(prompt);
    const lines = result.response.text().split('\n').map(l => l.trim());
    let title = text, deadline: Date | undefined = undefined;
    for (const line of lines) {
      if (line.startsWith('제목:')) title = line.replace('제목:', '').trim();
      if (line.startsWith('날짜:')) {
        const dateStr = line.replace('날짜:', '').trim();
        if (dateStr && dateStr !== '없음') {
          const d = new Date(dateStr);
          if (!isNaN(d.getTime())) deadline = d;
        }
      }
    }
    return { title, deadline };
  } catch {
    return { title: text };
  }
}
