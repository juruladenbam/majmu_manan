import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBacaanList, getBacaanDetail, createBacaan, updateBacaan, deleteBacaan } from './api';
import type { Bacaan } from '@project/shared';

export const useBacaanList = () => {
  return useQuery({
    queryKey: ['bacaan-list'],
    queryFn: getBacaanList,
  });
};

export const useBacaanDetail = (id: number) => {
  return useQuery({
    queryKey: ['bacaan-detail', id],
    queryFn: () => getBacaanDetail(id),
    enabled: !!id,
  });
};

export const useCreateBacaan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBacaan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bacaan-list'] });
    },
  });
};

export const useUpdateBacaan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Bacaan> }) => updateBacaan(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bacaan-list'] });
      queryClient.invalidateQueries({ queryKey: ['bacaan-detail', data.id] });
    },
  });
};

export const useDeleteBacaan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBacaan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bacaan-list'] });
    },
  });
};
