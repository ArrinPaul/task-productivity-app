import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { TaskListComponent } from './components/task/task-list/task-list.component';
import { TaskFormComponent } from './task/task-form/task-form.component';
import { TaskDetailComponent } from './task/task-detail/task-detail.component';
import { CategoryListComponent } from './components/category/category-list/category-list.component';

import { PerformanceComponent } from './components/performance/performance/performance.component';

import { KanbanBoardComponent } from './components/kanban/kanban-board/kanban-board.component';

import { CalendarViewComponent } from './components/calendar/calendar-view/calendar-view.component';

import { SettingsComponent } from './components/settings/settings/settings.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'tasks', 
    component: TaskListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'tasks/completed',
    component: TaskListComponent,
    canActivate: [authGuard],
    data: { status: 'completed' }
  },
  {
    path: 'tasks/new',
    component: TaskFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'tasks/:id',
    component: TaskDetailComponent,
    canActivate: [authGuard]
  },
  {
    path: 'task/:id',
    component: TaskDetailComponent,
    canActivate: [authGuard]
  },
  {
    path: 'tasks/:id/edit',
    component: TaskFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'categories',
    component: CategoryListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'performance',
    component: PerformanceComponent,
    canActivate: [authGuard]
  },
  {
    path: 'kanban',
    component: KanbanBoardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'calendar',
    component: CalendarViewComponent,
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];
