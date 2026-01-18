import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private currentUserId: number | null = null;
  
  constructor() { 
    this.loadCurrentUserId();
  }

  // Set current user ID
  setCurrentUserId(userId: number | null): void {
    this.currentUserId = userId;
    if (userId !== null) {
      localStorage.setItem('current_user_id', userId.toString());
    } else {
      localStorage.removeItem('current_user_id');
    }
  }

  // Load current user ID
  private loadCurrentUserId(): void {
    const userId = localStorage.getItem('current_user_id');
    this.currentUserId = userId ? parseInt(userId, 10) : null;
  }

  // Get current user ID
  getCurrentUserId(): number | null {
    return this.currentUserId;
  }

  // Get user-specific key
  private getUserKey(key: string): string {
    if (this.currentUserId !== null) {
      return `user_${this.currentUserId}_${key}`;
    }
    return key; // Fallback to non-user-specific key
  }

  // Generic set method (user-specific)
  setItem<T>(key: string, value: T): void {
    try {
      const userKey = this.getUserKey(key);
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(userKey, serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }

  // Generic get method (user-specific)
  getItem<T>(key: string): T | null {
    try {
      const userKey = this.getUserKey(key);
      const item = localStorage.getItem(userKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error retrieving from localStorage', error);
      return null;
    }
  }

  // Set global item (not user-specific)
  setGlobalItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }

  // Get global item (not user-specific)
  getGlobalItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error retrieving from localStorage', error);
      return null;
    }
  }

  // Remove item
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage', error);
    }
  }

  // Clear all
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }

  // Check if key exists
  hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  // Get all keys
  getAllKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  }
}
