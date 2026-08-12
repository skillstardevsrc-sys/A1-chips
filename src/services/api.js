import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Intercept requests to inject Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("a1_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for auth expiration
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Optional auto logout or token refresh handler
    }
    return Promise.reject(error.response?.data || { message: error.message || "Network Error" });
  }
);
