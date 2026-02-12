import api from './api';

export const addToCart = async (productId: string) => {
  const response = await api.post('/v2/cart', { productId });
  return response.data;
};

export const getCart = async () => {
  const response = await api.get('/v2/cart');
  return response.data;
};

export const updateCartItemQuantity = async (productId: string, count: number) => {
  const response = await api.put(`/v2/cart/${productId}`, { count });
  return response.data;
};

export const removeCartItem = async (productId: string) => {
  const response = await api.delete(`/v2/cart/${productId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete('/v2/cart');
  return response.data;
};

export const applyCoupon = async (couponName: string) => {
  const response = await api.put('/v2/cart/applyCoupon', { couponName });
  return response.data;
};
