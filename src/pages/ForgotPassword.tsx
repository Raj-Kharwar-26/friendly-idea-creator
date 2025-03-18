
import React from 'react';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-muted/30">
      <div className="mb-8 text-center">
        <Link to="/" className="flex items-center justify-center space-x-2">
          <Mail className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Mail Automator</span>
        </Link>
        <p className="text-muted-foreground mt-2">Reset your password</p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPassword;
