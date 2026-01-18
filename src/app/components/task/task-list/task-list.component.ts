import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../services/task.service';
import { Task, TaskStatus } from '../../../models/task.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

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
    MatInputModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  categories: Category[] = [];
  selectedStatus: TaskStatus = 'all';
  selectedCategory = 'all';
  searchTerm = '';

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.filterTasks();
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
        this.taskService.deleteTask(taskId).subscribe(() => {
          this.tasks = this.tasks.filter(task => task.id !== taskId);
          this.filterTasks();
        });
      }
    });
  }

  toggleCompletion(task: Task, completed: boolean, event?: any): void {
    if (event) {
      event.stopPropagation();
    }
    const updatedTask = { ...task, completed };
    this.taskService.updateTask(updatedTask).subscribe(() => {
      const taskIndex = this.tasks.findIndex(t => t.id === task.id);
      if (taskIndex > -1) {
        this.tasks[taskIndex] = updatedTask;
        this.filterTasks();
      }
    });
  }

  filterTasks(): void {
    let tempTasks = this.tasks;

    if (this.selectedStatus === 'pending') {
      tempTasks = tempTasks.filter(task => !task.completed);
    } else if (this.selectedStatus === 'completed') {
      tempTasks = tempTasks.filter(task => task.completed);
    } else if (this.selectedStatus === 'overdue') {
      tempTasks = tempTasks.filter(task => !task.completed && new Date(task.dueDate) < new Date());
    }

    if (this.selectedCategory !== 'all') {
      tempTasks = tempTasks.filter(task => task.category === this.selectedCategory);
    }

    if (this.searchTerm) {
      tempTasks = tempTasks.filter(task =>
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredTasks = tempTasks;
  }

  onFilterChange(status: TaskStatus): void {
    this.selectedStatus = status;
    this.filterTasks();
  }

  onCategoryChange(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.filterTasks();
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filterTasks();
  }
}
