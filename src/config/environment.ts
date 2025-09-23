// Environment configuration for demo vs production modes
export interface AppConfig {
  mode: 'demo' | 'production';
  apiBaseUrl: string;
  enableRealAuth: boolean;
  enablePayments: boolean;
  enableVideoMeetings: boolean;
  demoCredentials: {
    admin: { email: string; password: string };
    student: { email: string; password: string };
    tutor: { email: string; password: string };
    employer: { email: string; password: string };
  };
}

// Demo mode configuration (for Vercel deployment)
const demoConfig: AppConfig = {
  mode: 'demo',
  apiBaseUrl: '', // No real API calls
  enableRealAuth: false,
  enablePayments: false,
  enableVideoMeetings: false,
  demoCredentials: {
    admin: { email: 'admin@grownet.et', password: 'admin123' },
    student: { email: 'student@grownet.et', password: 'student123' },
    tutor: { email: 'tutor@grownet.et', password: 'tutor123' },
    employer: { email: 'employer@grownet.et', password: 'employer123' }
  }
};

// Production mode configuration (for full deployment)
const productionConfig: AppConfig = {
  mode: 'production',
  apiBaseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  enableRealAuth: true,
  enablePayments: true,
  enableVideoMeetings: true,
  demoCredentials: {
    admin: { email: '', password: '' },
    student: { email: '', password: '' },
    tutor: { email: '', password: '' },
    employer: { email: '', password: '' }
  }
};

// Determine which config to use based on environment
const isDemoMode = process.env.REACT_APP_MODE === 'demo' || process.env.NODE_ENV === 'development';

export const config: AppConfig = isDemoMode ? demoConfig : productionConfig;

// Helper functions
export const isDemo = () => config.mode === 'demo';
export const isProduction = () => config.mode === 'production';
export const getApiUrl = (endpoint: string) => 
  isDemo() ? '' : `${config.apiBaseUrl}${endpoint}`;

// Demo data flags
export const useDemoData = () => isDemo();
export const useRealAuth = () => config.enableRealAuth;
export const useRealPayments = () => config.enablePayments;
