'use client';

import React, { useContext } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import { CartContext } from '@/providers/CartProvider';
import { WishlistContext } from '@/providers/WishlistProvider';
import { ShoppingCart, Heart, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { cartItemsCount } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const router = useRouter();
  const pathname = usePathname();

  const getFirstName = (fullName: string | undefined) => {
    if (!fullName) return 'User';
    return fullName.split(' ')[0];
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-7 w-7" />
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              FreshCart
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className={`text-foreground hover:text-primary transition font-medium ${
                isActive('/') ? 'text-primary border-b-2 border-primary pb-1' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className={`text-foreground hover:text-primary transition font-medium ${
                isActive('/products') ? 'text-primary border-b-2 border-primary pb-1' : ''
              }`}
            >
              Products
            </Link>
            <Link 
              href="/brands" 
              className={`text-foreground hover:text-primary transition font-medium ${
                isActive('/brands') ? 'text-primary border-b-2 border-primary pb-1' : ''
              }`}
            >
              Brands
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/orders" className="hidden sm:flex items-center gap-2 hover:text-primary transition cursor-pointer">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    Hi, {getFirstName(user?.name)}
                  </span>
                </Link>
                <Link href="/wishlist" className="relative hover:text-primary transition">
                  <Heart className="h-5 w-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
                <Link href="/cart" className="relative hover:text-primary transition">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="hover:text-primary"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
