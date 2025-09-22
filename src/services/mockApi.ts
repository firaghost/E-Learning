import { User, UserRole } from '../types/User';
import usersData from '../data/users.json';
import { generateToken } from '../utils/auth';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user database (in a real app, this would be a database)
let users: User[] = usersData.map(user => ({
  ...user,
  role: user.role as UserRole,
  created_at: new Date(user.created_at)
}));

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'tutor' | 'employer';
}

// Mock API endpoints
export const mockApi = {
  // Login endpoint
  login: async (email: string, password: string): Promise<LoginResponse> => {
    await delay(800); // Simulate network delay
    
    // Find user by email
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In a real app, we would verify the password hash
    // For demo purposes, we'll accept any password for existing users
    // or use 'password123' as the default password
    if (password !== 'password123') {
      throw new Error('Invalid password');
    }
    
    // Generate token
    const token = generateToken(user);
    
    return {
      user,
      token
    };
  },

  // Register endpoint
  register: async (userData: RegisterRequest): Promise<LoginResponse> => {
    await delay(1000); // Simulate network delay
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }
    
    // Create new user
    const newUser: User = {
      id: (users.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    // Add to users array
    users.push(newUser);
    
    // Generate token
    const token = generateToken(newUser);
    
    return {
      user: newUser,
      token
    };
  },

  // Get user profile
  getProfile: async (token: string): Promise<User> => {
    await delay(300);
    
    // In a real app, we would verify the token with the server
    // For now, we'll decode it locally
    try {
      const userData = JSON.parse(atob(token));
      const user = users.find(u => u.id === userData.id);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  // Update user profile
  updateProfile: async (token: string, updates: Partial<User>): Promise<User> => {
    await delay(500);
    
    try {
      const userData = JSON.parse(atob(token));
      const userIndex = users.findIndex(u => u.id === userData.id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      // Update user data
      users[userIndex] = {
        ...users[userIndex],
        ...updates,
        updated_at: new Date()
      };
      
      return users[userIndex];
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
};

// Export individual functions for easier importing
export const { login, register, getProfile, updateProfile } = mockApi;
