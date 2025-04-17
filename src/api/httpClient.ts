import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

// Simulación de obtención de token (ajusta con AsyncStorage o contexto real)
let accessToken: string | null = "";

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