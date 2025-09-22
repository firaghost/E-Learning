import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Mock the auth utilities
jest.mock('../utils/auth', () => ({
  getCurrentUser: jest.fn(),
  isAuthenticated: jest.fn(),
}));

// Mock the localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
  writable: true,
});

// Test component to use the auth context
const TestComponent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <div>
      <div data-testid="user">{user ? user.name : 'No user'}</div>
      <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  test('provides default values', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toBeInTheDocument();
    expect(screen.getByTestId('auth-status')).toBeInTheDocument();
  });
});