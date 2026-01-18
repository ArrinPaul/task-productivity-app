import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CalendarModule, CalendarView, DateAdapter, CalendarEvent } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {
  startOfDay,
  endOfDay,
} from 'date-fns';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, CalendarModule],
  providers: [
    {
      provide: DateAdapter,
      useFactory: adapterFactory,
    },
  ],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.events = tasks.map(task => {
        return {
          start: startOfDay(new Date(task.dueDate)),
          end: endOfDay(new Date(task.dueDate)),
          title: task.title,
          color: {
            primary: '#5D4037', // Using primary brown from palette
            secondary: '#EFEBE9', // Using light brown-grey from palette
          },
        };
      });
    });
  }
}
