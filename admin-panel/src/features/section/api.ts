import { apiClient } from '@/api/client';
import type { Section } from '@project/shared';

export const createSection = async (payload: Partial<Section>) => {
  const { data } = await apiClient.post<Section>('/admin/sections', payload);
  return data;
};

export const updateSection = async (id: number, payload: Partial<Section>) => {
  const { data } = await apiClient.put<Section>(`/admin/sections/${id}`, payload);
  return data;
};

export const deleteSection = async (id: number) => {
  await apiClient.delete(`/admin/sections/${id}`);
};

export const reorderSections = async (items: { id: number; urutan: number }[]) => {
  await apiClient.post('/admin/sections/reorder', { items });
};
