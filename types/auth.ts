export interface User {
  id: string;
  email: string;
  name: string;
  studentId: string;
  faculty: string;
  year: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  studentId: string;
  faculty: string;
  year: string;
}
