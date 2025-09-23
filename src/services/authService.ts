import { User } from '../types/User';
import { ApiAdapter, DemoDataStore } from './apiAdapter';
import { config, isDemo } from '../config/environment';

// Demo user data
const demoUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'admin@grownet.et',
    role: 'admin',
    created_at: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'student@grownet.et',
    role: 'student',
    created_at: new Date('2024-01-02'),
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'tutor@grownet.et',
    role: 'tutor',
    created_at: new Date('2024-01-03'),
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'employer@grownet.et',
    role: 'employer',
    created_at: new Date('2024-01-04'),
  },
];

// Initialize demo data
if (isDemo()) {
  const storedUsers = DemoDataStore.get('users', demoUsers);
  if (storedUsers.length === 0) {
    DemoDataStore.set('users', demoUsers);
  }
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: User['role'];
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  if (isDemo()) {
    // Demo mode logic
    const users = DemoDataStore.get('users', demoUsers);
    const user = users.find((u: User) => u.email === email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check demo credentials
    const demoCredential = Object.values(config.demoCredentials).find(
      cred => cred.email === email && cred.password === password
    );

    if (!demoCredential) {
      throw new Error('Invalid email or password');
    }

    const token = `demo_token_${user.id}_${Date.now()}`;
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));

    return { user, token };
  }

  // Production mode - real API call
  const response = await ApiAdapter.post<LoginResponse>('/auth/login', {
    email,
    password
  });

  // Store token and user data
  localStorage.setItem('authToken', response.token);
  localStorage.setItem('currentUser', JSON.stringify(response.user));
  
  if (response.refreshToken) {
    localStorage.setItem('refreshToken', response.refreshToken);
  }

  return response;
};

export const register = async (userData: RegisterRequest): Promise<LoginResponse> => {
  if (isDemo()) {
    // Demo mode logic
    const users = DemoDataStore.get('users', demoUsers);
    
    // Check if user already exists
    const existingUser = users.find((u: User) => u.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    const newUser: User = {
      id: `demo_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      created_at: new Date(),
    };
    
    users.push(newUser);
    DemoDataStore.set('users', users);

    const token = `demo_token_${newUser.id}_${Date.now()}`;
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    return { user: newUser, token };
  }

  // Production mode - real API call
  const response = await ApiAdapter.post<LoginResponse>('/auth/register', userData);

  // Store token and user data
  localStorage.setItem('authToken', response.token);
  localStorage.setItem('currentUser', JSON.stringify(response.user));
  
  if (response.refreshToken) {
    localStorage.setItem('refreshToken', response.refreshToken);
  }

  return response;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;

  if (isDemo()) {
    // Demo mode - get from localStorage
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  // Production mode - verify token with backend
  try {
    const response = await ApiAdapter.authenticatedRequest<{ user: User }>('/auth/me');
    return response.user;
  } catch (error) {
    // Token might be expired, clear it
    logout();
    return null;
  }
};

export const logout = async (): Promise<void> => {
  const token = localStorage.getItem('authToken');

  if (!isDemo() && token) {
    // Production mode - notify backend
    try {
      await ApiAdapter.authenticatedRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      // Ignore logout errors
      console.warn('Logout error:', error);
    }
  }

  // Clear local storage
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('currentUser');
};