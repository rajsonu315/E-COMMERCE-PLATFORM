'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

interface User {
  id: number;
  email: string;
  roleId: number;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing token and user data
    const token = Cookies.get('token');
    const userData = Cookies.get('user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user data", e);
        Cookies.remove('token');
        Cookies.remove('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, user: User) => {
    Cookies.set('token', token, { expires: 1 }); // 1 day
    Cookies.set('user', JSON.stringify(user), { expires: 1 });
    setUser(user);
    router.push('/dashboard');
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setUser(null);
    router.push('/login');
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
