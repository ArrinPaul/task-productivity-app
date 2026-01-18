import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, AuthState } from '../models/user.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'auth_state';
  private readonly USERS_KEY = 'users';
  
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null
  });
  
  public authState$ = this.authStateSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.initializeAuth();
    this.seedDefaultUser();
  }

  // Initialize auth state from storage
  private initializeAuth(): void {
    const savedAuthState = this.storageService.getGlobalItem<AuthState>(this.STORAGE_KEY);
    if (savedAuthState && savedAuthState.isAuthenticated && savedAuthState.user) {
      this.storageService.setCurrentUserId(savedAuthState.user.id);
      this.authStateSubject.next(savedAuthState);
    }
  }

  // Seed default user for demo
  private seedDefaultUser(): void {
    const users = this.storageService.getGlobalItem<User[]>(this.USERS_KEY);
    if (!users || users.length === 0) {
      const defaultUser: User = {
        id: 1,
        username: 'demo',
        email: 'demo@tasktracker.com',
        password: 'demo123',
        createdDate: new Date()
      };
      this.storageService.setGlobalItem(this.USERS_KEY, [defaultUser]);
    }
  }

  // Login
  login(username: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      const users = this.storageService.getGlobalItem<User[]>(this.USERS_KEY) || [];
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        // Set current user ID in storage service
        this.storageService.setCurrentUserId(user.id);
        
        const authState: AuthState = {
          isAuthenticated: true,
          user: { ...user, password: '' }, // Don't store password in state
          token: this.generateToken()
        };
        this.storageService.setGlobalItem(this.STORAGE_KEY, authState);
        this.authStateSubject.next(authState);
        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }

  // Register new user
  register(username: string, email: string, password: string): Observable<{ success: boolean; message: string }> {
    return new Observable(observer => {
      const users = this.storageService.getGlobalItem<User[]>(this.USERS_KEY) || [];
      
      // Check if username already exists
      if (users.some(u => u.username === username)) {
        observer.next({ success: false, message: 'Username already exists' });
        observer.complete();
        return;
      }

      // Check if email already exists
      if (email && users.some(u => u.email === email)) {
        observer.next({ success: false, message: 'Email already registered' });
        observer.complete();
        return;
      }

      const newUser: User = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        username,
        email,
        password,
        createdDate: new Date()
      };

      users.push(newUser);
      this.storageService.setGlobalItem(this.USERS_KEY, users);
      observer.next({ success: true, message: 'Account created successfully' });
      observer.complete();
    });
  }

  // Logout
  logout(): void {
    const authState: AuthState = {
      isAuthenticated: false,
      user: null
    };
    this.storageService.setCurrentUserId(null);
    this.storageService.removeItem(this.STORAGE_KEY);
    this.authStateSubject.next(authState);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  // Get auth state
  getAuthState(): Observable<AuthState> {
    return this.authState$;
  }

  // Generate mock token
  private generateToken(): string {
    return 'mock_token_' + Math.random().toString(36).substr(2, 9);
  }
}
