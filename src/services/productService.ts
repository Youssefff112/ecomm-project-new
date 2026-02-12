import api from './api';

export const getAllProducts = async (params = {}) => {
  const response = await api.get('/v1/products', { params });
  return response.data;
};

export const getProductById = async (productId: string) => {
  const response = await api.get(`/v1/products/${productId}`);
  return response.data;
};

export const getAllCategories = async () => {
  const response = await api.get('/v1/categories');
  return response.data;
};

export const getCategoryById = async (categoryId: string) => {
  const response = await api.get(`/v1/categories/${categoryId}`);
  return response.data;
};

export const getAllSubCategories = async (params = {}) => {
  const response = await api.get('/v1/subcategories', { params });
  return response.data;
};

export const getSubCategoryById = async (subCategoryId: string) => {
  const response = await api.get(`/v1/subcategories/${subCategoryId}`);
  return response.data;
};

export const getSubCategoriesByCategory = async (categoryId: string) => {
  const response = await api.get(`/v1/categories/${categoryId}/subcategories`);
  return response.data;
};

export const getAllBrands = async (params = {}) => {
  const response = await api.get('/v1/brands', { params });
  return response.data;
};

export const getBrandById = async (brandId: string) => {
  const response = await api.get(`/v1/brands/${brandId}`);
  return response.data;
};
