import { config, isDemo } from '../config/environment';

// Generic API adapter that switches between demo and real API calls
export class ApiAdapter {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    demoResponse?: T
  ): Promise<T> {
    if (isDemo()) {
      // Simulate network delay for demo
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      if (demoResponse !== undefined) {
        return demoResponse;
      }
      
      throw new Error('Demo response not provided');
    }

    // Real API call for production
    const url = `${config.apiBaseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  static async get<T>(endpoint: string, demoResponse?: T): Promise<T> {
    return this.makeRequest(endpoint, { method: 'GET' }, demoResponse);
  }

  static async post<T>(endpoint: string, data: any, demoResponse?: T): Promise<T> {
    return this.makeRequest(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      demoResponse
    );
  }

  static async put<T>(endpoint: string, data: any, demoResponse?: T): Promise<T> {
    return this.makeRequest(
      endpoint,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      demoResponse
    );
  }

  static async delete<T>(endpoint: string, demoResponse?: T): Promise<T> {
    return this.makeRequest(endpoint, { method: 'DELETE' }, demoResponse);
  }

  // Helper for authenticated requests
  static async authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    demoResponse?: T
  ): Promise<T> {
    const token = localStorage.getItem('authToken');
    
    return this.makeRequest(
      endpoint,
      {
        ...options,
        headers: {
          ...options.headers,
          Authorization: token ? `Bearer ${token}` : '',
        },
      },
      demoResponse
    );
  }
}

// Demo data storage (simulates database)
export class DemoDataStore {
  private static getStorageKey(key: string): string {
    return `grownet_demo_${key}`;
  }

  static get<T>(key: string, defaultValue: T): T {
    if (!isDemo()) return defaultValue;
    
    try {
      const stored = localStorage.getItem(this.getStorageKey(key));
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): void {
    if (!isDemo()) return;
    
    try {
      localStorage.setItem(this.getStorageKey(key), JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to store demo data:', error);
    }
  }

  static remove(key: string): void {
    if (!isDemo()) return;
    localStorage.removeItem(this.getStorageKey(key));
  }

  static clear(): void {
    if (!isDemo()) return;
    
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('grownet_demo_')) {
        localStorage.removeItem(key);
      }
    });
  }
}
