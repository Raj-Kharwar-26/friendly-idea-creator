
import React, { useEffect, useState } from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Extract the access token from the URL
    const extractToken = () => {
      const hash = window.location.hash;
      
      if (!hash || hash.length === 0) {
        console.log('No hash found in URL');
        return null;
      }
      
      try {
        // Remove the # character and parse params
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get('access_token');
        
        if (!token) {
          console.log('No access_token found in hash params');
        } else {
          console.log('Token found in URL');
        }
        
        return token;
      } catch (error) {
        console.error('Error parsing URL hash:', error);
        return null;
      }
    };

    const token = extractToken();
    
    if (!token) {
      // If no token is found, redirect to forgot password page
      console.log('No valid token found, redirecting to forgot-password');
      navigate('/forgot-password');
    } else {
      // Set session with the token to allow password reset
      const setSession = async () => {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: '',
          });
          
          if (error) {
            console.error('Error setting session:', error);
            navigate('/forgot-password');
          } else {
            setHasToken(true);
            setLoading(false);
          }
        } catch (error) {
          console.error('Exception setting session:', error);
          navigate('/forgot-password');
        }
      };
      
      setSession();
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
      {hasToken && <ResetPasswordForm />}
    </div>
  );
};

export default ResetPassword;
