// src/config/apiConfig.ts

const ENV = {
    development: {
      API_BASE_URL: 'http://localhost:3005/api',
    },
    production: {
      API_BASE_URL: 'https://api.tuapi.com/api',
    },
  };
  
  const getEnv = (): keyof typeof ENV => {
    // Puedes mejorar esto usando una variable de entorno real
    return __DEV__ ? 'development' : 'production';
  };
  
  export const API_CONFIG = ENV[getEnv()];