import { apiClient } from '@/api/client';
import type { BacaanReport, CreateReportPayload } from '@project/shared';

export const reportApi = {
  create: (data: CreateReportPayload) => 
    apiClient.post<BacaanReport>('/reports', data),
};
