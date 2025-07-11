// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAccessToken, clearAccessToken } from '../api/httpClient';
import { initRefreshToken } from '../api/loginService';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Refresh the access token using the refresh token.
   * @returns {Promise<boolean>} Returns true if the access token was successfully refreshed, false otherwise.
   */
  const refreshAccessToken = async () => {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) return false;
    try {
      const response = await initRefreshToken(refreshToken);
      if (!response) {
        throw new Error('No se pudo obtener un nuevo access token');
      }
      const newAccessToken  = response.data.token;
      await AsyncStorage.setItem('authToken', newAccessToken);
      setAccessToken(newAccessToken);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('refreshToken');
      clearAccessToken();
      setIsAuthenticated(false);
      return false;
    }
  };

  /**
   * Check if the provided token is valid based on its expiration time.
   * @param {string} authToken - The JWT token to validate.
   * @returns {boolean} Returns true if the token is valid, false otherwise.
   */
  const isTokenValid = (authToken) => {
    try {
      const { exp } = jwtDecode(authToken);
      if (!exp) return false;
      const currentTime = Date.now() / 1000;
      return currentTime < exp;
    } catch {
      return false;
    }
  };

  /**
   * Logs in the user by storing the access token, refresh token, and user info.
   * @param {Object} params - The parameters for login.
   * @param {string} params.accessToken - The access token.
   * @param {string} params.refreshToken - The refresh token.
   * @param {Object} params.userInfo - The user information.
   */
  const login = async ({ accessToken, refreshToken, userInfo }) => {
    if (!accessToken || !refreshToken) {
      throw new Error('Access token and refresh token are required for login');
    }
    await AsyncStorage.setItem('authToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    await AsyncStorage.setItem('authUserInfo', JSON.stringify(userInfo));
    setAccessToken(accessToken);
    setIsAuthenticated(true);
  };

  /**
   * Logs out the user by clearing the stored tokens and user info.
   */
  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('refreshToken');
    clearAccessToken();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const checkToken = async () => {
      const authToken    = await AsyncStorage.getItem('authToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const tokenValid   = isTokenValid(authToken);
      if (authToken && tokenValid) {
        setAccessToken(authToken);
        setIsAuthenticated(true);
      } else if (refreshToken) {
        await refreshAccessToken();
      } else {
        setIsAuthenticated(false);
      }
      setCheckingAuth(false);
    };
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, checkingAuth, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};