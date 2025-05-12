import { Task } from './types';
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
function fromDbTask(row: any): Task {
  return {
    id: row.id.toString(),
    title: row.title,
    description: row.description,
    type: row.type,
    status: row.status,
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(),
    deadline: row.deadline ? new Date(row.deadline) : undefined,
    frequency: row.frequency || undefined,
    investmentDetails: row.investment_details ? JSON.parse(row.investment_details) : undefined,
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
