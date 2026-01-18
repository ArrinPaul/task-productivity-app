import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TaskService } from '../../../services/task.service';
import { CategoryService } from '../../../services/category.service';
import * as Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  isDarkMode = false;

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService
  ) {}

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }

  exportToCsv(): void {
    this.taskService.getTasks().subscribe(tasks => {
      const csv = Papa.unparse(tasks);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'tasks.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  exportToPdf(): void {
    this.taskService.getTasks().subscribe(tasks => {
      const doc = new jsPDF();
      const col = ["ID", "Title", "Priority", "Due Date", "Completed"];
      const rows = tasks.map(task => [task.id, task.title, task.priority, new Date(task.dueDate).toLocaleDateString(), task.completed ? 'Yes' : 'No']);
      
      (doc as any).autoTable({
        head: [col],
        body: rows
      });
      
      doc.save('tasks.pdf');
    });
  }

  backupData(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.categoryService.getCategories().subscribe(categories => {
        const data = {
          tasks,
          categories
        };
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'backup.json');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    });
  }

  restoreData(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = JSON.parse(e.target.result);
        if (data.tasks) {
          this.taskService.importTasks(data.tasks);
        }
        if (data.categories) {
          this.categoryService.importCategories(data.categories);
        }
      };
      reader.readAsText(file);
    }
  }

  openFileInput(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = (event: Event) => this.restoreData(event);
    fileInput.click();
  }
}

