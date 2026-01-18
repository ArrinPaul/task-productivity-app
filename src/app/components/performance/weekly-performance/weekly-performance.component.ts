import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PerformanceService } from '../../../services/performance.service';
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
  dailyPerformanceData: any[] = [];
  
  // Chart configuration
  view: [number, number] = [700, 300];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Week';
  showYAxisLabel = true;
  yAxisLabel = 'Tasks Completed';
  colorScheme: any = {
    domain: ['#4f46e5', '#818cf8', '#a5b4fc', '#c7d2fe']
  };

  constructor(private performanceService: PerformanceService) {}

  ngOnInit(): void {
    this.loadWeeklyPerformance();
    this.loadDailyPerformance();
  }

  private loadWeeklyPerformance(): void {
    this.performanceService.getWeeklyPerformance().subscribe(data => {
      this.weeklyPerformanceData = data;
    });
  }

  private loadDailyPerformance(): void {
    this.performanceService.getDailyPerformance().subscribe(data => {
      this.dailyPerformanceData = data;
    });
  }
}
