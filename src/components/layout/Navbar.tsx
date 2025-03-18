
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, Mail, BarChart2, User, LogOut } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };

  return (
    <nav className="bg-background border-b border-border py-3 px-4 w-full">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Mail className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Mail Automator</span>
        </Link>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" asChild>
            <Link to="/" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          
          {isAuthenticated ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/compose" className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Compose
                </Link>
              </Button>
              
              <Button variant="ghost" asChild>
                <Link to="/dashboard" className="flex items-center">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              
              <Button variant="outline" className="ml-2">
                <User className="mr-2 h-4 w-4" />
                {user?.name || 'Profile'}
              </Button>
              
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
              
              <Button variant="default" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
