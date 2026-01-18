import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TaskService } from '../../../services/task.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-weekly-performance',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, MatCardModule, MatIconModule],
  templateUrl: './weekly-performance.component.html',
  styleUrls: ['./weekly-performance.component.scss']
})
export class WeeklyPerformanceComponent implements OnInit {
  weeklyPerformanceData: any[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      const weeklyData = this.calculateWeeklyPerformance(tasks);
      this.weeklyPerformanceData = weeklyData;
    });
  }

  calculateWeeklyPerformance(tasks: any[]): any[] {
    // This is a mock implementation. A real implementation would involve more complex logic.
    const data = [
      { name: 'Week 1', value: 10 },
      { name: 'Week 2', value: 15 },
      { name: 'Week 3', value: 12 },
      { name: 'Week 4', value: 18 }
    ];
    return data;
  }
}
