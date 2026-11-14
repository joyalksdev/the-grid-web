// src/services/authService.js
import API from './api';

export const authService = {
  sendOtp: async ({ phone, name }) => {
    const response = await API.post('/public/auth/send-otp', { phone, name });
    return response.data;
  },

  verifyOtp: async ({ phone, otp, name }) => {
    const response = await API.post('/public/auth/verify-otp', {
      phone,
      otp,
      name,
    });
    return response.data;
  },

  getProfile: async (phone) => {
    const response = await API.get('/public/auth/me', {
      params: phone ? { phone } : undefined,
    });
    return response.data;
  },

  updateProfile: async ({ name, phone }) => {
    const response = await API.put('/public/auth/profile', { name, phone });
    return response.data;
  },
};
