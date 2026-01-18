import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';

export interface PerformanceData {
  name: string;
  value: number;
}

export interface PerformanceStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
  avgTasksPerDay: number;
  avgTasksPerWeek: number;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {

  constructor(private taskService: TaskService) {}

  /**
   * Calculate weekly performance based on task completion dates
   * Returns data for the last 4 weeks
   */
  getWeeklyPerformance(): Observable<PerformanceData[]> {
    return this.taskService.getTasks().pipe(
      map(tasks => {
        const now = new Date();
        const weeklyData: { [key: string]: number } = {};
        
        // Initialize last 4 weeks
        for (let i = 3; i >= 0; i--) {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - (now.getDay() + 7 * i));
          weekStart.setHours(0, 0, 0, 0);
          
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          weekEnd.setHours(23, 59, 59, 999);
          
          const weekLabel = this.getWeekLabel(weekStart);
          weeklyData[weekLabel] = 0;
        }
        
        // Count completed tasks by week
        tasks.forEach(task => {
          if (task.completed && task.completedDate) {
            const completedDate = new Date(task.completedDate);
            const weekLabel = this.getWeekLabel(completedDate);
            
            if (weeklyData.hasOwnProperty(weekLabel)) {
              weeklyData[weekLabel]++;
            }
          }
        });
        
        return Object.keys(weeklyData).map(key => ({
          name: key,
          value: weeklyData[key]
        }));
      })
    );
  }

  /**
   * Calculate monthly performance based on task completion dates
   * Returns data for the last 6 months
   */
  getMonthlyPerformance(): Observable<PerformanceData[]> {
    return this.taskService.getTasks().pipe(
      map(tasks => {
        const now = new Date();
        const monthlyData: { [key: string]: number } = {};
        
        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
          const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthLabel = this.getMonthLabel(month);
          monthlyData[monthLabel] = 0;
        }
        
        // Count completed tasks by month
        tasks.forEach(task => {
          if (task.completed && task.completedDate) {
            const completedDate = new Date(task.completedDate);
            const monthLabel = this.getMonthLabel(completedDate);
            
            if (monthlyData.hasOwnProperty(monthLabel)) {
              monthlyData[monthLabel]++;
            }
          }
        });
        
        return Object.keys(monthlyData).map(key => ({
          name: key,
          value: monthlyData[key]
        }));
      })
    );
  }

  /**
   * Calculate daily performance for the current week
   */
  getDailyPerformance(): Observable<PerformanceData[]> {
    return this.taskService.getTasks().pipe(
      map(tasks => {
        const now = new Date();
        const dailyData: { [key: string]: number } = {};
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Initialize current week
        const currentDayOfWeek = now.getDay();
        for (let i = 0; i <= currentDayOfWeek; i++) {
          const day = new Date(now);
          day.setDate(now.getDate() - (currentDayOfWeek - i));
          const dayLabel = days[day.getDay()];
          dailyData[dayLabel] = 0;
        }
        
        // Count completed tasks by day
        tasks.forEach(task => {
          if (task.completed && task.completedDate) {
            const completedDate = new Date(task.completedDate);
            
            // Check if task was completed this week
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - currentDayOfWeek);
            weekStart.setHours(0, 0, 0, 0);
            
            if (completedDate >= weekStart) {
              const dayLabel = days[completedDate.getDay()];
              if (dailyData.hasOwnProperty(dayLabel)) {
                dailyData[dayLabel]++;
              }
            }
          }
        });
        
        return Object.keys(dailyData).map(key => ({
          name: key,
          value: dailyData[key]
        }));
      })
    );
  }

  /**
   * Get overall performance statistics
   */
  getPerformanceStats(): Observable<PerformanceStats> {
    return this.taskService.getTasks().pipe(
      map(tasks => {
        const now = new Date();
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completed).length;
        const pendingTasks = tasks.filter(t => !t.completed).length;
        const overdueTasks = tasks.filter(t => !t.completed && new Date(t.dueDate) < now).length;
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        
        // Calculate average tasks per day (last 30 days)
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        const tasksLast30Days = tasks.filter(t => 
          t.completedDate && new Date(t.completedDate) >= thirtyDaysAgo
        ).length;
        const avgTasksPerDay = tasksLast30Days / 30;
        
        // Calculate average tasks per week (last 12 weeks)
        const twelveWeeksAgo = new Date(now);
        twelveWeeksAgo.setDate(now.getDate() - 84);
        const tasksLast12Weeks = tasks.filter(t => 
          t.completedDate && new Date(t.completedDate) >= twelveWeeksAgo
        ).length;
        const avgTasksPerWeek = tasksLast12Weeks / 12;
        
        return {
          totalTasks,
          completedTasks,
          pendingTasks,
          overdueTasks,
          completionRate: Math.round(completionRate),
          avgTasksPerDay: parseFloat(avgTasksPerDay.toFixed(2)),
          avgTasksPerWeek: parseFloat(avgTasksPerWeek.toFixed(2))
        };
      })
    );
  }

  /**
   * Get completion trend (comparing current period to previous)
   */
  getCompletionTrend(): Observable<{ current: number; previous: number; trend: 'up' | 'down' | 'same' }> {
    return this.taskService.getTasks().pipe(
      map(tasks => {
        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        const sixtyDaysAgo = new Date(now);
        sixtyDaysAgo.setDate(now.getDate() - 60);
        
        const currentPeriod = tasks.filter(t => 
          t.completedDate && 
          new Date(t.completedDate) >= thirtyDaysAgo &&
          new Date(t.completedDate) <= now
        ).length;
        
        const previousPeriod = tasks.filter(t => 
          t.completedDate && 
          new Date(t.completedDate) >= sixtyDaysAgo &&
          new Date(t.completedDate) < thirtyDaysAgo
        ).length;
        
        let trend: 'up' | 'down' | 'same' = 'same';
        if (currentPeriod > previousPeriod) trend = 'up';
        else if (currentPeriod < previousPeriod) trend = 'down';
        
        return { current: currentPeriod, previous: previousPeriod, trend };
      })
    );
  }

  /**
   * Get productivity by category
   */
  getProductivityByCategory(): Observable<PerformanceData[]> {
    return this.taskService.getTasks().pipe(
      map(tasks => {
        const categoryData: { [key: string]: number } = {};
        
        tasks.forEach(task => {
          if (task.completed) {
            const category = task.category || 'Uncategorized';
            categoryData[category] = (categoryData[category] || 0) + 1;
          }
        });
        
        return Object.keys(categoryData).map(key => ({
          name: key,
          value: categoryData[key]
        }));
      })
    );
  }

  /**
   * Get productivity by priority
   */
  getProductivityByPriority(): Observable<PerformanceData[]> {
    return this.taskService.getTasks().pipe(
      map(tasks => {
        const priorityData = {
          'High': 0,
          'Medium': 0,
          'Low': 0
        };
        
        tasks.forEach(task => {
          if (task.completed) {
            priorityData[task.priority]++;
          }
        });
        
        return Object.keys(priorityData).map(key => ({
          name: key,
          value: priorityData[key as 'High' | 'Medium' | 'Low']
        }));
      })
    );
  }

  // Helper methods
  private getWeekLabel(date: Date): string {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const month = weekStart.toLocaleString('default', { month: 'short' });
    const day = weekStart.getDate();
    return `${month} ${day}`;
  }

  private getMonthLabel(date: Date): string {
    return date.toLocaleString('default', { month: 'short' });
  }
}
