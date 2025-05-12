import { NextResponse } from 'next/server';
import { summarizeTelegramMessage } from '../../../lib/gemini';
import { createTask, updateTask, deleteTask, getTasks } from '../../../lib/database';
import { sendTelegramMessage, sendMainMenu, sendTaskRegistrationPrompt, sendTaskDetailMenu, sendTaskListMenu } from '../../../lib/telegram';
import type { Task } from '../../../lib/types';

// 간단한 in-memory 유저 상태 관리 (배포 전에는 redis 등으로 대체 권장)
const userState: Record<string, { step: 'idle'|'reg_title'|'reg_desc'|'reg_deadline', regData: Partial<Task> }> = {};

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
      userState[userId] = { step: 'reg_desc', regData: { title: callback_query.message.text, type: taskType } };
      await sendTaskRegistrationPrompt(chatId, 'desc');
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
      await sendTaskListMenu(chatId, tasks);
      return NextResponse.json({ ok: true });
    }
    if (text === '/start' || text === '시작') {
      await sendMainMenu(chatId);
      userState[userId] = { step: 'idle', regData: {} };
      return NextResponse.json({ ok: true });
    }
    if (text === '일정 등록') {
      userState[userId] = { step: 'reg_title', regData: {} };
      await sendTaskRegistrationPrompt(chatId, 'title');
      return NextResponse.json({ ok: true });
    }
    const state = userState[userId];
    if (state && state.step.startsWith('reg_')) {
      if (state.step === 'reg_title') {
        state.regData.title = text;
        state.step = 'reg_desc';
        await sendTaskRegistrationPrompt(chatId, 'desc');
        return NextResponse.json({ ok: true });
      } else if (state.step === 'reg_desc') {
        state.regData.description = (text === '없음' ? '' : text);
        state.step = 'reg_deadline';
        await sendTaskRegistrationPrompt(chatId, 'deadline');
        return NextResponse.json({ ok: true });
      } else if (state.step === 'reg_deadline') {
        if (text !== '없음') {
          const date = new Date(text);
          if (!isNaN(date.getTime())) {
            state.regData.deadline = date;
          } else {
            await sendTelegramMessage(chatId, '날짜 형식이 올바르지 않습니다. (예: 2025-05-13)');
            return NextResponse.json({ ok: true });
          }
        }
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
        await sendTelegramMessage(chatId, `${typeLabel}이(가) 성공적으로 등록되었습니다!`);
        await sendTaskDetailMenu(chatId, task);
        userState[userId] = { step: 'idle', regData: {} };
        return NextResponse.json({ ok: true });
      }
    }
    const summary = await summarizeTelegramMessage(text);
    if (summary && summary.date) {
      // 날짜가 추출되면 확인 UI (TODO)
    }
    return NextResponse.json({ ok: true });
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
