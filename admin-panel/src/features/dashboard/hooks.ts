import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from './api';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    refetchInterval: 60000,
  });
};
