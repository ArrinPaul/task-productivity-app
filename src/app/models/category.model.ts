export interface Category {
  id: number;
  name: string;
  color: string;
  icon?: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: 'Work', color: '#3f51b5', icon: 'work' },
  { id: 2, name: 'Personal', color: '#4caf50', icon: 'person' },
  { id: 3, name: 'Shopping', color: '#ff9800', icon: 'shopping_cart' },
  { id: 4, name: 'Health', color: '#f44336', icon: 'favorite' },
  { id: 5, name: 'Education', color: '#9c27b0', icon: 'school' },
  { id: 6, name: 'Other', color: '#607d8b', icon: 'more_horiz' }
];
