import axios from "axios";
import { getAuthToken } from "../context/AuthContext"; 

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Add interceptor to attach token before every request
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
