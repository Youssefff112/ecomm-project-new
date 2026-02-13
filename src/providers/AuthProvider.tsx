'use client';

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';

interface User {
  name?: string;
  email?: string;
  token?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (userToken: string, userData?: User | null) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Helper function to sync state with localStorage
  const syncWithLocalStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('userToken');
      const storedUser = localStorage.getItem('userData');
      
      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (e) {
            console.error('AuthProvider: Failed to parse user data', e);
            setUser({ token: storedToken });
          }
        } else {
          setUser({ token: storedToken });
        }
      } else {
        // If no token in localStorage, clear the state
        setToken(null);
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    // Initialize from localStorage on mount
    syncWithLocalStorage();
    setLoading(false);

    // Listen for storage changes (from other tabs or API interceptor)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userToken' || e.key === 'userData' || e.key === null) {
        syncWithLocalStorage();
      }
    };

    // Listen for browser back/forward navigation
    const handlePopState = () => {
      syncWithLocalStorage();
    };

    // Listen for page visibility changes (when user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        syncWithLocalStorage();
      }
    };

    // Listen for custom logout event from API interceptor
    const handleAuthLogout = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('auth:logout', handleAuthLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, [syncWithLocalStorage]);

  const login = useCallback((userToken: string, userData: User | null = null) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userToken', userToken);
      if (userData) {
        localStorage.setItem('userData', JSON.stringify(userData));
      }
      // Force a sync to ensure state is updated
      setToken(userToken);
      setUser(userData || { token: userToken });
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      // Dispatch custom event to ensure all listeners are notified
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token,
  }), [user, token, loading, login, logout, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
