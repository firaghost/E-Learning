// API utility functions
const API_BASE_URL = '/api';

// Generic fetch wrapper
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
  
  const config = {
    ...defaultOptions,
    ...options,
  };
  
  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// GET request
export const get = (endpoint: string) => {
  return apiRequest(endpoint, {
    method: 'GET',
  });
};

// POST request
export const post = (endpoint: string, data: any) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// PUT request
export const put = (endpoint: string, data: any) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// DELETE request
export const del = (endpoint: string) => {
  return apiRequest(endpoint, {
    method: 'DELETE',
  });
};