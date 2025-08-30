// src/context/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('authUser');
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      localStorage.removeItem('authUser');
      return null;
    }
  });

  const loginUser = ({ email, password }) => {
    if (email === 'admin@example.com' && password === 'Admin123') {
      const adminUser = { email, isAdmin: true };
      setUser(adminUser);
      localStorage.setItem('authUser', JSON.stringify(adminUser));
    } else {
      const normalUser = { email, isAdmin: false };
      setUser(normalUser);
      localStorage.setItem('authUser', JSON.stringify(normalUser));
    }
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
