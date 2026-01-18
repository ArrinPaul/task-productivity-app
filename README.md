# Task Management and Productivity Tracker

A comprehensive Angular-based application for managing tasks, tracking productivity, organizing work by categories, and visualizing performance metrics through multiple views including dashboard, kanban board, calendar, and timeline interfaces.

## Overview

This application provides a complete task management solution with advanced features for productivity tracking, performance analytics, and collaborative task organization. It is built with Angular 17 and utilizes modern frontend technologies to deliver a responsive, scalable platform.

## Table of Contents

- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Services](#services)
- [Testing](#testing)
- [Data Models](#data-models)

## System Requirements

- Node.js v18.0.0 or higher
- npm v9.0.0 or higher
- Angular CLI v17.3.17 or higher (optional, can use npx)
- Windows, macOS, or Linux operating system

Verify your Node.js installation:
```bash
node --version
npm --version
```

## Installation

1. Navigate to the project directory:
```bash
cd "d:\Angular Projects\Task Managment and Productivity Tracker\task-productivity-app"
```

2. Install all required dependencies:
```bash
npm install
```

The installation process will download and install all packages specified in package.json.

## Running the Application

### Development Server

Start the development server with hot-reload functionality:

```bash
npm start
```

The application will be available at http://localhost:4200/

The development server monitors file changes and automatically recompiles and refreshes the browser.

### Alternative Commands

```bash
ng serve                           # Standard serve
ng serve --open                    # Automatically open browser
ng serve --port 4300               # Run on custom port
ng serve --configuration production # Production mode locally
```

## Building for Production

### Create Production Build

```bash
npm run build
```

This generates an optimized production build in the dist/ directory.

### Build Configuration

```bash
ng build --configuration production  # Production build with optimizations
ng build --aot                       # Ahead-of-Time compilation
ng build --watch                     # Watch mode for development
```

Production builds include:
- Code minification and obfuscation
- Bundle optimization and tree-shaking
- AOT (Ahead-of-Time) compilation
- Performance optimization

## Project Structure

```
task-productivity-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── login/
│   │   │   ├── dashboard/
│   │   │   ├── task/
│   │   │   │   ├── task-list/
│   │   │   │   ├── task-form/
│   │   │   │   └── task-detail/
│   │   │   ├── category/
│   │   │   │   ├── category-list/
│   │   │   │   └── category-form/
│   │   │   ├── kanban/
│   │   │   │   └── kanban-board/
│   │   │   ├── calendar/
│   │   │   │   └── calendar-view/
│   │   │   ├── timeline/
│   │   │   ├── performance/
│   │   │   │   ├── weekly-performance/
│   │   │   │   ├── monthly-performance/
│   │   │   │   └── performance/
│   │   │   ├── settings/
│   │   │   └── shared/
│   │   │       ├── navbar/
│   │   │       ├── loading-spinner/
│   │   │       └── confirmation-dialog/
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── loading.interceptor.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── task.service.ts
│   │   │   ├── category.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   ├── activity-log.service.ts
│   │   │   ├── notification.service.ts
│   │   │   ├── loading.service.ts
│   │   │   └── storage.service.ts
│   │   ├── models/
│   │   │   ├── task.model.ts
│   │   │   ├── category.model.ts
│   │   │   ├── dashboard.model.ts
│   │   │   └── user.model.ts
│   │   ├── utils/
│   │   ├── app.routes.ts
│   │   ├── app.config.ts
│   │   ├── app.component.ts
│   │   └── app.component.html/scss
│   ├── assets/
│   ├── styles.scss
│   ├── main.ts
│   └── index.html
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── tsconfig.spec.json
```

## Technology Stack

### Frontend Framework
- Angular 17.3.0 - Modern component-based framework with standalone components
- TypeScript 5.4.2 - Statically typed JavaScript

### UI and Material Design
- @angular/material 17.3.10 - Material Design components
- @angular/cdk 17.3.10 - Component development kit

### State Management and Reactive Programming
- RxJS 7.8.0 - Reactive programming library for async operations

### Data Visualization
- @swimlane/ngx-charts 22.0.0 - Chart and graph components
- chart.js 4.5.1 - JavaScript charting library
- angular-calendar 0.31.0 - Calendar component

### Utilities
- date-fns 4.1.0 - Date manipulation and formatting
- papaparse 5.5.3 - CSV parsing and generation
- jsPDF 4.0.0 - PDF generation
- jspdf-autotable 5.0.7 - PDF table formatting

### Development Tools
- Angular CLI 17.3.17 - Command line interface
- Karma 6.4.0 - Test runner
- Jasmine 5.1.0 - Testing framework

## Features

### Core Task Management
- Create, read, update, and delete tasks
- Priority level assignment (Low, Medium, High)
- Task status tracking (Pending, Completed, Overdue)
- Category-based task organization
- Tag system for flexible task classification
- Due date management with deadline tracking

### User Interface Views
- Dashboard with productivity overview and statistics
- Task list view with filtering and sorting capabilities
- Kanban board for visual task workflow management
- Calendar view for deadline visualization
- Timeline view for chronological task tracking
- Performance analytics with weekly and monthly reports

### Security and Authentication
- User login system
- Route protection with auth guards
- Session management
- Secure authentication token handling

### Additional Capabilities
- Real-time notifications
- Activity logging and audit trail
- Customizable user settings
- Data export to CSV and PDF formats
- Responsive design compatible with all devices
- HTTP request interceptor for centralized loading state management

## Architecture

The application follows a modular, component-based architecture using Angular's standalone components pattern. Key architectural principles include:

- Separation of concerns with dedicated services for business logic
- Reactive programming patterns using RxJS observables
- Route-based module organization
- Shared component library for reusable UI elements
- HTTP interceptor pattern for cross-cutting concerns
- Guard-based route protection

## Services

### AuthService
Manages user authentication, login state, and session handling. Responsible for user authentication logic and token management.

### TaskService
Core service for task management operations. Handles task CRUD operations, filtering, searching, and status updates.

### CategoryService
Manages task categories and category assignments. Provides category creation, updates, and retrieval operations.

### DashboardService
Provides dashboard metrics and productivity statistics. Calculates task completion rates and performance indicators.

### NotificationService
Manages user notifications including toast messages, system alerts, and task reminders.

### ActivityLogService
Tracks and maintains audit trail of user activities and task modifications.

### StorageService
Handles local and session storage operations for data persistence.

### LoadingService
Manages global application loading states and loading spinner visibility.

## Testing

### Run Unit Tests
```bash
npm test
```

Executes all unit tests using Karma test runner and Jasmine testing framework.

### Code Coverage
```bash
ng test --code-coverage
```

Generates code coverage report in the coverage/ directory.

## Data Models

### Task Interface
```typescript
interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  priority: 'Low' | 'Medium' | 'High';
  dueDate: Date;
  completed: boolean;
  createdDate: Date;
  completedDate?: Date;
}
```

### Priority Levels
- Low: Non-urgent tasks with flexible deadlines
- Medium: Standard priority tasks with normal deadlines
- High: Urgent, time-sensitive tasks requiring prompt attention

### Task Status Values
- All: Display all tasks regardless of status
- Pending: Incomplete tasks with no completion date
- Completed: Successfully completed tasks
- Overdue: Tasks with past due dates that remain incomplete

## Storage and Data Persistence

The application utilizes browser localStorage for data persistence:
- Task data storage and retrieval
- User preference preservation
- Session information maintenance
- Activity log storage

## Additional Information

### Styling
- SCSS for component-specific styling
- Angular Material for standardized component design
- Responsive design using CSS Grid and Flexbox

### Browser Compatibility
- Chrome (latest versions)
- Firefox (latest versions)
- Safari (latest versions)
- Edge (latest versions)

### Performance Considerations
- AOT compilation for faster loading
- Tree-shaking to reduce bundle size
- Lazy loading where applicable
- HTTP interceptor for request optimization

---

For additional information and documentation, refer to the Angular official documentation at https://angular.io/docs
