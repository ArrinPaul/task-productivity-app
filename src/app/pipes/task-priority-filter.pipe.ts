import { Pipe, PipeTransform } from '@angular/core';
import { Task, TaskPriority } from '../models/task.model';

@Pipe({
  name: 'taskPriorityFilter',
  standalone: true
})
export class TaskPriorityFilterPipe implements PipeTransform {
  transform(tasks: Task[] | null, priority: TaskPriority | 'all'): Task[] {
    if (!tasks) {
      return [];
    }

    if (!priority || priority === 'all') {
      return tasks;
    }

    return tasks.filter(task => task.priority === priority);
  }
}
