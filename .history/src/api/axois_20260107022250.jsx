 // src/api/axios.js
import axios from "axios";

 // src/api/axios.js
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});


// 🔑 Attach token automatically to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("session_token"); // token stored at login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
