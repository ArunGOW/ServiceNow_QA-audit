//  // src/api/axios.js
// import axios from "axios";

//  // src/api/axios.js
// const api = axios.create({
//   //  baseURL: "/api",
//    baseURL: "http://52.56.78.188:8010/api", // This for local host 
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


// import axios from "axios";
// import TokenService from "./tokenService";

// const api = axios.create({
//   // baseURL: "http://52.56.78.188:8010/api",
//    baseURL: import.meta.env.VITE_API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });

//   failedQueue = [];
// };


// // Attach token to request
// api.interceptors.request.use(
//   (config) => {
//     const token = TokenService.getAccessToken();

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );


// // Handle token expiration
// api.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers["Authorization"] = "Bearer " + token;
//             return api(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const refreshToken = TokenService.getRefreshToken();

//         const res = await axios.post(
//           "http://52.56.78.188:8010/api/users/refresh-token",
//           {
//             refresh_token: refreshToken,
//           }
//         );

//         const newToken = res.data.session_token;

//         TokenService.updateAccessToken(newToken);

//         api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

//         processQueue(null, newToken);

//         originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

//         return api(originalRequest);

//       } catch (err) {

//         processQueue(err, null);

//         TokenService.clearTokens();

//         window.location.href = "/login";

//         return Promise.reject(err);

//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from "axios";
import TokenService from "./tokenService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = TokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Handle 401 errors and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = TokenService.getRefreshToken();

        // FIX: Sending refresh_token as a Query Parameter (?refresh_token=...)
        // We use the base axios instance to avoid interceptor loops
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/users/refresh-token`,
          null, // No body content
          {
            params: { refresh_token: refreshToken },
          }
        );

        const newToken = res.data.session_token;
        TokenService.updateAccessToken(newToken);

        // Update default header for future requests
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        processQueue(null, newToken);

        // Retry the current failed request
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        TokenService.clearTokens();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;