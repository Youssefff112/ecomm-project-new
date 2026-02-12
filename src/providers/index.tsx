'use client';

import { AuthProvider } from './AuthProvider';
import { CartProvider } from './CartProvider';
import { WishlistProvider } from './WishlistProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
