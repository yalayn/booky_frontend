// src/api/bookService.ts
import httpClient from './httpClient';

export const getListBooks = async (params: any) => {
  const response = await httpClient.get(`/userbook/list?page=${params.page}&limit=${params.limit}`);
  return response.data;
};

export const getBooks = async () => {
  const response = await httpClient.get('/userbook/list_by_state');
  return response.data;
};

export const addBook = async (jsonParams: any) => {
  const response = await httpClient.post('/userbook/add', jsonParams);
  return response.data;
};

export const updateStateBook = async (jsonParams: any) => {
  const response = await httpClient.put('/userbook/update_state', jsonParams);
  return response.data;
};

export const deleteBook = async (jsonParams: any) => {
  const response = await httpClient.post('/userbook/remove',jsonParams);
  return response.data;
}

export const searchBook = async (query: string, cancelToken?: any) => {
  const response = await httpClient.get(`/search/book?title=${query}`, {
    cancelToken,
  });
  return response.data;
};