import { Pipe, PipeTransform } from '@angular/core';
import { Task, TaskStatus } from '../models/task.model';

@Pipe({
  name: 'taskStatusFilter',
  standalone: true
})
export class TaskStatusFilterPipe implements PipeTransform {
  transform(tasks: Task[] | null, status: TaskStatus = 'all'): Task[] {
    if (!tasks) {
      return [];
    }

    const now = new Date();
    if (status === 'completed') {
      return tasks.filter(task => task.completed);
    }

    if (status === 'pending') {
      return tasks.filter(task => !task.completed);
    }

    if (status === 'overdue') {
      return tasks.filter(task => !task.completed && new Date(task.dueDate) < now);
    }

    return tasks;
  }
}
