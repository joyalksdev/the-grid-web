// src/services/api.js
import axios from 'axios';

function resolveApiBaseUrl() {
  let raw = (
    import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  ).trim();

  // Fix accidental missing slashes like "http:localhost" or "https:localhost"
  raw = raw.replace(/^(https?):(?!\/\/)/i, '$1://');

  // Localhost backend always runs on http://
  if (/^https:\/\/(localhost|127\.0\.0\.1)/i.test(raw)) {
    raw = raw.replace(/^https:\/\//i, 'http://');
  }

  // Strip trailing slashes and accidental "/public" suffix so "/public/..." routes don't double up
  raw = raw.replace(/\/+$/, '').replace(/\/api\/public$/i, '/api');

  if (!raw.endsWith('/api')) {
    raw = `${raw}/api`;
  }

  return raw;
}

const API = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('grid_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
