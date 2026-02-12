export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^01[0125][0-9]{8}$/;
  return phoneRegex.test(phone);
};

export const validateName = (name) => {
  return name && name.trim().length >= 3;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};
