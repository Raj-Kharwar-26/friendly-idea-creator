
import React, { useEffect, useState } from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Extract the token from the URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    
    if (!token) {
      console.log('No token found in URL, redirecting to forgot-password');
      navigate('/forgot-password');
    } else {
      // Store token in session storage for the updatePassword function to use
      sessionStorage.setItem('resetToken', token);
      setHasToken(true);
      setLoading(false);
    }
  }, [navigate, location]);

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
      {hasToken && <ResetPasswordForm />}
    </div>
  );
};

export default ResetPassword;
