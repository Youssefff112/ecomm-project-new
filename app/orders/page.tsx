'use client';

import { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AuthContext } from '@/providers/AuthProvider';
import { getUserOrders } from '@/services/orderService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
  const { isAuthenticated, user, loading: authLoading } = useContext(AuthContext);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Log user object for debugging
  useEffect(() => {
    console.log('=== User object in orders page ===');
    console.log('Full user object:', JSON.stringify(user, null, 2));
    console.log('user?.id:', user?.id);
    console.log('user?._id:', user?._id);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('authLoading:', authLoading);
  }, [user, isAuthenticated, authLoading]);

  // Extract user ID as a stable primitive value
  const userId = useMemo(() => user?.id || user?._id, [user]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Extracted user ID:', userId);
      console.log('Fetching orders (userId will be used if available)');
      
      const response = await getUserOrders(userId);
      console.log('Orders API response:', response);
      
      // Handle different response structures
      const ordersData = response?.data || response || [];
      console.log('Extracted orders data:', ordersData);
      
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      console.error('Error response:', error?.response);
      
      // Handle common error cases - treat as empty orders list
      if (error?.response?.status === 500 || error?.response?.status === 404 || error?.response?.status === 400) {
        console.log('No orders found (400/404/500) - treating as empty list');
        setOrders([]);
        setError(null);
      } else {
        setError('Failed to load orders. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push('/login');
      return;
    }

    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    // Fetch orders when authenticated (userId is optional - API filters by token)
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, authLoading, fetchOrders, router]);

  if (!isAuthenticated && !authLoading) {
    return null;
  }

  if (loading || authLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Orders</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={fetchOrders}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Card key={order._id || order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Order #{order._id?.slice(-8) || order.id}</CardTitle>
                    <CardDescription>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{order.totalOrderPrice} EGP</div>
                    <div className="text-sm text-muted-foreground">
                      {order.isPaid ? '✅ Paid' : '⏳ Pending'}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {order.cartItems?.map((item: any) => (
                    <div key={item._id} className="flex justify-between items-center">
                      <div className="flex gap-3">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={item.product?.imageCover}
                            alt={item.product?.title}
                            fill
                            sizes="64px"
                            className="object-cover rounded"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.product?.title}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.count}</p>
                        </div>
                      </div>
                      <span className="font-semibold">{item.price} EGP</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
