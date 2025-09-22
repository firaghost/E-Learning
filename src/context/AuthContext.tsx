import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/User';
import { getCurrentUser } from '../utils/auth';
import * as authUtils from '../utils/auth';
import { login as apiLogin, register as apiRegister } from '../services/mockApi';
import { signInWithGoogle } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuthStatus = () => {
      const authenticated = authUtils.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const currentUser = getCurrentUser();
        setUser(currentUser);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Use mock API service
      const { user, token } = await apiLogin(email, password);
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Update state
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Sign in with Google
      const { user: firebaseUser, token } = await signInWithGoogle();
      
      // Check if user exists in our system, if not create them
      // For this demo, we'll create a mock user based on Google user data
      const mockUser: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Google User',
        email: firebaseUser.email || '',
        role: 'student', // Default role for Google signups
        created_at: new Date(),
        updated_at: new Date()
      };
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Update state
      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const register = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Use mock API service
      const registerData = {
        name: userData.name,
        email: userData.email,
        password: 'password123', // Default password for demo
        role: userData.role as 'student' | 'tutor' | 'employer'
      };
      
      const { user, token } = await apiRegister(registerData);
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Update state
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    login,
    register,
    loginWithGoogle,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;