import { AuthService } from '@/services/AuthService';
import { AuthState, LoginCredentials, RegisterData, User } from '@/types/auth';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check if user is logged in on mount
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // Initialize demo user first
    await AuthService.initializeDemoUser();
    // Then check authentication
    await checkAuth();
  };

  const checkAuth = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      setAuthState({
        user,
        isAuthenticated: user !== null,
        isLoading: false,
      });
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const login = async (credentials: LoginCredentials) => {
    const result = await AuthService.login(credentials);
    if (result.success && result.user) {
      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
      });
    }
    return result;
  };

  const register = async (data: RegisterData) => {
    const result = await AuthService.register(data);
    if (result.success && result.user) {
      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
      });
    }
    return result;
  };

  const logout = async () => {
    await AuthService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUser = async (user: User) => {
    const result = await AuthService.updateProfile(user);
    if (result.success) {
      setAuthState(prev => ({
        ...prev,
        user,
      }));
    }
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
