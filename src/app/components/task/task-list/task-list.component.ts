import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../services/task.service';
import { Task, TaskPriority, TaskStatus } from '../../../models/task.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Observable } from 'rxjs';

import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { TaskStatusFilterPipe } from '../../../pipes/task-status-filter.pipe';
import { TaskCategoryFilterPipe } from '../../../pipes/task-category-filter.pipe';
import { TaskPriorityFilterPipe } from '../../../pipes/task-priority-filter.pipe';
import { TaskUrgencyHighlightDirective } from '../../../directives/task-urgency-highlight.directive';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    RouterModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatProgressBarModule,
    TaskStatusFilterPipe,
    TaskCategoryFilterPipe,
    TaskPriorityFilterPipe,
    TaskUrgencyHighlightDirective
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<Task[]>;
  categories: Category[] = [];
  selectedStatus: TaskStatus = 'all';
  selectedCategory = 'all';
  selectedPriority: TaskPriority | 'all' = 'all';
  searchTerm = '';
  displayedColumns: string[] = ['status', 'title', 'category', 'priority', 'dueDate', 'actions'];

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.tasks$ = this.taskService.getTasks();
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (data['status']) {
        this.selectedStatus = data['status'] as TaskStatus;
      }
    });

    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  deleteTask(taskId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Are you sure you want to delete this task?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(taskId).subscribe();
      }
    });
  }

  toggleCompletion(task: Task, completed: boolean, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const updatedTask = { ...task, completed };
    this.taskService.updateTask(updatedTask).subscribe();
  }

  getCompletionPercent(tasks: Task[]): number {
    if (tasks.length === 0) {
      return 0;
    }

    const completedCount = tasks.filter(task => task.completed).length;
    return Math.round((completedCount / tasks.length) * 100);
  }

  applySearch(tasks: Task[]): Task[] {
    if (!this.searchTerm) {
      return tasks;
    }

    const term = this.searchTerm.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(term) ||
      task.description.toLowerCase().includes(term) ||
      task.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }

  onFilterChange(status: TaskStatus): void {
    this.selectedStatus = status;
  }

  onCategoryChange(categoryName: string): void {
    this.selectedCategory = categoryName;
  }

  onPriorityChange(priority: TaskPriority | 'all'): void {
    this.selectedPriority = priority;
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
  }
}
