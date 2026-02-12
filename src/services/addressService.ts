import api from './api';

export const addAddress = async (addressData: any) => {
  const response = await api.post('/v1/addresses', addressData);
  return response.data;
};

export const getAddresses = async () => {
  const response = await api.get('/v1/addresses');
  return response.data;
};

export const getAddressById = async (addressId: string) => {
  const response = await api.get(`/v1/addresses/${addressId}`);
  return response.data;
};

export const removeAddress = async (addressId: string) => {
  const response = await api.delete(`/v1/addresses/${addressId}`);
  return response.data;
};

// Alias for removeAddress to match usage in components
export const deleteAddress = removeAddress;
