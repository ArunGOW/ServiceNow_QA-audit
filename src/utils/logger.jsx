// // src/utils/logger.js

// const isDevelopment = process.env.NODE_ENV === "development";

// // Format the timestamp
// const time = () => new Date().toLocaleString();

// // Centralized logger
// const logger = {
//   info: (...msg) => {
//     if (isDevelopment) {
//       console.log(`ℹ️ [INFO]:`, ...msg);
//     }
//   },

//   warn: (...msg) => {
//     if (isDevelopment) {
//       console.warn(`⚠️ [WARN]:`, ...msg);
//     }
//   },

//   error: (...msg) => {
//     // Always show errors even in production
//     console.error(`❌ [ERROR]:`, ...msg);
//   },
// };

// export default logger;

// src/utils/logger.js

const isDev = import.meta.env.MODE === "development"; // for Vite
// const isDev = process.env.NODE_ENV === "development"; // for CRA

const logger = {
  info: (message, data = null) => {
    if (isDev) console.info(`ℹ️ INFO: ${message}`, data || "");
  },

  success: (message, data = null) => {
    if (isDev) console.log(`✅ SUCCESS: ${message}`, data || "");
  },

  warn: (message, data = null) => {
    if (isDev) console.warn(`⚠️ WARNING: ${message}`, data || "");
  },

  error: (message, data = null) => {
    if (isDev) console.error(`❌ ERROR: ${message}`, data || "");
  }
};

export default logger;
