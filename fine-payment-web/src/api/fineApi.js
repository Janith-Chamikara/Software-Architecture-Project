import axios from 'axios';

// Base URL of the NestJS backend — all routes are prefixed with /api
const API_BASE = 'http://localhost:3000/api';

/**
 * Look up a fine before payment.
 * Calls: GET /api/fines/lookup?ref=<referenceNumber>&cat=<categoryIdentifier>
 *
 * @returns Fine object { referenceNumber, categoryIdentifier, amount, district, status, issuedAt }
 * @throws AxiosError with status 404 if no matching fine exists
 */
export const lookupFine = async (referenceNumber, categoryIdentifier) => {
  const response = await axios.get(`${API_BASE}/fines/lookup`, {
    params: { ref: referenceNumber, cat: categoryIdentifier },
  });
  return response.data;
};
