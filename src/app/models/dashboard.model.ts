export interface ProductivityStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  productivityPercentage: number;
  tasksCompletedToday: number;
  tasksCompletedThisWeek: number;
  tasksCompletedThisMonth: number;
}

export interface ChartData {
  labels: string[];
  data: number[];
}

export interface DashboardData {
  stats: ProductivityStats;
  weeklyData: ChartData;
  monthlyData: ChartData;
  categoryDistribution: ChartData;
  priorityDistribution: ChartData;
}
