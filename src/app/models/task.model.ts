export interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  priority: 'Low' | 'Medium' | 'High';
  dueDate: Date;
  completed: boolean;
  createdDate: Date;
  completedDate?: Date;
}

export type TaskPriority = 'Low' | 'Medium' | 'High';

export type TaskStatus = 'all' | 'pending' | 'completed' | 'overdue';
