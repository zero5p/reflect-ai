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
import Button from "@/app/components/ui/Button";
import Card from "@/app/components/ui/Card";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import FloatingActionButton from "../components/ui/FloatingActionButton";

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
    <div className="flex flex-col gap-8 max-w-3xl mx-auto px-4 pb-28">
      {/* 상단 요약/액션 섹션 */}
      <Card color="mint" rounded shadow className="flex items-center gap-6 p-8 relative overflow-hidden">
        <CalendarDays className="w-12 h-12 text-white opacity-80" />
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow">일정 최적화</h1>
          <p className="text-white/90 mb-2 md:text-lg">계획을 세우고, 하루를 더 가볍게!</p>
        </div>
      </Card>

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
          <Card color="white" rounded shadow className="mb-6 p-6">
            <h1 className="text-2xl font-bold mb-2 text-indigo-700">AI가 추천하는 오늘의 일정</h1>
            <p className="text-gray-600 text-sm">AI가 당신의 성찰 데이터를 분석해 맞춤 일정을 추천합니다. 원하는 템플릿을 바로 내 일정에 추가해보세요!</p>
          </Card>
          <AIScheduleRecommendations />
        </TabsContent>

        <TabsContent value="templates">
          <Card color="white" rounded shadow className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">일정 템플릿</h2>
            {scheduleTemplates.length === 0 ? (
              <div className="text-gray-400 text-center py-6 border-2 border-dashed border-gray-100 rounded-lg">
                템플릿이 없습니다.<br />
                <Button color="mint" size="md" asChild>
                  <Link href="/schedule/new">첫 템플릿 추가하기</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {scheduleTemplates.map((template) => (
                  <Card key={template.id} color="mint" rounded shadow className="flex flex-col gap-4 px-4 py-3">
                    <h2 className="text-lg font-semibold mb-2 text-gray-900">{template.title}</h2>
                    <p className="text-gray-700 mb-3">{template.description}</p>
                    <ul className="mb-4 space-y-1 text-sm text-gray-600">
                      {template.items.map((item, idx) => (
                        <li key={idx}>• <span className="font-medium">{item.time}</span> {item.description}</li>
                      ))}
                    </ul>
                    <div className="flex flex-row gap-2">
                      <Button color="secondary" size="sm" asChild>
                        <Link href={`/schedule/${template.id}`}>상세</Link>
                      </Button>
                      <Button color="secondary" size="sm" asChild onClick={() => handleAddSchedule(template.title)}>
                        내 일정에 추가
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card color="white" rounded shadow className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">인사이트</h2>
            {insights.length === 0 ? (
              <div className="text-gray-400 text-center py-6 border-2 border-dashed border-gray-100 rounded-lg">
                인사이트가 없습니다.<br />
                <Button color="mint" size="md" asChild>
                  <Link href="/schedule/new">첫 인사이트 추가하기</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.map((insight) => (
                  <Card key={insight.id} color="mint" rounded shadow className="flex items-start gap-4 px-4 py-3">
                    <div className="mr-4">{insight.icon}</div>
                    <div>
                      <div className="font-semibold text-indigo-600 mb-1">{insight.title}</div>
                      <div className="text-gray-700 text-sm mb-1">{insight.description}</div>
                      <span className="text-xs text-gray-400">카테고리: {insight.category}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {toastMsg && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fadeIn">
          {toastMsg}
        </div>
      )}
      {/* [UI/UX 개선] 플로팅 액션 버튼 */}
      <FloatingActionButton
        href="/schedule/new"
        label="새 일정 추가"
      />
    </div>
  );
}
