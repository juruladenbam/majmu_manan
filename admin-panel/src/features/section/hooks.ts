import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSection, updateSection, deleteSection } from './api';
import type { Section } from '@project/shared';

export const useCreateSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSection,
    onSuccess: (_, variables) => {
      // Invalidate the bacaan detail query because sections are nested there
      queryClient.invalidateQueries({ queryKey: ['bacaan-detail', variables.bacaan_id] });
    },
  });
};

export const useUpdateSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Section> }) => updateSection(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bacaan-detail', data.bacaan_id] });
    },
  });
};

export const useDeleteSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: number; bacaanId: number }) => deleteSection(variables.id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bacaan-detail', variables.bacaanId] });
    },
  });
};
