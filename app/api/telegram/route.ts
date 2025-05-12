import { NextRequest, NextResponse } from 'next/server';
import { summarizeTelegramMessage } from '../../../lib/gemini';
import { createTask, updateTask, deleteTask, getTasks } from '../../../lib/database';
import { sendDateConfirmation, sendTelegramMessage, sendMainMenu, sendTaskRegistrationPrompt, sendTaskDetailMenu } from '../../../lib/telegram';

// 간단한 in-memory 유저 상태 관리 (배포 전에는 redis 등으로 대체 권장)
const userState: Record<string, { step: 'idle'|'reg_title'|'reg_desc'|'reg_deadline', regData: Partial<import('../../../lib/types').Task> }> = {};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { message, callback_query } = body;

  // 콜백 버튼 처리
  if (callback_query) {
    const chatId = callback_query.message.chat.id;
    const userId = String(callback_query.from.id);
    const data = callback_query.data;

    if (data === 'main_menu') {
      await sendMainMenu(chatId);
      userState[userId] = { step: 'idle', regData: {} };
      return NextResponse.json({ ok: true });
    }
    if (data === 'register_from_message') {
      // 최근 입력 메시지를 title로, 이전에 추출된 날짜가 있으면 deadline으로 등록 시작
      userState[userId] = { step: 'reg_desc', regData: { title: callback_query.message.text } };
      await sendTaskRegistrationPrompt(chatId, 'desc');
      return NextResponse.json({ ok: true });
    }
    if (data.startsWith('record_type:')) {
      // 유형 선택 후 등록 플로우 시작
      const type = data.split(':')[1];
      // 한글 유형을 TaskType으로 변환
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
      // 수정 플로우 시작: 제목부터 재입력
      userState[userId] = { step: 'reg_title', regData: { id: data.split(':')[1] } };
      await sendTaskRegistrationPrompt(chatId, 'title');
      return NextResponse.json({ ok: true });
    }
    // 아래는 기존 콜백 처리 계속
    if (data.startsWith('task_detail:')) {
      // 일정 상세정보 보여주기
      const taskId = data.split(':')[1];
      const task = (await getTasks({ id: taskId }))[0];
      if (task) {
        await sendTelegramMessage(chatId, `일정명: ${task.title}\n설명: ${task.description || '없음'}\n유형: ${task.type}\n상태: ${task.status}\n기한: ${task.deadline ? new Date(task.deadline).toLocaleDateString('ko-KR') : '없음'}`);
      } else {
        await sendTelegramMessage(chatId, '해당 일정을 찾을 수 없습니다.');
      }
    } else if (data.startsWith('task_desc:')) {
      // 일정 설명만 한글로 안내
      const taskId = data.split(':')[1];
      const task = (await getTasks({ id: taskId }))[0];
      if (task) {
        await sendTelegramMessage(chatId, `설명: ${task.description || '등록된 설명이 없습니다.'}`);
      } else {
        await sendTelegramMessage(chatId, '해당 일정을 찾을 수 없습니다.');
      }
    } else if (data.startsWith('tasktype:')) {
      // 작업 종류 선택 후 안내
      const type = data.split(':')[1];
      await sendTelegramMessage(chatId, `선택하신 작업 유형: ${type}\n등록할 내용을 입력해 주세요.`);
    } else if (data.startsWith('confirm_date:')) {
      // 날짜 확정 → DB 저장
      const confirmedDate = data.split(':')[1];
      // 실제로는 대화 상태 관리 필요 (여기선 간단히 예시)
      await createTask({ title: '임시제목', type: 'daily', deadline: confirmedDate ? new Date(confirmedDate) : undefined });
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
  }

  // 일반 메시지 처리
  if (message && message.text) {
    const chatId = message.chat.id;
    const userId = String(message.from.id);
    const text = message.text.trim();
    // '/tasks' 또는 '일정 확인' 명령 처리
    if (text === '/tasks' || text === '일정 확인') {
      const tasks = await getTasks();
      // sendTaskListMenu는 한글 설명/버튼 포함

      const { sendTaskListMenu } = await import('../../../lib/telegram');
      await sendTaskListMenu(chatId, tasks);
      return NextResponse.json({ ok: true });
    }
    // '/start' 또는 '시작' 명령 처리: 메인 메뉴 버튼 제공
    if (text === '/start' || text === '시작') {
      await sendMainMenu(chatId);
      userState[userId] = { step: 'idle', regData: {} };
      return NextResponse.json({ ok: true });
    }
    // '일정 등록' 명령 처리: 등록 플로우 시작
    if (text === '일정 등록') {
      userState[userId] = { step: 'reg_title', regData: {} };
      await sendTaskRegistrationPrompt(chatId, 'title');
      return NextResponse.json({ ok: true });
    }
    // 등록 플로우: 단계별 입력 처리
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
        // 신규 등록 vs 수정 분기
        let task;
        if (state.regData.id) {
          await updateTask(state.regData.id, state.regData);
          task = (await getTasks({ id: state.regData.id }))[0];
        } else {
          // 유형이 없으면 기본값은 'deadline'
          if (!state.regData.type) state.regData.type = 'deadline';
          task = await createTask(state.regData);
        }
        // 한글 안내용 타입명 변환
        let typeLabel = '일정';
        if (task.type === 'investment') typeLabel = '투자 기록';
        else if (task.type === 'daily') typeLabel = '메모/기타';
        await sendTelegramMessage(chatId, `${typeLabel}이(가) 성공적으로 등록되었습니다!`);
        await sendTaskDetailMenu(chatId, task);
        userState[userId] = { step: 'idle', regData: {} };
        return NextResponse.json({ ok: true });
      }
    }
    // 일반 채팅 입력: 날짜 추출 시도
    const summary = await summarizeTelegramMessage(text);
    if (summary && summary.date) {
      // 날짜가 추출되면 확인 UI
      await sendDateConfirmation(chatId, summary);
      return NextResponse.json({ ok: true });
    } else {
      // 날짜가 없으면 기록 유형 선택 안내
      await sendTelegramMessage(chatId, '입력하신 내용의 유형을 선택해 주세요.', {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '일정', callback_data: 'record_type:일정' },
              { text: '투자 기록', callback_data: 'record_type:투자' }
            ],
            [
              { text: '메모', callback_data: 'record_type:메모' },
              { text: '기타', callback_data: 'record_type:기타' }
            ],
            [
              { text: '취소', callback_data: 'main_menu' }
            ]
          ]
        }
      });
      return NextResponse.json({ ok: true });
    }
  }

  return NextResponse.json({ ok: true });
}
