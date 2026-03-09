import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../models/task.model';

@Pipe({
  name: 'taskCategoryFilter',
  standalone: true
})
export class TaskCategoryFilterPipe implements PipeTransform {
  transform(tasks: Task[] | null, category: string): Task[] {
    if (!tasks) {
      return [];
    }

    if (!category || category === 'all') {
      return tasks;
    }

    return tasks.filter(task => task.category === category);
  }
}
