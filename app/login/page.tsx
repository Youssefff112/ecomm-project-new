'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { signin } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const { toast } = useToast();

  const decodeToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await signin(formData);
      
      // Handle different response structures - Route.misr API structure
      const token = response.token || response.data?.token;
      
      if (!token) {
        throw new Error('No token received from server');
      }

      // Decode token to get user info
      const decodedToken = decodeToken(token);
      console.log('Full decoded token payload:', JSON.stringify(decodedToken, null, 2));
      
      let user = response.user || response.data?.user;
      console.log('User from API response:', user);
      
      // If user object doesn't exist, create one with token data
      if (!user && decodedToken) {
        // Extract ID from various possible fields in the token
        const userId = decodedToken.userId || decodedToken.id || decodedToken._id || decodedToken.sub;
        
        user = {
          email: formData.email,
          name: decodedToken.name || formData.email.split('@')[0],
          id: userId,
          _id: userId,
          role: decodedToken.role,
        };
        console.log('Created user from token:', user);
      } else if (user && decodedToken) {
        // Ensure user has ID fields from token if not present
        const userId = decodedToken.userId || decodedToken.id || decodedToken._id || decodedToken.sub;
        
        if (!user.id && !user._id && userId) {
          user.id = userId;
          user._id = userId;
          console.log('Added user ID from token:', userId);
        }
        // If user exists but doesn't have name, add it from token
        if (!user.name && decodedToken.name) {
          user.name = decodedToken.name || user.email?.split('@')[0];
        }
      }
      
      console.log('Final user object being stored:', JSON.stringify(user, null, 2));
      
      login(token, user);
      
      toast({
        title: "Success!",
        description: "You have successfully logged in.",
      });
      
      router.push('/');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || error.message 
        || 'Login failed';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <Link href="/forgot-password" className="text-sm text-primary hover:underline block">
              Forgot password?
            </Link>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
