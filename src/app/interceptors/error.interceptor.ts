import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = this.buildMessage(error);
        this.notificationService.showError(message);
        return throwError(() => error);
      })
    );
  }

  private buildMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return `Network error: ${error.error.message}`;
    }

    if (error.status === 0) {
      return 'Unable to reach the server. Please check your connection.';
    }

    return `Request failed (${error.status}): ${error.statusText || 'Unexpected error'}`;
  }
}
