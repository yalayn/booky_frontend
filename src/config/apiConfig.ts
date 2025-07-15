// src/config/apiConfig.ts

const ENV = {
  development: {
    API_BASE_URL: 'http://localhost:3005/api',
  },
  production: {
    API_BASE_URL: 'https://booky-backend-node.onrender.com/api',
  },
};

const getEnv = (): keyof typeof ENV => {
  // Usa la variable de entorno real
  // const env = process.env.NODE_ENV;
  const env = 'production'; // For testing purposes, we set it to production
  // const env = 'development'; // For testing purposes, we set it to development
  console.log('Current environment:', env);
  // if (env === 'development') return 'development';
  return env;
};

export const API_CONFIG = ENV[getEnv()];