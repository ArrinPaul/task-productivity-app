export interface User {
  id: number;
  username: string;
  email?: string;
  password: string;
  createdDate?: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token?: string;
}
