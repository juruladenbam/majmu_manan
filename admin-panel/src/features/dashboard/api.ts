import { apiClient } from '@/api/client';
import type { DashboardData } from '@project/shared';

export const getDashboardStats = async (): Promise<DashboardData> => {
  const response = await apiClient.get<DashboardData>('/admin/dashboard/stats');
  return response.data;
};
