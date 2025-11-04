
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axois";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔄 Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ✅ Login now accepts email, name, and picture
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

        // ✅ Save everywhere
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("session_token", res.data.session_token);

        return true;
      }
      return false;
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("session_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
