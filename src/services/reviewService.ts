import api from './api';

export const createReviewForProduct = async (productId: string, reviewData: any) => {
  const response = await api.post(`/v1/products/${productId}/reviews`, reviewData);
  return response.data;
};

export const getReviewsForProduct = async (productId: string) => {
  const response = await api.get(`/v1/products/${productId}/reviews`);
  return response.data;
};

export const getAllReviews = async (params = {}) => {
  const response = await api.get('/v1/reviews', { params });
  return response.data;
};

export const getReviewById = async (reviewId: string) => {
  const response = await api.get(`/v1/reviews/${reviewId}`);
  return response.data;
};

export const updateReview = async (reviewId: string, reviewData: any) => {
  const response = await api.put(`/v1/reviews/${reviewId}`, reviewData);
  return response.data;
};

export const deleteReview = async (reviewId: string) => {
  const response = await api.delete(`/v1/reviews/${reviewId}`);
  return response.data;
};
