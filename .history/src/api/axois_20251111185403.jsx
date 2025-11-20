//  // src/api/axios.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // 🔑 Attach token automatically to every request
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("session_token"); // token stored at login
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default api;

// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://18.130.235.113:8010",   // ✅ updated
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("session_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

