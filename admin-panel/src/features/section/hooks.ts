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

import { reorderSections } from './api';

export const useReorderSections = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorderSections,
    onSuccess: () => {
      // We might not know the bacaan_id here directly unless we pass it, 
      // but typically we want to refetch the reading detail.
      // For now, we'll optimistically depend on local state update or force refresh if needed.
      // Actually better to invalidate 'bacaan-detail' generically or pass the ID.
      queryClient.invalidateQueries({ queryKey: ['bacaan-detail'] });
    },
  });
};
