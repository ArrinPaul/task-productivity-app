import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PerformanceService } from '../../../services/performance.service';
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
  productivityByCategoryData: any[] = [];
  productivityByPriorityData: any[] = [];
  
  // Chart configuration
  view: [number, number] = [700, 300];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Month';
  showYAxisLabel = true;
  yAxisLabel = 'Tasks Completed';
  colorScheme = {
    domain: ['#4f46e5', '#818cf8', '#a5b4fc', '#c7d2fe', '#6366f1', '#4338ca']
  };

  constructor(private performanceService: PerformanceService) {}

  ngOnInit(): void {
    this.loadMonthlyPerformance();
    this.loadProductivityByCategory();
    this.loadProductivityByPriority();
  }

  private loadMonthlyPerformance(): void {
    this.performanceService.getMonthlyPerformance().subscribe(data => {
      this.monthlyPerformanceData = data;
    });
  }

  private loadProductivityByCategory(): void {
    this.performanceService.getProductivityByCategory().subscribe(data => {
      this.productivityByCategoryData = data;
    });
  }

  private loadProductivityByPriority(): void {
    this.performanceService.getProductivityByPriority().subscribe(data => {
      this.productivityByPriorityData = data;
    });
  }
}
