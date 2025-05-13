import * as chrono from 'chrono-node';

// 한국어 자연어 날짜 문자열을 Date 객체로 파싱
export function parseKoDate(text: string): Date | undefined {
  const results = chrono.parse(text, new Date(), { forwardDate: true });
  if (results.length > 0 && results[0].start) {
    return results[0].start.date();
  }
  return undefined;
}
