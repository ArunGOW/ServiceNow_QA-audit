 import axios from "axios";
import { getAuthToken } from "../context/AuthContext"; 

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ attach session_token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
