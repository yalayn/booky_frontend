import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

// Simulación de obtención de token (ajusta con AsyncStorage o contexto real)
let accessToken: string | null = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTA1NzgsInVzZXJuYW1lIjoieS5hbGF5bkBnbWFpbC5jb20iLCJpYXQiOjE3NDQ0OTk0NTgsImV4cCI6MTc0NDUwMzA1OH0.JQMp_UppzTFfvLXbwhGBldEbUDTUsA2T5i78uel01W0";

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};

const httpClient = axios.create({
  baseURL: API_CONFIG.API_BASE_URL,
});

// Interceptor para agregar el token a cada request
httpClient.interceptors.request.use(
  async (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default httpClient;