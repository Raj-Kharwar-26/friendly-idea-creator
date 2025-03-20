
import axios from 'axios';

// Base URL for your API
const API_URL = 'http://localhost:5000/api';

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
      const response = await api.post('/auth/signup', { name, email, password });
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return { data: response.data, error: null };
    } catch (error: any) {
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
