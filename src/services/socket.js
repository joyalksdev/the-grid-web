// src/services/socket.js
import { io } from 'socket.io-client';

function resolveSocketUrl() {
  let raw = (
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_API_URL ||
    'http://localhost:5000'
  ).trim();

  raw = raw.replace(/^(https?):(?!\/\/)/i, '$1://');

  if (/^https:\/\/(localhost|127\.0\.0\.1)/i.test(raw)) {
    raw = raw.replace(/^https:\/\//i, 'http://');
  }

  // Strip trailing /api/public, /api, or trailing slashes so Socket.io connects to the root host
  return raw
    .replace(/\/api\/public\/?$/i, '')
    .replace(/\/api\/?$/i, '')
    .replace(/\/+$/, '');
}

export const socket = io(resolveSocketUrl(), {
  autoConnect: true,
  withCredentials: true,
  transports: ['polling', 'websocket'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});
