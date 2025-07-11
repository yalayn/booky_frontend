// src/api/bookService.ts
import httpClient from './httpClient';

/**
 * Validates the user credentials and initializes the login process.
 * @param jsonParams 
 * @returns 
 */
export const initLogin = async (jsonParams: any) => {
  const response = await httpClient.post('/users/login', jsonParams);
  return response.data;
}

/**
 * Logs out the current user.
 * @returns 
 */
export const initLogout = async () => {
  const response = await httpClient.post('/users/logout');
  return response.data;
}

/**
 * Refreshes the access token using the provided refresh token.
 * @param refreshToken 
 * @returns 
 */
export const initRefreshToken = async (refreshToken: any) => {
  const response = await httpClient.post('/users/refresh-token', null, { headers: { 'refresh_token': refreshToken } });
  return response.data;
}

/**
 * Registers a new user with the provided parameters.
 * @param jsonParams 
 * @returns 
 */
export const addUser = async (jsonParams: any) => {
  const response = await httpClient.post('/users/register', jsonParams);
  return response.data;
}

/**
 * Pings the server to check connectivity, then waits 10 seconds.
 * @returns The server's ping response.
 */
export const pingServer = async () => {
  const response = await httpClient.get('/ping');
  return response.data;
}