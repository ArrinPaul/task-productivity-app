import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TaskService } from '../../../services/task.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-monthly-performance',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, MatCardModule, MatIconModule],
  templateUrl: './monthly-performance.component.html',
  styleUrls: ['./monthly-performance.component.scss']
})
export class MonthlyPerformanceComponent implements OnInit {
  monthlyPerformanceData: any[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      const monthlyData = this.calculateMonthlyPerformance(tasks);
      this.monthlyPerformanceData = monthlyData;
    });
  }

  calculateMonthlyPerformance(tasks: any[]): any[] {
    // This is a mock implementation. A real implementation would involve more complex logic.
    const data = [
      { name: 'Jan', value: 50 },
      { name: 'Feb', value: 60 },
      { name: 'Mar', value: 55 },
      { name: 'Apr', value: 70 }
    ];
    return data;
  }
}
