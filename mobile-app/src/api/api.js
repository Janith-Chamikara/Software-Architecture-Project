import axios from "axios";
import { getAccessToken } from "../storage/tokenStorage";

// Android emulator maps 10.0.2.2 to the host machine's localhost
export const BASE_URL = "http://10.0.2.2:3000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export function getErrorMessage(error) {
  if (error?.response?.data?.message) {
    const msg = error.response.data.message;
    return Array.isArray(msg) ? msg[0] : msg;
  }
  const status = error?.response?.status;
  const statusMessages = {
    400: "Please check the entered details.",
    401: "Session expired. Please login again.",
    403: "You do not have permission for this action.",
    404: "Fine not found.",
    409: "This fine may already be paid.",
    500: "Server error. Please try again later.",
  };
  return statusMessages[status] || error?.message || "Something went wrong. Please try again.";
}

export default api;
