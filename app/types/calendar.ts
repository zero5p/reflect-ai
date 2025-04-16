// 일정 이벤트 타입 정의
export interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    startTime?: string; // HH:MM 형식
    endTime?: string; // HH:MM 형식
    category?: string;
    reflectionId?: string; // 관련 성찰 ID (있는 경우)
    isRecommended?: boolean; // AI 추천 여부
  }
  
  // 성찰 타입 정의
  export interface Reflection {
    id: string;
    date: Date;
    title: string;
    content: string;
    mood: string; // 감정 상태
    tags: string[]; // 관련 태그
    reminderDates?: Date[]; // 간격 반복 알림 날짜들
  }