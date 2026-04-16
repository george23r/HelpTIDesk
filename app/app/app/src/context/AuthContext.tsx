import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '../services/storage';
import { authAPI } from '../services/api';
import { User, LoginInput } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignout: boolean;
  login: (credentials: LoginInput) => Promise<void>;
  register: (credentials: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  bootstrapAsync: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignout, setIsSignout] = useState(false);

  const bootstrapAsync = async () => {
    try {
      const token = await storage.getToken();
      const storedUser = await storage.getUser();

      if (token && storedUser) {
        setUser({ ...storedUser, token });
      } else {
        setIsSignout(true);
      }
    } catch (e) {
      setIsSignout(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const login = async (credentials: LoginInput) => {
    try {
      const response = await authAPI.login(credentials.email, credentials.password);
      const { access_token, user: userData } = response.data;

      await storage.setToken(access_token);
      await storage.setUser(userData);

      setUser({ ...userData, token: access_token });
      setIsSignout(false);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      throw Array.isArray(message) ? message[0] : message;
    }
  };

  const register = async (credentials: LoginInput) => {
    try {
      const response = await authAPI.register(credentials.email, credentials.password);
      const { access_token, user: userData } = response.data;

      await storage.setToken(access_token);
      await storage.setUser(userData);

      setUser({ ...userData, token: access_token });
      setIsSignout(false);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al registrarse';
      throw Array.isArray(message) ? message[0] : message;
    }
  };

  const logout = async () => {
    try {
      await storage.clear();
      setUser(null);
      setIsSignout(true);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const value = {
    user,
    isLoading,
    isSignout,
    login,
    register,
    logout,
    bootstrapAsync,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
