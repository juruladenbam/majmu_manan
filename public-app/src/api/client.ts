import { createApiClient } from '@project/shared';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const apiClient = createApiClient(baseURL);
