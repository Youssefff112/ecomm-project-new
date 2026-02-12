import api from './api';

export const createCashOrder = async (cartId: string, shippingAddress?: any) => {
  const response = await api.post(`/v1/orders/${cartId}`, { shippingAddress });
  return response.data;
};

export const createCashOrderV2 = async (cartId: string, shippingAddress?: any) => {
  const response = await api.post(`/v2/orders/${cartId}`, { shippingAddress });
  return response.data;
};

export const getAllOrders = async () => {
  const response = await api.get('/v1/orders/');
  return response.data;
};

export const getUserOrders = async (userId: string) => {
  const response = await api.get(`/v1/orders/user/${userId}`);
  return response.data;
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
