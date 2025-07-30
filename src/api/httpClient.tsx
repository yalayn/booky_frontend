import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';
import { initRefreshToken } from '../api/loginService'; // Asegúrate de que esta ruta sea correcta
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simulación de obtención de token (ajusta con AsyncStorage o contexto real)
let accessToken: string | null;

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

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es de autenticación, intenta refrescar el token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No se pudo obtener el refresh token');
        }
        const response = await initRefreshToken(refreshToken);
        if (!response) {
          throw new Error('No se pudo obtener un nuevo access token');
        }
        const newAccessToken  = response.data.token;
        setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;