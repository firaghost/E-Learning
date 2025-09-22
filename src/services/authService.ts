import { User, UserRole } from '../types/User';
import { generateToken } from '../utils/auth';
import usersData from '../data/users.json';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Register a new user
export const register = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<{ user: User; token: string }> => {
  await delay(500); // Simulate network delay
  
  // Check if user already exists
  const existingUser = usersData.find(user => user.email === userData.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  // Create new user
  const newUser: User = {
    id: (usersData.length + 1).toString(),
    ...userData,
    created_at: new Date(),
  };
  
  // Generate token
  const token = generateToken(newUser);
  
  // In a real app, we would save the user to a database here
  // For now, we'll just return the user and token
  return { user: newUser, token };
};

// Login user
export const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  await delay(500); // Simulate network delay
  
  // Find user by email
  const userData = usersData.find(user => user.email === email);
  if (!userData) {
    throw new Error('Invalid email or password');
  }
  
  // Convert the user data to match the User type
  const user: User = {
    ...userData,
    role: userData.role as UserRole, // Cast role to UserRole type
    created_at: userData.created_at ? new Date(userData.created_at) : undefined,
  };
  
  // In a real app, we would verify the password here
  // For now, we'll just generate a token
  const token = generateToken(user);
  
  return { user, token };
};

// Logout user
export const logout = async (): Promise<void> => {
  await delay(100); // Simulate network delay
  // In a real app, we would invalidate the token on the server
  // For now, we'll just resolve
  return Promise.resolve();
};