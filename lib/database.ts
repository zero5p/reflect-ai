import { Task, TaskType, TaskStatus } from './types';
import { query } from '../app/lib/db';

// Helper: camelCase <-> snake_case
function toDbTask(task: Partial<Task>): Record<string, unknown> {
  return {
    title: task.title,
    description: task.description,
    type: task.type,
    status: task.status,
    deadline: task.deadline ? new Date(task.deadline) : null,
    frequency: task.frequency,
    investment_details: task.investmentDetails ? JSON.stringify(task.investmentDetails) : null,
  };
}
function fromDbTask(row: Record<string, unknown>): Task {
  const assertString = (value: unknown): string => {
    if (typeof value !== 'string') throw new Error(`Expected string, got ${typeof value}`);
    return value;
  };

  const assertOptionalString = (value: unknown): string | undefined => {
    return value === null || value === undefined ? undefined : assertString(value);
  };

  const assertDate = (value: unknown): Date | undefined => {
    return value ? new Date(assertString(value)) : undefined;
  };

  return {
    id: assertString(row.id),
    title: assertString(row.title),
    description: assertOptionalString(row.description),
    type: assertString(row.type) as TaskType,
    status: assertString(row.status) as TaskStatus,
    createdAt: assertDate(row.created_at) || new Date(),
    updatedAt: assertDate(row.updated_at) || new Date(),
    deadline: assertDate(row.deadline),
    frequency: row.frequency === 'daily' ? 'daily' : undefined,
    investmentDetails: row.investment_details ? JSON.parse(assertString(row.investment_details)) : undefined,
  };
}

export async function createTask(task: Partial<Task>): Promise<Task> {
  const dbTask = toDbTask(task);
  const cols = Object.keys(dbTask).filter(k => dbTask[k] !== undefined);
  const vals = cols.map(k => dbTask[k]);
  const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
  const sql = `INSERT INTO schedules (${cols.join(', ')}) VALUES (${placeholders}) RETURNING *`;
  const result = await query(sql, vals);
  return fromDbTask(result.rows[0]);
}

export async function getTasks(filter?: Partial<Task>): Promise<Task[]> {
  let sql = 'SELECT * FROM schedules';
  let vals: unknown[] = [];
  if (filter && Object.keys(filter).length > 0) {
    const dbFilter = toDbTask(filter);
    const cols = Object.keys(dbFilter).filter(k => dbFilter[k] !== undefined);
    if (cols.length > 0) {
      const conds = cols.map((k, i) => `${k} = $${i + 1}`);
      sql += ' WHERE ' + conds.join(' AND ');
      vals = cols.map(k => dbFilter[k]);
    }
  }
  sql += ' ORDER BY created_at DESC';
  const result = await query(sql, vals);
  return result.rows.map(fromDbTask);
}

export async function updateTask(id: string, patch: Partial<Task>): Promise<void> {
  const dbTask = toDbTask(patch);
  const cols = Object.keys(dbTask).filter(k => dbTask[k] !== undefined);
  if (cols.length === 0) return;
  const sets = cols.map((k, i) => `${k} = $${i + 1}`);
  const vals = cols.map(k => dbTask[k]);
  vals.push(id);
  const sql = `UPDATE schedules SET ${sets.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${vals.length}`;
  await query(sql, vals);
}

export async function deleteTask(id: string): Promise<void> {
  await query('DELETE FROM schedules WHERE id = $1', [id]);
}
