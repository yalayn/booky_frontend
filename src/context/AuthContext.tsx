// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAccessToken, clearAccessToken } from '../api/httpClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) setAccessToken(token);
      setIsAuthenticated(!!token);
      setCheckingAuth(false);
    };
    checkToken();
  }, []);

  const login = async (token:string) => {
    await AsyncStorage.setItem('authToken', token);
    setAccessToken(token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    clearAccessToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, checkingAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};