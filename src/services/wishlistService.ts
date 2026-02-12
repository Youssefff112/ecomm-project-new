import api from './api';

export const addToWishlist = async (productId: string) => {
  const response = await api.post('/v1/wishlist', { productId });
  return response.data;
};

export const getWishlist = async () => {
  const response = await api.get('/v1/wishlist');
  return response.data;
};

export const removeFromWishlist = async (productId: string) => {
  const response = await api.delete(`/v1/wishlist/${productId}`);
  return response.data;
};
