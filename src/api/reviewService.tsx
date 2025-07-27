import httpClient from './httpClient';

export const registerReviewBook = async (jsonParams: any) => {
  const response = await httpClient.post('/review/register', jsonParams);
  return response.data;
};