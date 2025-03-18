
import React from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const ResetPassword = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-muted/30">
      <div className="mb-8 text-center">
        <Link to="/" className="flex items-center justify-center space-x-2">
          <Mail className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Mail Automator</span>
        </Link>
        <p className="text-muted-foreground mt-2">Set your new password</p>
      </div>
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPassword;
