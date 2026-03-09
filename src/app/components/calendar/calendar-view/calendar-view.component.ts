import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { CalendarModule, CalendarView, DateAdapter, CalendarEvent } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {
  isSameDay,
  isSameMonth,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatChipsModule,
    CalendarModule
  ],
  providers: [
    {
      provide: DateAdapter,
      useFactory: adapterFactory,
    },
  ],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit, OnDestroy {
  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Month;
  viewDate = new Date();
  selectedDate = new Date();
  activeDayIsOpen = true;
  events: CalendarEvent<{ taskId: number }>[] = [];
  tasks: Task[] = [];
  selectedDateTasks: Task[] = [];
  refresh = new Subject<void>();
  private readonly destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => {
        this.tasks = tasks;
        this.events = tasks.map(task => ({
          start: startOfDay(new Date(task.dueDate)),
          end: endOfDay(new Date(task.dueDate)),
          title: task.title,
          color: this.getEventColor(task),
          allDay: true,
          meta: { taskId: task.id }
        }));
        this.updateSelectedDateTasks();
        this.refresh.next();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setView(view: CalendarView): void {
    this.view = view;
  }

  previousPeriod(): void {
    const date = new Date(this.viewDate);
    if (this.view === CalendarView.Month) {
      date.setMonth(date.getMonth() - 1);
    } else if (this.view === CalendarView.Week) {
      date.setDate(date.getDate() - 7);
    } else {
      date.setDate(date.getDate() - 1);
    }
    this.viewDate = date;
  }

  nextPeriod(): void {
    const date = new Date(this.viewDate);
    if (this.view === CalendarView.Month) {
      date.setMonth(date.getMonth() + 1);
    } else if (this.view === CalendarView.Week) {
      date.setDate(date.getDate() + 7);
    } else {
      date.setDate(date.getDate() + 1);
    }
    this.viewDate = date;
  }

  goToToday(): void {
    this.viewDate = new Date();
    this.selectedDate = new Date();
    this.updateSelectedDateTasks();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
      this.selectedDate = date;
      this.updateSelectedDateTasks();
    }
  }

  handleEventClick(event: CalendarEvent<{ taskId: number }>): void {
    if (event.meta?.taskId) {
      this.router.navigate(['/tasks', event.meta.taskId]);
    }
  }

  openTask(taskId: number): void {
    this.router.navigate(['/tasks', taskId]);
  }

  toggleTaskCompletion(task: Task, checked: boolean): void {
    const updatedTask: Task = {
      ...task,
      completed: checked,
      completedDate: checked ? new Date() : undefined
    };
    this.taskService.updateTask(updatedTask).subscribe();
  }

  private updateSelectedDateTasks(): void {
    this.selectedDateTasks = this.tasks.filter(task => isSameDay(new Date(task.dueDate), this.selectedDate));
  }

  private getEventColor(task: Task): { primary: string; secondary: string } {
    if (task.completed) {
      return { primary: '#0f766e', secondary: '#d7f4ef' };
    }

    if (task.priority === 'High') {
      return { primary: '#b91c1c', secondary: '#fee2e2' };
    }

    if (task.priority === 'Medium') {
      return { primary: '#b45309', secondary: '#fef3c7' };
    }

    return { primary: '#0f766e', secondary: '#ccfbf1' };
  }
}
