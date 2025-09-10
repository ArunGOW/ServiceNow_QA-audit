import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

const USERS = {
  'agent@example.com': { role: 'agent', name: 'Agent User' },
  'qa@example.com': { role: 'qa', name: 'QA Admin' }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

   const login = (email, role, full_name) => {
  const userData = { email, role, full_name };
  setUser(userData);
  localStorage.setItem("user", JSON.stringify(userData));
};

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}