export interface MockEvent {
  id: string;
  title: string;
  date: string; // yyyy-mm-dd
  description: string;
}

export const mockEvents: MockEvent[] = [
  {
    id: "e1",
    title: "AI 미팅",
    date: "2025-04-24",
    description: "AI 프로젝트 킥오프 미팅 (오전 10시)",
  },
  {
    id: "e2",
    title: "운동",
    date: "2025-04-24",
    description: "저녁 헬스장 방문 (오후 7시)",
  },
  {
    id: "e3",
    title: "스터디",
    date: "2025-04-23",
    description: "리액트 스터디 모임 (오후 8시)",
  },
];
