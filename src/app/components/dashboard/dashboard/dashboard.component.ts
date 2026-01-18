import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';
import { TaskService } from '../../../services/task.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, NgxChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  totalTasks = 0;
  completedTasks = 0;
  pendingTasks = 0;
  productivityPercentage = 0;
  taskPriorityData: any[] = [];
  taskCategoryData: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private taskService: TaskService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.totalTasks = tasks.length;
      this.completedTasks = tasks.filter(task => task.completed).length;
      this.pendingTasks = this.totalTasks - this.completedTasks;
      this.productivityPercentage = this.totalTasks > 0 ? (this.completedTasks / this.totalTasks) * 100 : 0;

      const highPriorityTasks = tasks.filter(task => task.priority === 'High').length;
      const mediumPriorityTasks = tasks.filter(task => task.priority === 'Medium').length;
      const lowPriorityTasks = tasks.filter(task => task.priority === 'Low').length;

      this.taskPriorityData = [
        { name: 'High', value: highPriorityTasks },
        { name: 'Medium', value: mediumPriorityTasks },
        { name: 'Low', value: lowPriorityTasks }
      ];

      this.categoryService.getCategories().subscribe((categories: Category[]) => {
        this.taskCategoryData = categories.map((category: Category) => {
          return {
            name: category.name,
            value: tasks.filter(task => task.category === category.id.toString()).length
          };
        });
      });
    });
  }
}
