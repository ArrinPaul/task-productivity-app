import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface ActivityLog {
  id: string;
  timestamp: Date;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityLogService {
  private logSubject = new BehaviorSubject<ActivityLog[]>([]);
  public log$ = this.logSubject.asObservable();

  constructor() { }

  addLog(message: string): void {
    const currentLog = this.logSubject.value;
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      message
    };
    this.logSubject.next([...currentLog, newLog]);
  }

  getLog(): Observable<ActivityLog[]> {
    return this.log$;
  }
}
