// src/services/cashfree.js
import { load } from '@cashfreepayments/cashfree-js';

let cashfreeInstance = null;
let loadedMode = null;

/**
 * Loads the Cashfree v3 JS SDK for the given mode ('sandbox' | 'production')
 * and opens the seamless popup checkout modal.
 */
export async function openCashfreeCheckout({
  paymentSessionId,
  mode = 'sandbox',
  redirectTarget = '_modal',
}) {
  const normalizedMode =
    String(mode).toLowerCase() === 'production' ? 'production' : 'sandbox';

  if (!cashfreeInstance || loadedMode !== normalizedMode) {
    cashfreeInstance = await load({ mode: normalizedMode });
    loadedMode = normalizedMode;
  }

  if (!cashfreeInstance) {
    throw new Error('Failed to load Cashfree payment gateway SDK.');
  }

  return cashfreeInstance.checkout({
    paymentSessionId,
    redirectTarget,
  });
}
