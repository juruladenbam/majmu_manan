import { apiClient } from '@/api/client';
import type { Item } from '@project/shared';

export const createItem = async (payload: Partial<Item>) => {
  const { data } = await apiClient.post<Item>('/admin/items', payload);
  return data;
};

export const updateItem = async (id: number, payload: Partial<Item>) => {
  const { data } = await apiClient.put<Item>(`/admin/items/${id}`, payload);
  return data;
};

export const deleteItem = async (id: number) => {
  await apiClient.delete(`/admin/items/${id}`);
};
