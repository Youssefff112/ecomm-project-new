import axios from 'axios';

const BASE_URL = 'https://ecommerce.routemisr.com/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('userToken');
      if (token) {
        config.headers.token = token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Suppress logging for expected 500 errors on cart/wishlist (they mean "empty")
    const isExpected500 = 
      error.response?.status === 500 && 
      (error.config?.url?.includes('/cart') || 
       error.config?.url?.includes('/wishlist') ||
       error.config?.url?.includes('/orders'));
    
    if (!isExpected500) {
      if (error.message === 'Network Error') {
        console.error('Network Error - Cannot reach server:', error.config?.url);
      } else if (error.response) {
        console.error('API Error:', error.response.status, error.config?.url);
      }
    }
    
    // Only auto-logout on 401 for auth-related endpoints, not on every 401
    if (error.response?.status === 401 && error.config?.url?.includes('/auth/')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
