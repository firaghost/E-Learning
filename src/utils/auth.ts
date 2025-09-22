// Simulate JWT token generation
export const generateToken = (user: any): string => {
  // In a real app, this would be a proper JWT token
  return btoa(JSON.stringify(user));
};

// Simulate JWT token verification
export const verifyToken = (token: string): any => {
  try {
    return JSON.parse(atob(token));
  } catch (error) {
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  const user = verifyToken(token);
  return !!user;
};

// Get current user from token
export const getCurrentUser = (): any => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  return verifyToken(token);
};

// Check if user has a specific role
export const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  return user && user.role === role;
};