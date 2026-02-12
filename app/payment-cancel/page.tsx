import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-16 text-center">
      <XCircle className="w-24 h-24 text-red-600 mx-auto mb-6" />
      <h1 className="text-4xl font-bold mb-4">Payment Cancelled</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Your payment was cancelled. No charges were made to your account.
      </p>
      <p className="text-muted-foreground mb-8">
        You can try again or continue shopping.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/cart">
          <Button size="lg">Back to Cart</Button>
        </Link>
        <Link href="/products">
          <Button size="lg" variant="outline">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
