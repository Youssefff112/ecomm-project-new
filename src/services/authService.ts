import api from './api';

export const signup = async (userData: any) => {
  const response = await api.post('/v1/auth/signup', userData);
  return response.data;
};

export const signin = async (credentials: any) => {
  const response = await api.post('/v1/auth/signin', credentials);
  return response.data;
};

export const forgotPassword = async (data: { email: string }) => {
  const response = await api.post('/v1/auth/forgotPasswords', data);
  return response.data;
};

export const verifyResetCode = async (resetCode: string) => {
  const response = await api.post('/v1/auth/verifyResetCode', { resetCode });
  return response.data;
};

export const resetPassword = async (email: string, newPassword: string) => {
  const response = await api.put('/v1/auth/resetPassword', { email, newPassword });
  return response.data;
};

export const updateLoggedUserPassword = async (currentPassword: string, password: string, rePassword: string) => {
  const response = await api.put('/v1/users/changeMyPassword', {
    currentPassword,
    password,
    rePassword,
  });
  return response.data;
};

export const updateLoggedUserData = async (userData: any) => {
  const response = await api.put('/v1/users/updateMe/', userData);
  return response.data;
};

export const getAllUsers = async (params = {}) => {
  const response = await api.get('/v1/users', { params });
  return response.data;
};

export const verifyToken = async () => {
  const response = await api.get('/v1/auth/verify');
  return response.data;
};
