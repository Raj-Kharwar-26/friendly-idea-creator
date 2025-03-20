
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';

type AuthUser = {
  id: string;
  name: string;
  email: string;
} | null;

type AuthContextType = {
  user: AuthUser;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string, name: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in on mount
    const initializeAuth = async () => {
      setLoading(true);
      
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setUser({
              id: currentUser.id,
              name: currentUser.name,
              email: currentUser.email
            });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear potentially corrupted auth data
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await authService.login(email, password);
      
      if (error) {
        return { error: { message: error } };
      }
      
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email
      });
      
      return { error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      return { error: { message: error.message || 'An unexpected error occurred' } };
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await authService.signup(name, email, password);
      
      if (error) {
        return { error: { message: error } };
      }
      
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email
      });
      
      return { error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { error: { message: error.message || 'An unexpected error occurred' } };
    }
  };

  const logout = async () => {
    authService.logout();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await authService.resetPassword(email);
      
      if (error) {
        return { error: { message: error } };
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return { error: { message: error.message || 'An unexpected error occurred' } };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      // Get token from URL or session storage
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token') || sessionStorage.getItem('resetToken') || '';
      
      if (!token) {
        return { error: { message: 'Reset token not found' } };
      }
      
      const { error } = await authService.updatePassword(password, token);
      
      if (error) {
        return { error: { message: error } };
      }
      
      // Clear the token from session storage if it exists there
      sessionStorage.removeItem('resetToken');
      
      return { error: null };
    } catch (error: any) {
      console.error('Password update error:', error);
      return { error: { message: error.message || 'An unexpected error occurred' } };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        resetPassword,
        updatePassword,
        isAuthenticated: !!user?.id
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
