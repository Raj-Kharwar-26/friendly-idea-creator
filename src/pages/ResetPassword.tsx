
import React, { useEffect, useState } from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a reset token in the URL
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1)); // Remove the # character
    const token = params.get('access_token');
    
    if (!token) {
      // If no token is found, redirect to forgot password page
      navigate('/forgot-password');
    } else {
      // Token found, allow user to reset password
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-muted/30">
        <div className="mb-8 text-center">
          <Mail className="h-8 w-8 text-primary mx-auto" />
          <span className="text-2xl font-bold mt-2 block">Mail Automator</span>
        </div>
        <p>Validating your reset token...</p>
      </div>
    );
  }

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
