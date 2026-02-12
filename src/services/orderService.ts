import api from './api';

/**
 * Order Service
 * - Cash orders use v2 endpoint (createCashOrder)
 * - Checkout sessions use v1 endpoint
 * - Getting orders uses v1 endpoint
 */

export const createCashOrder = async (cartId: string, shippingAddress?: any) => {
  const response = await api.post(`/v2/orders/${cartId}`, { shippingAddress });
  return response.data;
};

export const createCashOrderV2 = async (cartId: string, shippingAddress?: any) => {
  const response = await api.post(`/v2/orders/${cartId}`, { shippingAddress });
  return response.data;
};

export const getAllOrders = async () => {
  // This endpoint returns orders for the logged-in user automatically
  const response = await api.get('/v1/orders/');
  return response.data;
};

export const getUserOrders = async (userId?: string) => {
  // The /v1/orders endpoint filters by logged-in user automatically via token
  // No need to pass userId
  try {
    const response = await api.get('/v1/orders/');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch orders:', error.response?.status);
    // If it's a 500 or 404, it likely means no orders exist
    if (error.response?.status === 500 || error.response?.status === 404) {
      console.log('No orders found - returning empty array');
      return { data: [] };
    }
    throw error;
  }
};

export const createCheckoutSession = async (
  cartId: string,
  shippingAddress?: any,
  successUrl?: string,
  cancelUrl?: string
) => {
  // Build query params for success and cancel URLs
  const params = new URLSearchParams();
  if (successUrl) params.append('url', successUrl);
  if (cancelUrl) params.append('cancelUrl', cancelUrl);
  
  const queryString = params.toString();
  const url = `/v1/orders/checkout-session/${cartId}${queryString ? `?${queryString}` : ''}`;
  
  const response = await api.post(url, { shippingAddress });
  return response.data;
};
