import axios, { type AxiosInstance } from 'axios';

export const createApiClient = (baseURL: string): AxiosInstance => {
  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: true, // For Sanctum cookie-based auth if on same domain, or for CORS
  });

  return api;
};
