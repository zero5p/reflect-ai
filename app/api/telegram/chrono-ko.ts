import * as chrono from 'chrono-node';

// 한국어 자연어 날짜 문자열을 Date 객체로 파싱
export function parseKoDate(text: string): Date | undefined {
  // 1. 한글 자연어 우선 파싱
  // @ts-expect-error: chrono.ko는 타입 선언에 없음
  const koDate = (chrono as any).ko.parseDate(text, new Date(), { forwardDate: true });
  if (koDate) return koDate;
  // 2. YYYY-MM-DD 등 표준 포맷 fallback
  const isoDate = Date.parse(text);
  if (!isNaN(isoDate)) return new Date(isoDate);
  return undefined;
}
