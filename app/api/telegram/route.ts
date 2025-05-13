import { NextResponse } from 'next/server';

import { createTask, updateTask, deleteTask, getTasks } from '../../../lib/database';
import { sendTelegramMessage, sendMainMenu, sendTaskRegistrationPrompt, sendTaskDetailMenu, sendTaskListMenu } from '../../../lib/telegram';
import type { Task } from '../../../lib/types';

import { extractTitleAndDate } from '../../lib/ai-summary';

// 간단한 in-memory 유저 상태 관리 (배포 전에는 redis 등으로 대체 권장)
type UserState = {
  step: 'idle' | 'reg_title' | 'reg_desc' | 'reg_deadline' | 'pick_deadline' | 'confirm_deadline',
  regData: Partial<Task> & {
    candidateDeadline?: Date;
    candidateDates?: Date[];
  }
};
const userState: Record<string, UserState> = {};

type TelegramMessage = {
  chat: { id: number };
  from: { id: number };
  text: string;
  message?: { text: string };
};

type TelegramCallbackQuery = {
  message: { chat: { id: number }; text?: string };
  from: { id: number };
  data: string;
};

async function processCallbackQuery(callback_query: TelegramCallbackQuery) {
  try {
    const chatId = callback_query.message.chat.id;
    const userId = String(callback_query.from.id);
    const data = callback_query.data;

    if (data === 'main_menu') {
      await sendMainMenu(chatId);
      userState[userId] = { step: 'idle', regData: {} };
      return NextResponse.json({ ok: true });
    }
    if (data === 'register_from_message') {
      userState[userId] = { step: 'reg_desc', regData: { title: callback_query.message.text } };
      await sendTaskRegistrationPrompt(chatId, 'desc');
      return NextResponse.json({ ok: true });
    }
    if (data.startsWith('record_type:')) {
      const type = data.split(':')[1];
      let taskType: import('../../../lib/types').TaskType;
      if (type === '일정') taskType = 'deadline';
      else if (type === '투자') taskType = 'investment';
      else taskType = 'daily';
      // 메시지에서 날짜 추출 및 AI 요약 적용
      const text = callback_query.message.text || '';
      // Gemini로 제목/날짜 동시 추출
      const { title, deadline } = await extractTitleAndDate(text);
      userState[userId] = { step: deadline ? 'reg_desc' : 'reg_deadline', regData: { title, type: taskType, deadline } };
      await sendTelegramMessage(chatId, `선택하신 유형: ${type}\n제목: ${title}${deadline ? `\n날짜: ${deadline.toLocaleDateString('ko-KR')}` : ''}\n설명을 입력해 주세요.`);
      return NextResponse.json({ ok: true });
    }
    if (data.startsWith('task_complete:')) {
      const taskId = data.split(':')[1];
      await updateTask(taskId, { status: 'completed' });
      await sendTelegramMessage(chatId, '일정이 완료 처리되었습니다!');
      return NextResponse.json({ ok: true });
    }
    if (data.startsWith('task_edit:')) {
      userState[userId] = { step: 'reg_title', regData: { id: data.split(':')[1] } };
      await sendTaskRegistrationPrompt(chatId, 'title');
      return NextResponse.json({ ok: true });
    }
    if (data.startsWith('pick_date:')) {
      // 날짜 선택 콜백
      const pickedDateStr = data.split(':')[1];
      const pickedDate = new Date(pickedDateStr);
      if (!isNaN(pickedDate.getTime())) {
        userState[userId].regData.deadline = pickedDate;
        // 등록 완료 처리 (기존 reg_deadline과 동일)
        let task;
        if (userState[userId].regData.id) {
          await updateTask(userState[userId].regData.id, userState[userId].regData);
          task = (await getTasks({ id: userState[userId].regData.id }))[0];
        } else {
          if (!userState[userId].regData.type) userState[userId].regData.type = 'deadline';
          task = await createTask(userState[userId].regData);
        }
        let typeLabel = '일정';
        if (task.type === 'investment') typeLabel = '투자 기록';
        else if (task.type === 'daily') typeLabel = '메모/기타';
        await sendTelegramMessage(chatId, `${typeLabel}이(가) 성공적으로 등록되었습니다!\n\n제목: ${task.title}\n설명: ${task.description || '없음'}\n날짜: ${task.deadline ? new Date(task.deadline).toLocaleDateString('ko-KR') : '없음'}`);
        await sendTaskDetailMenu(chatId, task);
        userState[userId] = { step: 'idle', regData: {} };
        return NextResponse.json({ ok: true });
      } else {
        await sendTelegramMessage(chatId, '날짜 형식이 올바르지 않습니다. 다시 시도해 주세요.');
        return NextResponse.json({ ok: true });
      }
    }
    if (data.startsWith('confirm_date:')) {
      // 날짜 확인 콜백
      const answer = data.split(':')[1];
      if (answer === 'yes') {
        if (userState[userId].regData.candidateDeadline) {
          userState[userId].regData.deadline = userState[userId].regData.candidateDeadline;
        }
        // 등록 완료 처리 (기존 reg_deadline과 동일)
        let task;
        if (userState[userId].regData.id) {
          await updateTask(userState[userId].regData.id, userState[userId].regData);
          task = (await getTasks({ id: userState[userId].regData.id }))[0];
        } else {
          if (!userState[userId].regData.type) userState[userId].regData.type = 'deadline';
          task = await createTask(userState[userId].regData);
        }
        let typeLabel = '일정';
        if (task.type === 'investment') typeLabel = '투자 기록';
        else if (task.type === 'daily') typeLabel = '메모/기타';
        await sendTelegramMessage(chatId, `${typeLabel}이(가) 성공적으로 등록되었습니다!\n\n제목: ${task.title}\n설명: ${task.description || '없음'}\n날짜: ${task.deadline ? new Date(task.deadline).toLocaleDateString('ko-KR') : '없음'}`);
        await sendTaskDetailMenu(chatId, task);
        userState[userId] = { step: 'idle', regData: {} };
        return NextResponse.json({ ok: true });
      } else {
        // 아니오: 날짜 재입력 유도
        userState[userId].step = 'reg_deadline';
        await sendTelegramMessage(chatId, '날짜를 다시 입력해 주세요. (예: 내일, 2025-05-13, 다음주 금요일, 없음)');
        return NextResponse.json({ ok: true });
      }
    }
    if (data.startsWith('task_detail:')) {
      const taskId = data.split(':')[1];
      const task = (await getTasks({ id: taskId }))[0];
      if (task) {
        await sendTelegramMessage(chatId, `일정명: ${task.title}\n설명: ${task.description || '없음'}\n유형: ${task.type}\n상태: ${task.status}\n기한: ${task.deadline ? new Date(task.deadline).toLocaleDateString('ko-KR') : '없음'}`);
      } else {
        await sendTelegramMessage(chatId, '해당 일정을 찾을 수 없습니다.');
      }
    } else if (data.startsWith('task_desc:')) {
      const taskId = data.split(':')[1];
      const task = (await getTasks({ id: taskId }))[0];
      if (task) {
        await sendTelegramMessage(chatId, `설명: ${task.description || '등록된 설명이 없습니다.'}`);
      } else {
        await sendTelegramMessage(chatId, '해당 일정을 찾을 수 없습니다.');
      }
    } else if (data.startsWith('tasktype:')) {
      const type = data.split(':')[1];
      await sendTelegramMessage(chatId, `선택하신 작업 유형: ${type}\n등록할 내용을 입력해 주세요.`);
    } else if (data.startsWith('confirm_date:')) {
      const confirmedDate = data.split(':')[1];
      await createTask({ title: '임시제목', type: 'daily', deadline: confirmedDate ? new Date(confirmedDate as string) : undefined });
      await sendTelegramMessage(chatId, '일정이 등록되었습니다!');
    } else if (data === 'edit_date') {
      await sendTelegramMessage(chatId, '새로운 날짜를 입력해 주세요.');
    } else if (data.startsWith('archive:')) {
      const taskId = data.split(':')[1];
      await updateTask(taskId, { status: 'archived' });
      await sendTelegramMessage(chatId, '작업이 보관되었습니다.');
    } else if (data.startsWith('delete:')) {
      const taskId = data.split(':')[1];
      await deleteTask(taskId);
      await sendTelegramMessage(chatId, '작업이 삭제되었습니다.');
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram Callback Query Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function processMessage(message: TelegramMessage) {
  try {
    const chatId = message.chat.id;
    const userId = String(message.from.id);
    const text = message.text.trim();

    if (text === '/tasks' || text === '일정 확인') {
      const tasks = await getTasks();
      // 제목+날짜 보이도록 sendTaskListMenu 개선 필요 (함수 내부에서 처리 가정)
      await sendTaskListMenu(chatId, tasks);
      return NextResponse.json({ ok: true });
    }
    if (text === '/start' || text === '시작') {
      await sendMainMenu(chatId);
      userState[userId] = { step: 'idle', regData: {} };
      return NextResponse.json({ ok: true });
    }
    if (text === '/addtask' || text === '일정 등록') {
      userState[userId] = { step: 'reg_title', regData: { type: 'deadline' } };
      await sendTelegramMessage(chatId, '새 일정을 등록합니다. 일정 제목을 입력해 주세요.');
      return NextResponse.json({ ok: true });
    }
    if (text === '/addinvestment' || text === '투자 등록') {
      userState[userId] = { step: 'reg_title', regData: { type: 'investment' } };
      await sendTelegramMessage(chatId, '새 투자 기록을 등록합니다. 투자 내역의 제목을 입력해 주세요.');
      return NextResponse.json({ ok: true });
    }
    if (text === '/help' || text === '도움말') {
      await sendTelegramMessage(chatId,
        `사용 가능한 명령어:\n` +
        `/tasks - 등록된 일정/투자/메모 확인\n` +
        `/addtask - 새 일정 등록\n` +
        `/addinvestment - 새 투자 기록 등록\n` +
        `/help - 도움말 보기`);
      return NextResponse.json({ ok: true });
    }
    const state = userState[userId];
    if (state && state.step.startsWith('reg_')) {
      if (state.step === 'reg_title') {
        // Gemini로 제목/날짜 동시 추출
        const { title, deadline } = await extractTitleAndDate(text);
        state.regData.title = title;
        if (deadline) {
          state.regData.candidateDeadline = deadline;
        }
        state.step = 'reg_desc';
        await sendTaskRegistrationPrompt(chatId, 'desc');
        return NextResponse.json({ ok: true });
      } else if (state.step === 'reg_desc') {
        state.regData.description = (text === '없음' ? '' : text);
        state.step = 'reg_deadline';
        await sendTelegramMessage(chatId, '날짜를 입력해 주세요. (예: 내일, 2025-05-13, 다음주 금요일, 없음)');
        return NextResponse.json({ ok: true });
      } else if (state.step === 'reg_deadline') {
        if (text !== '없음') {
          // Gemini로 날짜 추출만 시도
          const { deadline } = await extractTitleAndDate(text);
          if (!deadline) {
            await sendTelegramMessage(chatId, '날짜를 인식할 수 없습니다. 예: 내일, 2025-05-13, 다음주 금요일');
            return NextResponse.json({ ok: true });
          }
          userState[userId].regData.candidateDeadline = deadline;
          userState[userId].step = 'confirm_deadline';
          await sendTelegramMessage(chatId, `이 날짜(${deadline.toLocaleDateString('ko-KR')})가 맞나요?`, {
            inline_keyboard: [
              [
                { text: '네', callback_data: `confirm_date:yes` },
                { text: '아니오', callback_data: `confirm_date:no` }
              ]
            ]
          });
          return NextResponse.json({ ok: true });
        }
        // '없음' 입력 시 기존대로 진행
        state.regData.deadline = undefined;
        let task;
        if (state.regData.id) {
          await updateTask(state.regData.id, state.regData);
          task = (await getTasks({ id: state.regData.id }))[0];
        } else {
          if (!state.regData.type) state.regData.type = 'deadline';
          task = await createTask(state.regData);
        }
        let typeLabel = '일정';
        if (task.type === 'investment') typeLabel = '투자 기록';
        else if (task.type === 'daily') typeLabel = '메모/기타';
        await sendTelegramMessage(chatId, `${typeLabel}이(가) 성공적으로 등록되었습니다!\n\n제목: ${task.title}\n설명: ${task.description || '없음'}\n날짜: ${task.deadline ? new Date(task.deadline).toLocaleDateString('ko-KR') : '없음'}`);
        await sendTaskDetailMenu(chatId, task);
        userState[userId] = { step: 'idle', regData: {} };
        return NextResponse.json({ ok: true });
      }
    }
    // 명령어(/로 시작) 입력 시에는 인라인 메뉴를 띄우지 않고 명령어만 처리
    if (text.startsWith('/')) {
      // 명령어 처리 로직은 기존대로 (예: /tasks 등)
      // 인라인 메뉴 띄우지 않음
      // (아래 일반 메시지 플로우로 빠지지 않게 반드시 return)
      return NextResponse.json({ ok: true });
    }
    // 명령어/등록 플로우가 아닌 일반 메시지는 무조건 인라인 메뉴 노출
    await sendTelegramMessage(
      chatId,
      `이 메시지를 어디에 등록할까요?\n"${text}"`,
      {
        inline_keyboard: [
          [
            { text: '일정에 등록', callback_data: `record_type:일정` },
            { text: '투자기록에 등록', callback_data: `record_type:투자` },
            { text: '기타메모', callback_data: `record_type:기타` }
          ]
        ]
      }
    );
    return NextResponse.json({ ok: true });
    // (참고) chrono-node 한국어 자연어 인식 적용 예시:
    // import * as chrono from 'chrono-node';
    // const results = chrono.ko.parse(text);
    // if (results.length > 0) { const date = results[0].start.date(); ... }

  } catch (messageError) {
    console.error('Telegram Message Processing Error:', messageError);
    return NextResponse.json({ error: 'Message Processing Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Telegram Webhook: Full Body', JSON.stringify(body, null, 2));
    if (body.callback_query) {
      return await processCallbackQuery(body.callback_query);
    } else if (body.message) {
      return await processMessage(body.message);
    } else {
      return NextResponse.json({ error: 'Invalid Request Body' }, { status: 400 });
    }
  } catch (error) {
    console.error('Telegram Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
