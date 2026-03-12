import { useMutation } from '@tanstack/react-query';
import { reportApi } from '../api';
import type { CreateReportPayload } from '@project/shared';

export const useCreateReport = () => {
  return useMutation({
    mutationFn: (data: CreateReportPayload) => reportApi.create(data),
  });
};
