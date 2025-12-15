import { apiClient } from '@/api/client';
import type { Bacaan, Section } from '@project/shared';

export const getBacaanList = async () => {
  const { data } = await apiClient.get<Bacaan[]>('/bacaan');
  return data;
};

export const getBacaanDetail = async (slug: string) => {
  const { data } = await apiClient.get<Bacaan>(`/bacaan/${slug}`);
  return data;
};

export const getSectionDetail = async (slug: string, sectionSlug: string) => {
  const { data } = await apiClient.get<Section>(`/bacaan/${slug}/${sectionSlug}`);
  return data;
};
