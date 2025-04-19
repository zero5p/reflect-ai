export interface Reflection {
  id: string;
  content: string;
  emotion: string;
  createdAt: string;
}

export const mockReflections: Reflection[] = [
  {
    id: "1",
    content: "오늘은 프로젝트를 시작했다. 새로운 도전에 대한 기대감이 크다.",
    emotion: "기쁨",
    createdAt: "2023-06-15T14:30:00Z",
  },
  {
    id: "2",
    content:
      "팀 미팅에서 의견 충돌이 있었다. 내 주장을 더 명확히 설명했어야 했는데.",
    emotion: "화남",
    createdAt: "2023-06-13T18:20:00Z",
  },
  {
    id: "3",
    content:
      "오랜만에 친구를 만나서 좋은 시간을 보냈다. 일상에서 벗어나는 시간이 필요했다.",
    emotion: "평온",
    createdAt: "2023-06-10T20:15:00Z",
  },
  {
    id: "4",
    content: "다가오는 발표가 걱정된다. 더 많은 준비가 필요할 것 같다.",
    emotion: "불안",
    createdAt: "2023-06-08T09:45:00Z",
  },
];
