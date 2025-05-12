export type TaskType = 'daily' | 'deadline' | 'investment';
export type TaskStatus = 'pending' | 'completed' | 'archived';

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
  frequency?: 'daily';
  investmentDetails?: {
    amount: number;
    asset: string;
    notes?: string;
  };
}
