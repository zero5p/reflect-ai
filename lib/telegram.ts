// Node.js 환경에서 fetch가 없을 수 있으므로 polyfill 적용
if (typeof globalThis.fetch !== 'function') {
  import('node-fetch').then(mod => {
    // @ts-expect-error: dynamic import for circular dependency workaround
    globalThis.fetch = mod.default;
  });
}

export async function sendTelegramMessage(chatId: number, text: string, reply_markup?: Record<string, unknown>) {
  const telegramApiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    const res = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, reply_markup }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('[Telegram API Error]', res.status, errText);
    }
  } catch (e) {
    console.error('[Telegram fetch error]', e);
  }
}

export async function sendTaskTypeMenu(chatId: number): Promise<void> {
  await sendTelegramMessage(chatId, '작업 종류를 선택하세요:', {
    inline_keyboard: [
      [{ text: '매일 해야하는 작업', callback_data: 'tasktype:daily' }],
      [{ text: '기한 있는 작업', callback_data: 'tasktype:deadline' }],
      [{ text: '투자 기록', callback_data: 'tasktype:investment' }]
    ]
  });
}

export async function sendDateConfirmation(chatId: number, summary: { title: string; suggestedDate: string | null; confidence: number; }): Promise<void> {
  await sendTelegramMessage(chatId, 
    `제목: ${summary.title}\n날짜: ${summary.suggestedDate || '미확인'}\n신뢰도: ${(summary.confidence * 100).toFixed(0)}%\n\n날짜가 맞습니까?`, 
    {
      inline_keyboard: [
        [{ text: '네, 맞아요', callback_data: `confirm_date:${summary.suggestedDate}` }],
        [{ text: '수정할래요', callback_data: 'edit_date' }]
      ]
    }
  );
}

export async function sendArchiveOrDeleteMenu(chatId: number, taskId: string, taskTitle: string): Promise<void> {
  await sendTelegramMessage(chatId,
    `🗓️ [${taskTitle}] 1개월이 지났습니다. 어떻게 할까요?`,
    {
      inline_keyboard: [
        [{ text: '보관', callback_data: `archive:${taskId}` }],
        [{ text: '삭제', callback_data: `delete:${taskId}` }]
      ]
    }
  );
}

// 일정 목록을 버튼 메뉴로 보여주는 함수 (한글 설명 포함)
import type { Task } from './types';

export async function sendMainMenu(chatId: number): Promise<void> {
  await sendTelegramMessage(chatId, '원하는 작업을 선택하세요!', {
    reply_markup: {
      keyboard: [[{ text: '일정 확인' }, { text: '일정 등록' }]],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
}

export async function sendTaskRegistrationPrompt(chatId: number, step: 'title' | 'desc' | 'deadline'): Promise<void> {
  if (step === 'title') {
    await sendTelegramMessage(chatId, '새 일정의 제목을 입력해 주세요.');
  } else if (step === 'desc') {
    await sendTelegramMessage(chatId, '일정 설명을 입력해 주세요. (선택, 건너뛰려면 "없음" 입력)');
  } else if (step === 'deadline') {
    await sendTelegramMessage(chatId, '기한을 입력해 주세요. (YYYY-MM-DD, 선택, 건너뛰려면 "없음" 입력)');
  }
}

export async function sendTaskDetailMenu(chatId: number, task: Task): Promise<void> {
  await sendTelegramMessage(
    chatId,
    `일정명: ${task.title}\n설명: ${task.description || '없음'}\n유형: ${task.type}\n상태: ${task.status}\n기한: ${task.deadline ? new Date(task.deadline).toLocaleDateString('ko-KR') : '없음'}`,
    {
      inline_keyboard: [
        [
          { text: '✅ 완료', callback_data: `task_complete:${task.id}` },
          { text: '🗑️ 삭제', callback_data: `delete:${task.id}` },
          { text: '✏️ 수정', callback_data: `task_edit:${task.id}` }
        ]
      ]
    }
  );
}

export async function sendTaskListMenu(chatId: number, tasks: Task[]): Promise<void> {
  if (tasks.length === 0) {
    await sendTelegramMessage(chatId, '등록된 일정이 없습니다.');
    return;
  }
  const inline_keyboard = tasks.map((task: Task) => [
    {
      text: `🗓️ ${task.title}${task.deadline ? ` (${task.deadline.toLocaleDateString('ko-KR')})` : ''}`,
      callback_data: `task_detail:${task.id}`
    },
    {
      text: '설명', callback_data: `task_desc:${task.id}`
    }
  ]);
  await sendTelegramMessage(
    chatId,
    '아래 버튼을 눌러 일정을 확인하거나 설명을 볼 수 있습니다.\n\n🗓️ 일정명 (기한)\n설명: 일정에 대한 상세 정보를 확인합니다.',
    { inline_keyboard }
  );
}

