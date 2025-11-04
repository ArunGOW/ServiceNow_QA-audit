//  // src/context/AuthContext.jsx
// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const login = (userData) => {
//     setUser(userData);
//     localStorage.setItem("user", JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // ✅ Add this export
// export const useAuth = () => useContext(AuthContext);


// src/context/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const login = (userData) => {
//     setUser(userData);
//     localStorage.setItem("user", JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


// step 1 

 import { createContext, useContext, useState } from "react";
 import axios from "axios";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const res = await axios.post("http://localhost:8000/api/users/login-google", credentials);
    if (res.data.status === "success") {
      const userData = {
        user_sid: res.data.user_sid,
        user_type: res.data.user_type,
        token: res.data.session_token,  // ✅ save token
      };
      setUser(userData);

      // optional: save to localStorage so refresh won't lose it
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
