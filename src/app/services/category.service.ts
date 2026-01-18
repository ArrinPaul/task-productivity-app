import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  constructor() {
    const initialCategories: Category[] = [
      { id: 1, name: 'Work', color: '#3f51b5' },
      { id: 2, name: 'Personal', color: '#4caf50' },
      { id: 3, name: 'Shopping', color: '#ff9800' }
    ];
    this.categoriesSubject.next(initialCategories);
  }

  getCategories(): Observable<Category[]> {
    return this.categories$;
  }

  addCategory(category: Category): void {
    const categories = this.categoriesSubject.value;
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    this.categoriesSubject.next([...categories, { ...category, id: newId }]);
  }

  updateCategory(category: Category): void {
    const categories = this.categoriesSubject.value;
    const index = categories.findIndex(c => c.id === category.id);
    if (index > -1) {
      categories[index] = category;
      this.categoriesSubject.next([...categories]);
    }
  }

  deleteCategory(id: number): void {
    const categories = this.categoriesSubject.value;
    const filteredCategories = categories.filter(c => c.id !== id);
    this.categoriesSubject.next(filteredCategories);
  }

  importCategories(categories: Category[]): void {
    this.categoriesSubject.next(categories);
  }
}
