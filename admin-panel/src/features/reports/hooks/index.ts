import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportApi } from '../api';

export const useReportList = (params?: any) => {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: () => reportApi.list(params),
  });
};

export const useReportDetail = (id: number) => {
  return useQuery({
    queryKey: ['reports', id],
    queryFn: () => reportApi.get(id),
    enabled: !!id,
  });
};

export const useReportCount = () => {
  return useQuery({
    queryKey: ['reports-count'],
    queryFn: () => reportApi.getCount(),
    refetchInterval: 60000, // Refresh every minute
  });
};

export const useApproveReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, kontenKoreksi }: { id: number, kontenKoreksi?: Record<string, string> }) => 
      reportApi.approve(id, kontenKoreksi),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['reports-count'] });
    },
  });
};

export const useRejectReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reportApi.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['reports-count'] });
    },
  });
};
