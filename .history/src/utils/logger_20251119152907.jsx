// src/utils/logger.js

const isDevelopment = process.env.NODE_ENV === "development";

// Format the timestamp
const time = () => new Date().toLocaleString();

// Centralized logger
const logger = {
  info: (...msg) => {
    if (isDevelopment) {
      console.log(`ℹ️ [INFO] :`, ...msg);
    }
  },

  warn: (...msg) => {
    if (isDevelopment) {
      console.warn(`⚠️ [WARN] ${time()}:`, ...msg);
    }
  },

  error: (...msg) => {
    // Always show errors even in production
    console.error(`❌ [ERROR] ${time()}:`, ...msg);
  },
};

export default logger;
