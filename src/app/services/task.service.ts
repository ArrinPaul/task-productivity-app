import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Task, TaskStatus } from '../models/task.model';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';
import { ActivityLogService } from './activity-log.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly STORAGE_KEY = 'tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(
    private storageService: StorageService,
    private notificationService: NotificationService,
    private activityLogService: ActivityLogService
  ) {
    this.loadTasks();
    this.checkOverdueTasks();
    this.checkDueTodayTasks();
    this.escalatePriority();
  }

  // Load tasks from storage
  private loadTasks(): void {
    const tasks = this.storageService.getItem<Task[]>(this.STORAGE_KEY) || [];
    // Convert date strings back to Date objects
    const parsedTasks = tasks.map(task => ({
      ...task,
      dueDate: new Date(task.dueDate),
      createdDate: new Date(task.createdDate),
      completedDate: task.completedDate ? new Date(task.completedDate) : undefined
    }));
    this.tasksSubject.next(parsedTasks);
  }

  // Save tasks to storage
  private saveTasks(tasks: Task[]): void {
    this.storageService.setItem(this.STORAGE_KEY, tasks);
    this.tasksSubject.next(tasks);
  }

  // Get all tasks
  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  // Get tasks by status
  getTasksByStatus(status: TaskStatus): Task[] {
    const tasks = this.tasksSubject.value;
    const now = new Date();

    switch (status) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'pending':
        return tasks.filter(task => !task.completed);
      case 'overdue':
        return tasks.filter(task => !task.completed && new Date(task.dueDate) < now);
      default:
        return tasks;
    }
  }

  // Get task by ID (Observable version for components)
  getTask(id: string | number): Observable<Task | undefined> {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    const task = this.tasksSubject.value.find(t => t.id === numId);
    return of(task);
  }

  // Create new task (Observable version for components)
  createTask(task: Partial<Task>): Observable<Task> {
    const tasks = this.tasksSubject.value;
    const newTask: Task = {
      id: this.generateId(),
      title: task.title || '',
      description: task.description || '',
      category: task.category || '',
      tags: task.tags || [],
      priority: task.priority || 'Medium',
      dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
      completed: false,
      createdDate: new Date()
    };
    this.saveTasks([...tasks, newTask]);
    this.activityLogService.addLog(`Task "${newTask.title}" created.`);
    return of(newTask);
  }

  // Update task (Observable version for components)
  updateTask(task: Task): Observable<Task> {
    const tasks = this.tasksSubject.value;
    const index = tasks.findIndex(t => t.id === task.id);
    
    if (index !== -1) {
      const oldTask = { ...tasks[index] };
      tasks[index] = { ...tasks[index], ...task };
      this.saveTasks([...tasks]);
      this.activityLogService.addLog(`Task "${oldTask.title}" updated.`);
      return of(task);
    }
    return of(task);
  }

  // Update task with ID (internal version)
  private updateTaskById(id: number, updates: Partial<Task>): boolean {
    const tasks = this.tasksSubject.value;
    const index = tasks.findIndex(task => task.id === id);
    
    if (index !== -1) {
      const oldTask = { ...tasks[index] };
      tasks[index] = { ...tasks[index], ...updates };
      this.saveTasks([...tasks]);
      this.activityLogService.addLog(`Task "${oldTask.title}" updated.`);
      return true;
    }
    return false;
  }

  // Toggle task completion
  toggleTaskCompletion(id: number): boolean {
    const tasks = this.tasksSubject.value;
    const index = tasks.findIndex(task => task.id === id);
    
    if (index !== -1) {
      const completed = !tasks[index].completed;
      tasks[index] = {
        ...tasks[index],
        completed,
        completedDate: completed ? new Date() : new Date()
      };
      this.saveTasks([...tasks]);
      this.activityLogService.addLog(`Task "${tasks[index].title}" marked as ${completed ? 'completed' : 'pending'}.`);
      return true;
    }
    return false;
  }

  // Delete task (Observable version for components)
  deleteTask(id: string | number): Observable<boolean> {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    const tasks = this.tasksSubject.value;
    const taskToDelete = tasks.find(task => task.id === numId);
    const filteredTasks = tasks.filter(task => task.id !== numId);
    
    if (filteredTasks.length < tasks.length) {
      this.saveTasks(filteredTasks);
      if (taskToDelete) {
        this.activityLogService.addLog(`Task "${taskToDelete.title}" deleted.`);
      }
      return of(true);
    }
    return of(false);
  }

  // Search tasks
  searchTasks(searchTerm: string): Task[] {
    const tasks = this.tasksSubject.value;
    const term = searchTerm.toLowerCase();
    
    return tasks.filter(task =>
      task.title.toLowerCase().includes(term) ||
      task.description.toLowerCase().includes(term) ||
      task.category.toLowerCase().includes(term) ||
      task.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }

  // Filter tasks by category
  filterByCategory(category: string): Task[] {
    return this.tasksSubject.value.filter(task => task.category === category);
  }

  // Filter tasks by priority
  filterByPriority(priority: string): Task[] {
    return this.tasksSubject.value.filter(task => task.priority === priority);
  }

  // Filter tasks by tags
  filterByTag(tag: string): Task[] {
    return this.tasksSubject.value.filter(task => task.tags.includes(tag));
  }

  // Get all unique tags
  getAllTags(): string[] {
    const tasks = this.tasksSubject.value;
    const tagsSet = new Set<string>();
    tasks.forEach(task => task.tags.forEach(tag => tagsSet.add(tag)));
    return Array.from(tagsSet);
  }

  // Get all unique categories
  getAllCategories(): string[] {
    const tasks = this.tasksSubject.value;
    const categoriesSet = new Set<string>();
    tasks.forEach(task => categoriesSet.add(task.category));
    return Array.from(categoriesSet);
  }

  // Generate unique ID
  private generateId(): number {
    const tasks = this.tasksSubject.value;
    return tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  }

  // Clear all tasks
  clearAllTasks(): void {
    this.saveTasks([]);
  }

  // Export tasks
  exportTasks(): Task[] {
    return this.tasksSubject.value;
  }

  // Import tasks
  importTasks(tasks: Task[]): void {
    this.saveTasks(tasks);
  }

  // Check for overdue tasks
  private checkOverdueTasks(): void {
    const tasks = this.tasksSubject.value;
    const now = new Date();
    const overdueTasks = tasks.filter(task => !task.completed && new Date(task.dueDate) < now);
    if (overdueTasks.length > 0) {
      console.log('Overdue tasks:', overdueTasks);
      overdueTasks.forEach(task => {
        this.notificationService.showError(`Task "${task.title}" is overdue!`);
      });
    }
  }

  // Check for tasks due today
  private checkDueTodayTasks(): void {
    const tasks = this.tasksSubject.value;
    const now = new Date();
    const dueTodayTasks = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return !task.completed &&
        dueDate.getDate() === now.getDate() &&
        dueDate.getMonth() === now.getMonth() &&
        dueDate.getFullYear() === now.getFullYear();
    });
    dueTodayTasks.forEach(task => {
      this.notificationService.showSuccess(`Task "${task.title}" is due today!`);
    });
  }

  // Escalate priority of tasks approaching their deadline
  private escalatePriority(): void {
    const tasks = this.tasksSubject.value;
    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    tasks.forEach(task => {
      if (!task.completed && task.priority !== 'High' && new Date(task.dueDate) < twentyFourHoursFromNow) {
        this.updateTaskById(task.id, { priority: 'High' });
        this.notificationService.showSuccess(`Priority of task "${task.title}" has been escalated to High.`);
      }
    });
  }
}