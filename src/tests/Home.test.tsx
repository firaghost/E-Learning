import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';

// Mock the AuthContext
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    logout: jest.fn(),
    isAuthenticated: false,
  }),
}));

// Mock the ThemeContext
jest.mock('../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
  }),
}));

describe('Home', () => {
  test('renders hero section with title and description', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText('Empowering Learners Worldwide')).toBeInTheDocument();
    expect(screen.getByText(/Access quality education, find career opportunities, and connect with tutors/i)).toBeInTheDocument();
  });

  test('renders feature cards', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText('Education Hub')).toBeInTheDocument();
    expect(screen.getByText('Job Board')).toBeInTheDocument();
    expect(screen.getByText('Tutoring Services')).toBeInTheDocument();
  });
});