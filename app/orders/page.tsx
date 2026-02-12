'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import { getUserOrders } from '@/services/orderService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
  const { isAuthenticated, user, loading: authLoading } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = user?.id || user?._id;
      if (!userId) {
        // If no user ID, treat as no orders yet
        setOrders([]);
        setLoading(false);
        return;
      }
      
      const response = await getUserOrders(userId);
      setOrders(response || []);
    } catch (error: any) {
      // 500 errors on orders usually mean no orders exist yet - treat as empty
      if (error?.response?.status === 500) {
        setOrders([]);
        setError(null);
      } else {
        setError('Failed to load orders. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push('/login');
      return;
    }

    // Wait for auth to finish loading and user data to be available
    if (authLoading) {
      return;
    }

    // Only fetch orders when we have a user with an ID
    if (isAuthenticated && user) {
      fetchOrders();
    }
  }, [isAuthenticated, user, authLoading, router]);

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
                        <img
                          src={item.product?.imageCover}
                          alt={item.product?.title}
                          className="w-16 h-16 object-cover rounded"
                        />
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
