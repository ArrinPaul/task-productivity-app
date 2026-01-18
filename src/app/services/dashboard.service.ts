import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';
import { ProductivityStats, DashboardData, ChartData } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private taskService: TaskService) { }

  // Get productivity statistics
  getProductivityStats(): Observable<ProductivityStats> {
    return this.taskService.getTasks().pipe(
      map(tasks => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completed).length;
        const pendingTasks = tasks.filter(t => !t.completed).length;
        const overdueTasks = tasks.filter(t => !t.completed && new Date(t.dueDate) < now).length;
        
        const tasksCompletedToday = tasks.filter(t => 
          t.completed && t.completedDate && new Date(t.completedDate) >= today
        ).length;
        
        const tasksCompletedThisWeek = tasks.filter(t => 
          t.completed && t.completedDate && new Date(t.completedDate) >= weekAgo
        ).length;
        
        const tasksCompletedThisMonth = tasks.filter(t => 
          t.completed && t.completedDate && new Date(t.completedDate) >= monthAgo
        ).length;

        const productivityPercentage = totalTasks > 0 
          ? Math.round((completedTasks / totalTasks) * 100) 
          : 0;

        return {
          totalTasks,
          completedTasks,
          pendingTasks,
          overdueTasks,
          productivityPercentage,
          tasksCompletedToday,
          tasksCompletedThisWeek,
          tasksCompletedThisMonth
        };
      })
    );
  }

  // Get weekly completion data
  getWeeklyData(): Observable<ChartData> {
    return this.taskService.getTasks().pipe(
      map(tasks => {
        const now = new Date();
        const labels: string[] = [];
        const data: number[] = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 6; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

          const count = tasks.filter(t => 
            t.completed && 
            t.completedDate && 
            new Date(t.completedDate) >= dayStart && 
            new Date(t.completedDate) < dayEnd
          ).length;

          labels.push(days[date.getDay()]);
          data.push(count);
        }

        return { labels, data };
      })
    );
  }

  // Get monthly completion data
  getMonthlyData(): Observable<ChartData> {
    return this.taskService.getTasks().pipe(
      map(tasks => {
        const now = new Date();
        const labels: string[] = [];
        const data: number[] = [];

        for (let i = 11; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 1);

          const count = tasks.filter(t => 
            t.completed && 
            t.completedDate && 
            new Date(t.completedDate) >= monthStart && 
            new Date(t.completedDate) < monthEnd
          ).length;

          labels.push(date.toLocaleString('default', { month: 'short' }));
          data.push(count);
        }

        return { labels, data };
      })
    );
  }

  // Get category distribution
  getCategoryDistribution(): Observable<ChartData> {
    return this.taskService.getTasks().pipe(
      map(tasks => {
        const categoryMap = new Map<string, number>();
        
        tasks.forEach(task => {
          const count = categoryMap.get(task.category) || 0;
          categoryMap.set(task.category, count + 1);
        });

        const labels = Array.from(categoryMap.keys());
        const data = Array.from(categoryMap.values());

        return { labels, data };
      })
    );
  }

  // Get priority distribution
  getPriorityDistribution(): Observable<ChartData> {
    return this.taskService.getTasks().pipe(
      map(tasks => {
        const priorities = ['Low', 'Medium', 'High'];
        const data = priorities.map(priority => 
          tasks.filter(t => t.priority === priority).length
        );

        return { labels: priorities, data };
      })
    );
  }

  // Get complete dashboard data
  getDashboardData(): Observable<DashboardData> {
    return new Observable(observer => {
      const stats$ = this.getProductivityStats();
      const weekly$ = this.getWeeklyData();
      const monthly$ = this.getMonthlyData();
      const category$ = this.getCategoryDistribution();
      const priority$ = this.getPriorityDistribution();

      Promise.all([
        stats$.toPromise(),
        weekly$.toPromise(),
        monthly$.toPromise(),
        category$.toPromise(),
        priority$.toPromise()
      ]).then(([stats, weeklyData, monthlyData, categoryDistribution, priorityDistribution]) => {
        observer.next({
          stats: stats!,
          weeklyData: weeklyData!,
          monthlyData: monthlyData!,
          categoryDistribution: categoryDistribution!,
          priorityDistribution: priorityDistribution!
        });
        observer.complete();
      });
    });
  }
}
