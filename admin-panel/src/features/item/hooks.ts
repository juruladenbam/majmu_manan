import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createItem, updateItem, deleteItem, reorderItems } from './api';
import type { Item } from '@project/shared';

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createItem,
    onSuccess: (_, variables) => {
      // Invalidate the bacaan detail query because items are nested in sections in the detail view
      // Note: This might be heavy if we reload the whole bacaan structure. 
      // Ideally we should have a specific query for section items, but for now this works with our architecture.
      queryClient.invalidateQueries({ queryKey: ['bacaan-detail', variables.bacaan_id] });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Item> }) => updateItem(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bacaan-detail', data.bacaan_id] });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: number; bacaanId: number }) => deleteItem(variables.id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bacaan-detail', variables.bacaanId] });
    },
  });
};

export const useReorderItems = (bacaanId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorderItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bacaan-detail', bacaanId] });
    },
  });
};
