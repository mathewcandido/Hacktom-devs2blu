'use client';

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AuthContextType, AuthState, LoginCredentials, User } from '../types/Auth';
import { AuthService } from '../services/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check if user is already authenticated on mount
    const checkAuth = () => {
      try {
        const user = AuthService.getCurrentUser();
        const isAuthenticated = AuthService.isAuthenticated();

        setState({
          user,
          isAuthenticated,
          isLoading: false,
        });
      } catch {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const user = await AuthService.login(credentials);
      
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
      }));
      throw error;
    }
  };

  const logout = (): void => {
    AuthService.logout();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}