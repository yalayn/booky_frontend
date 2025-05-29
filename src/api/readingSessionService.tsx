import httpClient from './httpClient';

export const getReadingSessionsToday = async () => {
  const response = await httpClient.get('/reading-sessions/user_count_day');
  return response.data;
};

export const registerReadingSessions = async (jsonParams:any) => {
  const response = await httpClient.post('/reading-sessions/register',jsonParams);
  return response.data;
};