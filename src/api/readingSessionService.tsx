import httpClient from './httpClient';

/**
 * Obtiene las sesiones de lectura del usuario.
 * @returns 
 */
export const registerReadingSessions = async (jsonParams:any) => {
  const response = await httpClient.post('/reading-sessions/register',jsonParams);
  return response.data;
};

/**
 * Actualiza una sesión de lectura.
 * @param jsonParams 
 * @returns 
 */
export const updateReadingSessions = async (jsonParams:any) => {
  const response = await httpClient.put('/reading-sessions/update/',jsonParams);
  return response.data;
};

/**
 * Elimina una sesión de lectura.
 * @param _id 
 * @returns 
 */
export const deleteReadingSessions = async (_id:any) => {
  const response = await httpClient.delete('/reading-sessions/delete/' + _id);
  return response.data;
};

/**
 * Obtiene el historial de sesiones de lectura del usuario.
 * @returns 
 */
export const getReadingSessionsHistory = async () => {
  const response = await httpClient.get('/reading-sessions/history');
  return response.data;
};

/**
 * Obtiene las sesiones de lectura del día actual.
 * @returns 
 */
export const getReadingSessionsToday = async () => {
  const response = await httpClient.get('/reading-sessions/today');
  return response.data;
};