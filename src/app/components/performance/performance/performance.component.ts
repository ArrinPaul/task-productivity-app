import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { WeeklyPerformanceComponent } from '../weekly-performance/weekly-performance.component';
import { MonthlyPerformanceComponent } from '../monthly-performance/monthly-performance.component';
import { PerformanceService, PerformanceStats } from '../../../services/performance.service';

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [
    CommonModule, 
    MatTabsModule, 
    MatCardModule,
    MatIconModule,
    WeeklyPerformanceComponent, 
    MonthlyPerformanceComponent
  ],
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss']
})
export class PerformanceComponent implements OnInit {
  stats: PerformanceStats | null = null;
  trend: { current: number; previous: number; trend: 'up' | 'down' | 'same' } | null = null;

  constructor(private performanceService: PerformanceService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadTrend();
  }

  private loadStats(): void {
    this.performanceService.getPerformanceStats().subscribe(stats => {
      this.stats = stats;
    });
  }

  private loadTrend(): void {
    this.performanceService.getCompletionTrend().subscribe(trend => {
      this.trend = trend;
    });
  }

  getTrendIcon(): string {
    if (!this.trend) return 'trending_flat';
    switch (this.trend.trend) {
      case 'up': return 'trending_up';
      case 'down': return 'trending_down';
      default: return 'trending_flat';
    }
  }

  getTrendClass(): string {
    if (!this.trend) return 'neutral';
    switch (this.trend.trend) {
      case 'up': return 'positive';
      case 'down': return 'negative';
      default: return 'neutral';
    }
  }
}
