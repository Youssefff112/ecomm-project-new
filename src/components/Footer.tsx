import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" />
              FreshCart
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Your one-stop shop for quality products at the best prices
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-slate-300 hover:text-white transition">Home</Link></li>
              <li><Link href="/products" className="text-slate-300 hover:text-white transition">Products</Link></li>
              <li><Link href="/brands" className="text-slate-300 hover:text-white transition">Brands</Link></li>
              <li><Link href="/cart" className="text-slate-300 hover:text-white transition">Cart</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="/profile" className="text-slate-300 hover:text-white transition">My Account</Link></li>
              <li><Link href="/orders" className="text-slate-300 hover:text-white transition">My Orders</Link></li>
              <li><Link href="/wishlist" className="text-slate-300 hover:text-white transition">Wishlist</Link></li>
              <li><Link href="/addresses" className="text-slate-300 hover:text-white transition">Addresses</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p className="text-slate-300 mb-2">Email: support@freshcart.com</p>
            <p className="text-slate-300">Phone: +20 123 456 7890</p>
          </div>
        </div>
        
        <div className="border-t border-slate-700 pt-6 text-center text-slate-300">
          <p>&copy; 2026 FreshCart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
