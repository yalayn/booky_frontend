import httpClient from './httpClient';

export const getReadingSessionsToday = async () => {
  const response = await httpClient.get('/reading-sessions/today');
  return response.data;
};

export const registerReadingSessions = async (jsonParams:any) => {
  const response = await httpClient.post('/reading-sessions/register',jsonParams);
  return response.data;
};

export const getReadingSessionsHistory = async () => {
  const response = await httpClient.get('/reading-sessions/history');
  return response.data;
}