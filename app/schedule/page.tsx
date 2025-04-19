'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Sparkles, Calendar, List, Activity, BookText } from 'lucide-react';
import AIScheduleRecommendations from '@/app/components/AIScheduleRecommendations';

export default function SchedulePage() {
  // 샘플 템플릿 데이터
  const scheduleTemplates = [
    {
      id: '1',
      title: '집중력 최적화 일정',
      description: '집중력이 필요한 작업을 오전에 배치하고, 오후에는 협업과 가벼운 작업을 배치합니다.',
      items: [
        { time: '09:00 - 11:30', description: '집중 작업 시간 (회의 없음)' },
        { time: '11:30 - 12:30', description: '점심 식사 및 가벼운 산책' },
        { time: '12:30 - 15:00', description: '회의 및 협업 시간' },
        { time: '15:00 - 16:00', description: '휴식 및 명상' },
        { time: '16:00 - 18:00', description: '가벼운 작업 및 마무리' }
      ]
    },
    {
      id: '2',
      title: '창의성 향상 일정',
      description: '창의적인 사고를 촉진하기 위한 일정 구성입니다.',
      items: [
        { time: '09:00 - 10:00', description: '아침 명상 및 일기 쓰기' },
        { time: '10:00 - 12:00', description: '창의적 작업 시간' },
        { time: '12:00 - 13:30', description: '점심 식사 및 자연 속 산책' },
        { time: '13:30 - 15:30', description: '협업 및 피드백 시간' },
        { time: '15:30 - 18:00', description: '자유 시간 (독서, 학습, 가벼운 작업)' }
      ]
    },
    {
      id: '3',
      title: '웰빙 중심 일정',
      description: '정신적, 신체적 건강에 초점을 맞춘 일정입니다.',
      items: [
        { time: '07:30 - 08:30', description: '아침 운동 (요가 또는 조깅)' },
        { time: '09:00 - 12:00', description: '업무 집중 시간' },
        { time: '12:00 - 13:00', description: '건강한 점심 식사' },
        { time: '13:00 - 13:30', description: '짧은 낮잠 또는 명상' },
        { time: '13:30 - 17:00', description: '업무 및 회의' },
        { time: '17:30 - 18:30', description: '저녁 운동 또는 취미 활동' }
      ]
    }
  ];

  // 과거 성찰 데이터 기반 인사이트 (샘플 데이터)
  const insights = [
    {
      id: '1',
      title: '집중력 패턴',
      description: '오전 9시부터 11시까지 집중력이 가장 높은 것으로 확인되었습니다. 중요한 작업은 이 시간대에 배치하는 것이 좋습니다.',
      category: '생산성',
      icon: <Activity className="h-5 w-5 text-indigo-600" />
    },
    {
      id: '2',
      title: '스트레스 요인',
      description: '연속된 회의가 있는 날에 스트레스 수준이 높아지는 경향이 있습니다. 회의 사이에 짧은 휴식을 포함하는 것이 좋습니다.',
      category: '웰빙',
      icon: <BookText className="h-5 w-5 text-purple-600" />
    },
    {
      id: '3',
      title: '수면 패턴',
      description: '취침 전 1시간 동안 스크린 사용을 줄이고 독서를 한 날에는 수면의 질이 향상되었습니다.',
      category: '건강',
      icon: <Activity className="h-5 w-5 text-blue-600" />
    }
  ];

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
          <AIScheduleRecommendations />
        </TabsContent>
        
        <TabsContent value="templates">
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">일정 템플릿</h2>
              <p className="text-gray-600 mb-4">
                자주 사용하는 일정 패턴을 템플릿으로 저장하고 필요할 때 적용할 수 있습니다.
                다음은 AI가 추천하는 기본 템플릿입니다.
              </p>
              
              <div className="space-y-4 mt-6">
                {scheduleTemplates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-lg">{template.title}</h3>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        적용하기
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                    <div className="space-y-2">
                      {template.items.map((item, index) => (
                        <div key={index} className="flex text-sm">
                          <span className="w-28 text-gray-500 flex-shrink-0">{item.time}</span>
                          <span className="text-gray-700">{item.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="insights">
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">성찰 기반 인사이트</h2>
              <p className="text-gray-600 mb-4">
                AI가 분석한 과거 성찰 데이터를 기반으로 생성된 인사이트입니다.
                이를 참고하여 일정을 최적화할 수 있습니다.
              </p>
              
              <div className="grid gap-4 mt-6">
                {insights.map((insight) => (
                  <div key={insight.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <div className="bg-white p-2 rounded-lg shadow-sm mr-3">
                        {insight.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{insight.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{insight.description}</p>
                        <div className="mt-2">
                          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            {insight.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}