import httpClient from './httpClient';

export const registerUserGoal = async (jsonParams:any) => {
  const response = await httpClient.post('/usergoal/register', jsonParams);
  return response.data;
}

export const getUserGoal = async (goalType: string) => {
  const response = await httpClient.get(`usergoal/find_by_type/${goalType}`);
  return response.data;
}