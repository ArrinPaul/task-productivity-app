import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  taskId: string | null = null;
  categories: Category[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
      dueDate: ['', [Validators.required, this.futureDateValidator]],
      priority: ['Medium', Validators.required],
      category: ['', Validators.required],
      tags: [[]]
    });
  }

  private futureDateValidator = (control: { value: Date | string | null }): { [key: string]: boolean } | null => {
    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return selectedDate < now ? { pastDate: true } : null;
  };

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    if (this.taskId) {
      this.isEditMode = true;
      this.taskService.getTask(this.taskId).subscribe(task => {
        if (task) {
          this.taskForm.patchValue({
            ...task,
            category: task.category,
            dueDate: new Date(task.dueDate),
            tags: task.tags || []
          });
        }
      });
    }
  }

  add(event: any): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const tags = [...(this.taskForm.get('tags')?.value || [])];
      if (!tags.includes(value.trim())) {
        tags.push(value.trim());
        this.taskForm.get('tags')?.setValue(tags);
      }
    }

    if (input) {
      input.value = '';
    }
  }

  remove(tag: string): void {
    const tags = [...(this.taskForm.get('tags')?.value || [])];
    const index = tags.indexOf(tag);

    if (index >= 0) {
      tags.splice(index, 1);
      this.taskForm.get('tags')?.setValue(tags);
    }
  }

  saveTask(): void {
    if (this.taskForm.valid) {
      const taskData: Task = {
        ...this.taskForm.value,
        id: this.taskId ? parseInt(this.taskId, 10) : 0
      };
      if (this.isEditMode && this.taskId) {
        this.taskService.updateTask(taskData).subscribe(() => {
          this.snackBar.open('Task updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/tasks']);
        });
      } else {
        this.taskService.createTask(taskData).subscribe(() => {
          this.snackBar.open('Task created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/tasks']);
        });
      }
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}