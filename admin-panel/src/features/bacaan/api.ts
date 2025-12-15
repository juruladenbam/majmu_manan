import { apiClient } from '@/api/client';
import type { Bacaan } from '@project/shared';

export const getBacaanList = async () => {
  const { data } = await apiClient.get<Bacaan[]>('/admin/bacaan');
  return data;
};

export const getBacaanDetail = async (id: number) => {
  const { data } = await apiClient.get<Bacaan>(`/admin/bacaan/${id}`);
  return data;
};

export const createBacaan = async (payload: Partial<Bacaan>) => {
  const { data } = await apiClient.post<Bacaan>('/admin/bacaan', payload);
  return data;
};

export const updateBacaan = async (id: number, payload: Partial<Bacaan>) => {
  const { data } = await apiClient.put<Bacaan>(`/admin/bacaan/${id}`, payload);
  return data;
};

export const deleteBacaan = async (id: number) => {
  await apiClient.delete(`/admin/bacaan/${id}`);
};
