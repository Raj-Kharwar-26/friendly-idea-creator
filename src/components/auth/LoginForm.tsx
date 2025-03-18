
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type FormValues = z.infer<typeof formSchema>;

const LoginForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { login } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // Display login attempt message
      toast({
        title: "Logging in",
        description: "Please wait while we verify your credentials...",
      });
      
      // Extend timeout to 15 seconds and attempt login
      const loginPromise = login(data.email, data.password);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Login request timed out. Please try again.")), 15000)
      );
      
      const { error } = await Promise.race([loginPromise, timeoutPromise]) as { error: any };
      
      if (error) {
        console.error('Login error details:', error);
        let errorMessage = error.message;
        
        // More user-friendly error messages
        if (errorMessage.includes('Invalid login credentials')) {
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
        } else if (errorMessage.includes('timed out')) {
          errorMessage = "Login request timed out. The server might be busy. Please try again.";
        }
        
        setAuthError(errorMessage);
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.log('Login successful, redirecting to dashboard');
        toast({
          title: "Logged in successfully",
          description: "Welcome back to Mail Automator!",
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || "An unexpected error occurred. Please try again.";
      setAuthError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Log in</CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {authError && (
          <div className="bg-destructive/15 text-destructive rounded-md p-3 mb-4 flex items-center gap-2">
            <AlertCircle size={16} />
            <p className="text-sm">{authError}</p>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
