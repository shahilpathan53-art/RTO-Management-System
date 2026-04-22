import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('rtoUser')) || null);
  const [token, setToken] = useState(localStorage.getItem('rtoToken') || null);

  const login = (userData) => {
    setUser(userData);
    setToken(userData.token);
    localStorage.setItem('rtoUser', JSON.stringify(userData));
    localStorage.setItem('rtoToken', userData.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('rtoUser');
    localStorage.removeItem('rtoToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
