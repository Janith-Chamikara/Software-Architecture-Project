import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

/**
 * Step 1 — Create a Stripe PaymentIntent on the backend.
 * Calls: POST /api/payment/create-intent
 *
 * @returns { clientSecret, fine } — clientSecret is passed to Stripe.js
 */
export const createPaymentIntent = async (fineReference, categoryIdentifier) => {
  const response = await axios.post(`${API_BASE}/payment/create-intent`, {
    fineReference,
    categoryIdentifier,
  });
  return response.data;
};

/**
 * Step 2 — After Stripe confirms the charge, tell the backend to:
 *   - Mark the fine as PAID in the database
 *   - Send an SMS notification to the issuing officer
 * Calls: POST /api/payment/confirm
 *
 * @returns { success: true, message }
 */
export const confirmPayment = async (paymentIntentId, fineReference) => {
  const response = await axios.post(`${API_BASE}/payment/confirm`, {
    paymentIntentId,
    fineReference,
  });
  return response.data;
};
