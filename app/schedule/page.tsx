"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Sparkles, Calendar, List, Activity, BookText } from "lucide-react";
import AIScheduleRecommendations from "@/app/components/AIScheduleRecommendations";
import { useState } from "react";

export default function SchedulePage() {
  // 샘플 템플릿 데이터
  const scheduleTemplates = [
    {
      id: "1",
      title: "집중력 최적화 일정",
      description:
        "집중력이 필요한 작업을 오전에 배치하고, 오후에는 협업과 가벼운 작업을 배치합니다.",
      items: [
        { time: "09:00 - 11:30", description: "집중 작업 시간 (회의 없음)" },
        { time: "11:30 - 12:30", description: "점심 식사 및 가벼운 산책" },
        { time: "12:30 - 15:00", description: "회의 및 협업 시간" },
        { time: "15:00 - 16:00", description: "휴식 및 명상" },
        { time: "16:00 - 18:00", description: "가벼운 작업 및 마무리" },
      ],
    },
    {
      id: "2",
      title: "창의성 향상 일정",
      description: "창의적인 사고를 촉진하기 위한 일정 구성입니다.",
      items: [
        { time: "09:00 - 10:00", description: "아침 명상 및 일기 쓰기" },
        { time: "10:00 - 12:00", description: "창의적 작업 시간" },
        { time: "12:00 - 13:30", description: "점심 식사 및 자연 속 산책" },
        { time: "13:30 - 15:30", description: "협업 및 피드백 시간" },
        {
          time: "15:30 - 18:00",
          description: "자유 시간 (독서, 학습, 가벼운 작업)",
        },
      ],
    },
    {
      id: "3",
      title: "웰빙 중심 일정",
      description: "정신적, 신체적 건강에 초점을 맞춘 일정입니다.",
      items: [
        { time: "07:30 - 08:30", description: "아침 운동 (요가 또는 조깅)" },
        { time: "09:00 - 12:00", description: "업무 집중 시간" },
        { time: "12:00 - 13:00", description: "건강한 점심 식사" },
        { time: "13:00 - 13:30", description: "짧은 낮잠 또는 명상" },
        { time: "13:30 - 17:00", description: "업무 및 회의" },
        { time: "17:30 - 18:30", description: "저녁 운동 또는 취미 활동" },
      ],
    },
  ];

  // 과거 성찰 데이터 기반 인사이트 (샘플 데이터)
  const insights = [
    {
      id: "1",
      title: "집중력 패턴",
      description:
        "오전 9시부터 11시까지 집중력이 가장 높은 것으로 확인되었습니다. 중요한 작업은 이 시간대에 배치하는 것이 좋습니다.",
      category: "생산성",
      icon: <Activity className="h-5 w-5 text-indigo-600" />,
    },
    {
      id: "2",
      title: "스트레스 요인",
      description:
        "연속된 회의가 있는 날에 스트레스 수준이 높아지는 경향이 있습니다. 회의 사이에 짧은 휴식을 포함하는 것이 좋습니다.",
      category: "웰빙",
      icon: <BookText className="h-5 w-5 text-purple-600" />,
    },
    {
      id: "3",
      title: "수면 패턴",
      description:
        "취침 전 1시간 동안 스크린 사용을 줄이고 독서를 한 날에는 수면의 질이 향상되었습니다.",
      category: "건강",
      icon: <Activity className="h-5 w-5 text-blue-600" />,
    },
  ];

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleAddSchedule = (title: string) => {
    setToastMsg(`'${title}' 일정이 내 일정에 추가되었습니다!`);
    setTimeout(() => setToastMsg(null), 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">일정 최적화</h1>

      <Tabs defaultValue="recommendations">
        <TabsList className="grid grid-cols-3 bg-gray-100 rounded-lg mb-6">
          <TabsTrigger value="recommendations" className="flex items-center">
            <Sparkles className="h-4 w-4 mr-2" />
            AI 추천
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            템플릿
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center">
            <List className="h-4 w-4 mr-2" />
            인사이트
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations">
          <div className="mb-6 p-4 bg-white rounded-xl shadow border border-gray-100">
            <h1 className="text-2xl font-bold mb-2 text-indigo-700">AI가 추천하는 오늘의 일정</h1>
            <p className="text-gray-600 text-sm">AI가 당신의 성찰 데이터를 분석해 맞춤 일정을 추천합니다. 원하는 템플릿을 바로 내 일정에 추가해보세요!</p>
          </div>
          <AIScheduleRecommendations />
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {scheduleTemplates.map((template) => (
              <div key={template.id} className="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col">
                <h2 className="text-lg font-semibold mb-2 text-indigo-600">{template.title}</h2>
                <p className="text-gray-700 mb-3">{template.description}</p>
                <ul className="mb-4 space-y-1 text-sm text-gray-600">
                  {template.items.map((item, idx) => (
                    <li key={idx}>• <span className="font-medium">{item.time}</span> {item.description}</li>
                  ))}
                </ul>
                <button className="mt-auto px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors" onClick={() => handleAddSchedule(template.title)}>내 일정에 추가</button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-indigo-700">AI 인사이트</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight) => (
                <div key={insight.id} className="bg-white rounded-xl shadow border border-gray-100 p-5 flex items-start">
                  <div className="mr-4">{insight.icon}</div>
                  <div>
                    <div className="font-semibold text-indigo-600 mb-1">{insight.title}</div>
                    <div className="text-gray-700 text-sm mb-1">{insight.description}</div>
                    <span className="text-xs text-gray-400">카테고리: {insight.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {toastMsg && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fadeIn">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
