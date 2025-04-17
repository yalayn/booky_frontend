// src/api/bookService.ts
import httpClient from './httpClient';

export const getBooks = async () => {
  const response = await httpClient.get('/userbook/list_by_state');
  return response.data;
};

// export const addBook = async (book: any) => {
//   const res = await axios.post(`${API_BASE}/books`, book);
//   return res.data;
// };

// export const updateBook = async (id: string, updates: any) => {
//   const res = await axios.put(`${API_BASE}/books/${id}`, updates);
//   return res.data;
// };