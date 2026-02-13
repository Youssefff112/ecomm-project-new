import axios from 'axios';

// Use proxy route for API calls to avoid CORS issues
const USE_PROXY = typeof window !== 'undefined';
const BASE_URL = USE_PROXY ? '/api/proxy' : 'https://ecommerce.routemisr.com/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
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
    // Suppress logging for expected 500 errors (they often mean "empty" or "not found")
    const isExpected500 = 
      error.response?.status === 500 && 
      (error.config?.url?.includes('/cart') || 
       error.config?.url?.includes('/wishlist') ||
       error.config?.url?.includes('/orders') ||
       error.config?.url?.includes('/reviews') ||
       error.config?.url?.includes('/products'));
    
    if (!isExpected500) {
      if (error.message === 'Network Error') {
        console.error('Network Error - Cannot reach server:', error.config?.url);
      } else if (error.response) {
        console.error('API Error:', error.response.status, error.config?.url);
      }
    }
    
    // Handle 401 Unauthorized - token is invalid or expired
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear auth data
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        
        // Dispatch custom event to notify AuthProvider
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        // Only redirect to login if user is trying to access protected routes
        // Avoid redirect loops
        const currentPath = window.location.pathname;
        const publicPaths = ['/login', '/signup', '/forgot-password', '/'];
        if (!publicPaths.includes(currentPath)) {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
