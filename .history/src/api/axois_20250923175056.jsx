import axios from "axios";
import { getAuthToken } from "../context/AuthContext"; 

// Create axios instance with base URL
 const fetchData = async () => {
  const res = await api.post("/users/get/incidents", { user_sid: "..." });
};

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
