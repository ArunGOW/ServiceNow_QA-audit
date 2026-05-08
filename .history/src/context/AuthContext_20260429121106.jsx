// import React, { createContext, useContext, useState, useEffect } from "react";
// import api from "../api/axois"; // ✅ Axios instance (with base URL & interceptors)

// // ✅ Create Authentication Context
// const AuthContext = createContext();

// /**
//  * 🔐 AuthProvider Component
//  * - Manages authentication state (user, token)
//  * - Provides login and logout functions to entire app
//  */
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // Stores logged-in user info

//   /**
//    * 🔄 useEffect: Load user from localStorage on initial app load
//    * This ensures the session persists even after page refresh
//    */
//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//   }, []);

//   /**
//    * ✅ login() - Handles user authentication using Google email
//    * @param {string} email - User's email from Google OAuth
//    * @param {string} name - (Optional) User's name
//    * @param {string} picture - (Optional) User's profile picture
//    * 
//    * Steps:
//    * 1. Sends email to backend for verification/login
//    * 2. If successful, stores user info and token in state + localStorage
//    * 3. Returns `true` if login succeeded, `false` otherwise
//    */
//   const login = async (email, name = "", picture = "") => {
//     try {
//       const res = await api.post("/users/login-google", { email });

//       console.log("🔑 Backend Login Response:", res.data);

//       if (res.data.status === "success") {
//         const userData = {
//           user_sid: res.data.user_sid,
//           user_type: res.data.user_type,
//           token: res.data.session_token,
//           email,
//           name,
//           picture,
//         };

//         // ✅ Save user data in state and localStorage for persistence
//         setUser(userData);
//         localStorage.setItem("user", JSON.stringify(userData));
//         localStorage.setItem("session_token", res.data.session_token);

//         return true;
//       }

//       // If backend returns failure
//       return false;
//     } catch (err) {
//       console.error("❌ Login error:", err.response?.data || err.message);
//       return false;
//     }
//   };

//   /**
//    * 🚪 logout() - Clears user data and token from both state and localStorage
//    * Used when the user logs out or session expires
//    */
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("session_token");
//   };

//   /**
//    * 💡 Provide global authentication state and methods
//    * Components can use `useAuth()` hook to access these values
//    */
//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// /**
//  * 🧩 Custom hook: useAuth()
//  * - Simplifies access to AuthContext values
//  * - Example usage: const { user, login, logout } = useAuth();
//  */
// export const useAuth = () => useContext(AuthContext);


// import React, { createContext, useContext, useState, useEffect } from "react";
// import api from "../api/axois";
// import TokenService from "../api/tokenService";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   // 🔄 Restore session on refresh
//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//     setLoading(false);
//   }, []);

//   /**
//    * ✅ Login using Google email
//    * RETURNS user object on success, null on failure
//    */
//   // const login = async (email, name = "", picture = "") => {
//   //   try {
//   //     const res = await api.post("/users/login-google", { email });

//   //     if (res.data.status === "success") {
//   //       const userData = {
//   //         user_sid: res.data.user_sid,
//   //         user_type: res.data.user_type, // qa_admin | agent
//   //         token: res.data.session_token,
//   //         email,
//   //         name,
//   //         picture,
//   //       };

//   //       setUser(userData);
//   //       localStorage.setItem("user", JSON.stringify(userData));
//   //       localStorage.setItem("session_token", res.data.session_token);

//   //       return userData;
//   //     }

//   //     return null;
//   //   } catch (err) {
//   //     console.error("❌ Login error:", err);
//   //     return null;
//   //   }
//   // };


// const login = async (email, name = "", picture = "") => {
//   try {
//     const res = await api.post("/users/login-google", { email });

//     if (res.data.status === "success") {

//       TokenService.setTokens(
//         res.data.session_token,
//         res.data.refresh_token
//       );

//       const userData = {
//         user_sid: res.data.user_sid,
//         user_type: res.data.user_type,
//         email,
//         name,
//         picture,
//       };

//       setUser(userData);
//       localStorage.setItem("user", JSON.stringify(userData));

//       return userData;
//     }

//     return null;

//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// };
//   // const logout = () => {
//   //   setUser(null);
//   //   localStorage.removeItem("user");
//   //   localStorage.removeItem("session_token");
//   // };

//   const logout = () => {
//   setUser(null);
//   TokenService.clearTokens();
// };
//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import TokenService from "../api/tokenService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, name = "", picture = "") => {
    try {
      const res = await api.post("/users/login-google", { email });

      if (res.data.status === "success") {
        // Store both tokens
        TokenService.setTokens(res.data.session_token, res.data.refresh_token);

        const userData = {
          user_sid: res.data.user_sid,
          user_type: res.data.user_type,
          email,
          name,
          picture,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
      }
      return null;
    } catch (err) {
      console.error("Login failed:", err);
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    TokenService.clearTokens();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
