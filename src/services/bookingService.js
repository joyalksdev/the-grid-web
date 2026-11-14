// src/services/bookingService.js
import API from './api';

export const bookingService = {
  getPublicConfig: async () => {
    const response = await API.get('/public/config');
    return response.data;
  },

  getPublicAvailability: async (date) => {
    const response = await API.get('/public/availability', {
      params: { date },
    });
    return response.data;
  },

  calculatePublicPrice: async (mode, duration) => {
    const response = await API.post('/public/calculate-price', {
      mode,
      duration,
    });
    return response.data;
  },

  createPaymentOrder: async (bookingData) => {
    const response = await API.post('/public/payment/create-order', bookingData);
    return response.data;
  },

  verifyPaymentOrder: async (orderId) => {
    const response = await API.post('/public/payment/verify', { orderId });
    return response.data;
  },

  createOnlineBooking: async (bookingData) => {
    const response = await API.post('/public/bookings', bookingData);
    return response.data;
  },

  getPublicTicket: async (token) => {
    const response = await API.get(`/public/ticket/${token}`);
    return response.data;
  },
};
