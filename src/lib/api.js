import axios from 'axios';
import { io } from 'socket.io-client';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://api.thegridgaming.fun/api';

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || 'https://api.thegridgaming.fun';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('grid_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let socketInstance = null;

export function getSocket() {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
  }
  return socketInstance;
}
