
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
} | null;

type AuthContextType = {
  user: User;
  login: (userData: Omit<User, 'isAuthenticated'>) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (userData: Omit<User, 'isAuthenticated'>) => {
    const authenticatedUser = { ...userData, isAuthenticated: true };
    setUser(authenticatedUser as User);
    localStorage.setItem('user', JSON.stringify(authenticatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user?.isAuthenticated
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
