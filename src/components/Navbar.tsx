'use client';

import React, { useContext, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import { CartContext } from '@/providers/CartProvider';
import { WishlistContext } from '@/providers/WishlistProvider';
import { ShoppingCart, Heart, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import freshcartLogo from '../../assets/images/freshcart-logo.svg';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { cartItemsCount } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false);
    router.push('/login');
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={freshcartLogo}
              alt="FreshCart"
              width={160}
              height={31}
              priority
              className="h-7 lg:h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8">
            <Link 
              href="/" 
              className={`text-foreground hover:text-primary transition font-medium text-sm lg:text-base ${
                isActive('/') ? 'text-primary border-b-2 border-primary pb-1' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className={`text-foreground hover:text-primary transition font-medium text-sm lg:text-base ${
                isActive('/products') ? 'text-primary border-b-2 border-primary pb-1' : ''
              }`}
            >
              Products
            </Link>
            <Link 
              href="/categories" 
              className={`text-foreground hover:text-primary transition font-medium text-sm lg:text-base ${
                isActive('/categories') ? 'text-primary border-b-2 border-primary pb-1' : ''
              }`}
            >
              Categories
            </Link>
            <Link 
              href="/brands" 
              className={`text-foreground hover:text-primary transition font-medium text-sm lg:text-base ${
                isActive('/brands') ? 'text-primary border-b-2 border-primary pb-1' : ''
              }`}
            >
              Brands
            </Link>
          </div>

          {/* Desktop User Actions */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/orders" className="hidden lg:flex items-center gap-2 hover:text-primary transition cursor-pointer">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden xl:inline">
                    {user?.name}
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

          {/* Mobile Menu Button & Icons */}
          <div className="flex lg:hidden items-center gap-3">
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
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hover:text-primary"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t py-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-foreground hover:text-primary transition font-medium px-2 py-1 ${
                  isActive('/') ? 'text-primary bg-primary/10 rounded' : ''
                }`}
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-foreground hover:text-primary transition font-medium px-2 py-1 ${
                  isActive('/products') ? 'text-primary bg-primary/10 rounded' : ''
                }`}
              >
                Products
              </Link>
              <Link
                href="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-foreground hover:text-primary transition font-medium px-2 py-1 ${
                  isActive('/categories') ? 'text-primary bg-primary/10 rounded' : ''
                }`}
              >
                Categories
              </Link>
              <Link
                href="/brands"
                onClick={() => setMobileMenuOpen(false)}
                className={`text-foreground hover:text-primary transition font-medium px-2 py-1 ${
                  isActive('/brands') ? 'text-primary bg-primary/10 rounded' : ''
                }`}
              >
                Brands
              </Link>

              <div className="border-t pt-4 mt-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-2 py-2 hover:bg-primary/10 rounded"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                          {getInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {user?.name}
                      </span>
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-2 py-2 hover:bg-primary/10 rounded mt-2"
                    >
                      <Heart className="h-5 w-5" />
                      <span>Wishlist</span>
                      {wishlist.length > 0 && (
                        <span className="ml-auto bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center font-bold">
                          {wishlist.length}
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-2 py-2 hover:bg-primary/10 rounded mt-2 w-full text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">Login</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
