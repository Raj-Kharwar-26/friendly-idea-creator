import axios from 'axios';

// Base URL for your API - updated to work in various environments
const API_URL = import.meta.env.PROD 
  ? '/api' // In production, use relative path with proxy
  : 'http://localhost:5000/api'; // In development, use localhost

// Set up axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth service functions
export const authService = {
  // Login user
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.error || 'Login failed. Please try again.' 
      };
    }
  },

  // Register a new user
  signup: async (name: string, email: string, password: string) => {
    try {
      console.log('Signup attempt with:', { name, email });
      const response = await api.post('/auth/signup', { name, email, password });
      console.log('Signup response:', response.data);
      
      // Store token in localStorage
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return { data: response.data, error: null };
      } else {
        return { 
          data: null, 
          error: 'Invalid response from server. Missing token or user data.' 
        };
      }
    } catch (error: any) {
      console.error('Signup error details:', error.response?.data || error.message);
      return { 
        data: null, 
        error: error.response?.data?.error || 'Registration failed. Please try again.' 
      };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await api.get('/auth/user');
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.error || 'Failed to fetch user profile.' 
      };
    }
  },

  // Request password reset
  resetPassword: async (email: string) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.error || 'Failed to request password reset.' 
      };
    }
  },

  // Update password (when user has reset token)
  updatePassword: async (password: string, token: string) => {
    try {
      const response = await api.post('/auth/reset-password', { 
        password,
        token
      });
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.error || 'Failed to update password.' 
      };
    }
  }
};
