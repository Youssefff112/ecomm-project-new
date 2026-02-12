'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProfilePage() {
  const { isAuthenticated, user, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Profile</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Name</label>
              <p className="text-lg font-medium">{user?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <p className="text-lg font-medium">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Phone</label>
              <p className="text-lg font-medium">{user?.phone || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <Link href="/orders">
              <Button variant="outline" className="w-full">View Orders</Button>
            </Link>
            <Link href="/addresses">
              <Button variant="outline" className="w-full">Manage Addresses</Button>
            </Link>
            <Link href="/wishlist">
              <Button variant="outline" className="w-full">My Wishlist</Button>
            </Link>
            <Link href="/cart">
              <Button variant="outline" className="w-full">Shopping Cart</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
