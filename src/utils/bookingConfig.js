// src/utils/bookingConfig.js

/**
 * Checks whether online booking/payments are currently active.
 * Controlled by VITE_BOOKING_ENABLED in .env (defaults to false if set to 'false').
 */
export function isBookingEnabled() {
  const envVal = import.meta.env.VITE_BOOKING_ENABLED;
  if (envVal === false || envVal === 'false' || envVal === '0') {
    return false;
  }
  return true;
}
