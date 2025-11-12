import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axois"; // ✅ Axios instance (with base URL & interceptors)

// ✅ Create Authentication Context
const AuthContext = createContext();

/**
 * 🔐 AuthProvider Component
 * - Manages authentication state (user, token)
 * - Provides login and logout functions to entire app
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores logged-in user info

  /**
   * 🔄 useEffect: Load user from localStorage on initial app load
   * This ensures the session persists even after page refresh
   */
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  /**
   * ✅ login() - Handles user authentication using Google email
   * @param {string} email - User's email from Google OAuth
   * @param {string} name - (Optional) User's name
   * @param {string} picture - (Optional) User's profile picture
   * 
   * Steps:
   * 1. Sends email to backend for verification/login
   * 2. If successful, stores user info and token in state + localStorage
   * 3. Returns `true` if login succeeded, `false` otherwise
   */
  const login = async (email, name = "", picture = "") => {
    try {
      const res = await api.post("/users/login-google", { email });

      console.log("🔑 Backend Login Response:", res.data);

      if (res.data.status === "success") {
        const userData = {
          user_sid: res.data.user_sid,
          user_type: res.data.user_type,
          token: res.data.session_token,
          email,
          name,
          picture,
        };

        // ✅ Save user data in state and localStorage for persistence
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("session_token", res.data.session_token);

        return true;
      }

      // If backend returns failure
      return false;
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      return false;
    }
  };

  /**
   * 🚪 logout() - Clears user data and token from both state and localStorage
   * Used when the user logs out or session expires
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("session_token");
  };

  /**
   * 💡 Provide global authentication state and methods
   * Components can use `useAuth()` hook to access these values
   */
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * 🧩 Custom hook: useAuth()
 * - Simplifies access to AuthContext values
 * - Example usage: const { user, login, logout } = useAuth();
 */
export const useAuth = () => useContext(AuthContext);

