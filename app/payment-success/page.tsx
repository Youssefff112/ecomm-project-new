'use client';

import { useContext, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { CartContext } from '@/providers/CartProvider';

export default function PaymentSuccessPage() {
  const { fetchCart } = useContext(CartContext);

  useEffect(() => {
    // Refresh cart to update navbar count after successful payment
    fetchCart();
  }, [fetchCart]);

  return (
    <div className="container max-w-2xl mx-auto px-4 py-16 text-center">
      <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-6" />
      <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Thank you for your order. Your payment has been processed successfully.
      </p>
      <p className="text-muted-foreground mb-8">
        You will receive an email confirmation shortly.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/orders">
          <Button size="lg">View Orders</Button>
        </Link>
        <Link href="/products">
          <Button size="lg" variant="outline">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
