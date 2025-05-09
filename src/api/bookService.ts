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

export const updateStateBook = async (jsonParams: any) => {
  const response = await httpClient.put('/userbook/update_state', jsonParams);
  return response.data;
};

export const registerReviewBook = async (jsonParams: any) => {
  const response = await httpClient.post('/userbook/register_review', jsonParams);
  return response.data;
};

export const deleteBook = async (jsonParams: any) => {
  const response = await httpClient.post('/userbook/remove',jsonParams);
  return response.data;
}