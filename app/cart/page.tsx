'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CartContext } from '@/providers/CartProvider';
import { AuthContext } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function CartPage() {
  const { cart, cartItemsCount, updateQuantity, removeItem, loading, error, fetchCart } = useContext(CartContext);
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();
  const { toast } = useToast();

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

  const handleUpdateQuantity = async (productId: string, newCount: number) => {
    if (newCount < 1) return;
    try {
      await updateQuantity(productId, newCount);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeItem(productId);
      toast({
        title: "Item removed from cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Cart</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={fetchCart}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!cart || cartItemsCount === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Add some products to get started!</p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart ({cartItemsCount} items)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.products?.map((item: any) => (
            <Card key={item._id}>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <Link href={`/products/${item.product?._id || item.product?.id}`} className="flex-shrink-0">
                    <img
                      src={item.product?.imageCover}
                      alt={item.product?.title}
                      className="w-32 h-32 object-cover rounded-lg hover:opacity-80 transition-opacity"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link href={`/products/${item.product?._id || item.product?.id}`}>
                      <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors line-clamp-2">
                        {item.product?.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-sm mb-1">
                      Category: {item.product?.category?.name}
                    </p>
                    {item.product?.brand?.name && (
                      <p className="text-muted-foreground text-sm mb-2">
                        Brand: {item.product?.brand?.name}
                      </p>
                    )}
                    <div className="mb-4">
                      <p className="text-lg font-semibold text-muted-foreground">
                        Unit Price: {item.price} EGP
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        Total: {item.price * item.count} EGP
                      </p>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-3 border rounded-lg p-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleUpdateQuantity(item.product._id, item.count - 1)}
                          disabled={item.count <= 1}
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">{item.count}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleUpdateQuantity(item.product._id, item.count + 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleRemove(item.product._id)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-lg">
                <span>Subtotal:</span>
                <span className="font-bold">{cart.totalCartPrice} EGP</span>
              </div>
              <Link href="/checkout" className="block">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/products" className="block">
                <Button className="w-full" variant="outline">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
