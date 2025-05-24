// src/api/bookService.ts
import httpClient from './httpClient';

export const initLogin = async (jsonParams: any) => {
  const response = await httpClient.post('/users/login', jsonParams);
  return response.data;
}