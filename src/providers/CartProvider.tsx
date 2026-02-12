'use client';

import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { getCart, addToCart as addToCartService, updateCartItemQuantity, removeCartItem, clearCart as clearCartService } from '@/services/cartService';
import { AuthContext } from './AuthProvider';

interface CartItem {
  product: any;
  count: number;
  price: number;
  _id: string;
}

interface Cart {
  products: CartItem[];
  totalCartPrice: number;
  _id: string;
}

interface CartContextType {
  cart: Cart | null;
  cartItemsCount: number;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string) => Promise<any>;
  updateQuantity: (productId: string, count: number) => Promise<any>;
  removeItem: (productId: string) => Promise<any>;
  clearCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType>({
  cart: null,
  cartItemsCount: 0,
  loading: false,
  error: null,
  fetchCart: async () => {},
  addToCart: async () => {},
  updateQuantity: async () => {},
  removeItem: async () => {},
  clearCart: async () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useContext(AuthContext);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCart();
      setCart(response.data);
      setCartItemsCount(response.numOfCartItems || 0);
    } catch (error: any) {
      // 500 errors on cart fetch usually mean no cart exists yet - treat as empty cart
      if (error?.response?.status === 500) {
        setCart(null);
        setCartItemsCount(0);
        setError(null); // Don't show error for empty cart
      } else {
        setError('Failed to load cart.');
        setCart(null);
        setCartItemsCount(0);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
      setCartItemsCount(0);
    }
  }, [isAuthenticated, fetchCart]);

  const addToCartHandler = useCallback(async (productId: string) => {
    try {
      const response = await addToCartService(productId);
      setCart(response.data);
      setCartItemsCount(response.numOfCartItems || 0);
      return response;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }, []);

  const updateQuantity = useCallback(async (productId: string, count: number) => {
    try {
      const response = await updateCartItemQuantity(productId, count);
      setCart(response.data);
      setCartItemsCount(response.numOfCartItems || 0);
      return response;
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  }, []);

  const removeItem = useCallback(async (productId: string) => {
    try {
      const response = await removeCartItem(productId);
      setCart(response.data);
      setCartItemsCount(response.numOfCartItems || 0);
      return response;
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  }, []);

  const clearCartHandler = useCallback(async () => {
    try {
      await clearCartService();
      setCart(null);
      setCartItemsCount(0);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }, []);

  const value = useMemo(() => ({
    cart,
    cartItemsCount,
    loading,
    error,
    fetchCart,
    addToCart: addToCartHandler,
    updateQuantity,
    removeItem,
    clearCart: clearCartHandler,
  }), [cart, cartItemsCount, loading, error, fetchCart, addToCartHandler, updateQuantity, removeItem, clearCartHandler]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
