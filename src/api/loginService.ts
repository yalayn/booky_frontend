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
 * Registers a new user with the provided parameters.
 * @param jsonParams 
 * @returns 
 */
export const addUser = async (jsonParams: any) => {
  const response = await httpClient.post('/users/register', jsonParams);
  return response.data;
}