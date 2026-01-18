import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { WeeklyPerformanceComponent } from '../weekly-performance/weekly-performance.component';
import { MonthlyPerformanceComponent } from '../monthly-performance/monthly-performance.component';

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [CommonModule, MatTabsModule, WeeklyPerformanceComponent, MonthlyPerformanceComponent],
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss']
})
export class PerformanceComponent {

}
