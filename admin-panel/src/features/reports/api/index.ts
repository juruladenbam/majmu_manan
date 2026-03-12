import { apiClient } from '@/api/client';
import type { BacaanReport, PaginatedResponse } from '@project/shared';

interface ReportListParams {
  status?: 'pending' | 'disetujui' | 'ditolak' | 'all';
  jenis?: 'bacaan' | 'section' | 'item' | 'all';
  per_page?: number;
  page?: number;
}

export const reportApi = {
  list: async (params?: ReportListParams) => {
    const { data } = await apiClient.get<PaginatedResponse<BacaanReport>>('/admin/reports', { params });
    return data;
  },
  
  get: async (id: number) => {
    const { data } = await apiClient.get<BacaanReport>(`/admin/reports/${id}`);
    return data;
  },
  
  getCount: async () => {
    const { data } = await apiClient.get<{ pending_count: number }>('/admin/reports/count');
    return data;
  },
  
  approve: async (id: number, kontenKoreksi?: Record<string, string>) => {
    const { data } = await apiClient.post<BacaanReport>(`/admin/reports/${id}/setuju`, {
      konten_koreksi: kontenKoreksi
    });
    return data;
  },
  
  reject: async (id: number) => {
    const { data } = await apiClient.post<BacaanReport>(`/admin/reports/${id}/tolak`);
    return data;
  },
};
