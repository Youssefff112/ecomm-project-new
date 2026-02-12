'use client';

import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { getWishlist, addToWishlist as addToWishlistService, removeFromWishlist as removeFromWishlistService } from '@/services/wishlistService';
import { AuthContext } from './AuthProvider';

interface WishlistItem {
  _id: string;
  id?: string;
  title: string;
  imageCover: string;
  price: number;
  [key: string]: any;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  wishlistIds: string[];
  loading: boolean;
  error: string | null;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<any>;
  removeFromWishlist: (productId: string) => Promise<any>;
  isInWishlist: (productId: string) => boolean;
}

export const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  wishlistIds: [],
  loading: false,
  error: null,
  fetchWishlist: async () => {},
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  isInWishlist: () => false,
});

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useContext(AuthContext);

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getWishlist();
      const wishlistData = response.data || response || [];
      setWishlist(wishlistData);
      setWishlistIds(wishlistData?.map((item: WishlistItem) => item._id || item.id) || []);
    } catch (error: any) {
      // 500 errors on wishlist fetch usually mean no wishlist exists yet - treat as empty
      if (error?.response?.status === 500) {
        setWishlist([]);
        setWishlistIds([]);
        setError(null); // Don't show error for empty wishlist
      } else {
        setError('Failed to load wishlist.');
        setWishlist([]);
        setWishlistIds([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist([]);
      setWishlistIds([]);
    }
  }, [isAuthenticated, fetchWishlist]);

  const addToWishlist = useCallback(async (productId: string) => {
    try {
      const response = await addToWishlistService(productId);
      await fetchWishlist();
      return response;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  }, [fetchWishlist]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    try {
      const response = await removeFromWishlistService(productId);
      await fetchWishlist();
      return response;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }, [fetchWishlist]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlistIds.includes(productId);
  }, [wishlistIds]);

  const value = useMemo(() => ({
    wishlist,
    wishlistIds,
    loading,
    error,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  }), [wishlist, wishlistIds, loading, error, fetchWishlist, addToWishlist, removeFromWishlist, isInWishlist]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
