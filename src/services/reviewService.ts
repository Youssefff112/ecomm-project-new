import api from './api';

/**
 * Review Service - Handles all review-related API calls
 * Users can create, view, update, and delete reviews for products
 */

export const createReviewForProduct = async (productId: string, reviewData: any) => {
  // Create review using the general reviews endpoint with product in the body
  const response = await api.post('/v1/reviews', { 
    ...reviewData, 
    product: productId 
  });
  return response.data;
};

export const getReviewsForProduct = async (productId: string) => {
  // Use the general reviews endpoint with product filter
  const response = await api.get('/v1/reviews', { 
    params: { product: productId } 
  });
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
