
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, Mail, BarChart2 } from "lucide-react";

const Navbar = () => {
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
