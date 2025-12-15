import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { LoginResponse } from './types';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: any) => {
      const { data } = await apiClient.post<LoginResponse>('/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/logout');
    },
    onSuccess: () => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    },
  });
};
