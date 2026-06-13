import axios from 'axios';

// The base URL for the backend API.
// In a production app, this should come from an environment variable (e.g., import.meta.env.VITE_API_URL).
const API_BASE_URL = 'http://localhost:3000';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach the JWT token to the Authorization header if it exists.
axiosClient.interceptors.request.use(
  (config) => {
    // We will store the JWT in localStorage under the key 'admin_access_token'
    const token = localStorage.getItem('admin_access_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors like 401 Unauthorized
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the backend returns a 401, it means the token is invalid or expired.
    // We should clear the token and potentially redirect to login (handled later in the Context/Router).
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('admin_access_token');
      // Note: Full logout logic/redirect will be handled by the AuthContext later.
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
