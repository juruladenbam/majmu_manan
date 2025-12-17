import { apiClient } from '../../api/client';

export interface AppSettings {
    maintenance_mode: boolean;
    maintenance_message: string | null;
}

export const settingsApi = {
    getSettings: async () => {
        const response = await apiClient.get<Record<string, string>>('/admin/settings');
        return {
            maintenance_mode: response.data.maintenance_mode === '1',
            maintenance_message: response.data.maintenance_message,
        };
    },

    updateSettings: async (data: Partial<AppSettings>) => {
        return apiClient.put('/admin/settings', {
            maintenance_mode: data.maintenance_mode ? 1 : 0,
            maintenance_message: data.maintenance_message,
        });
    },
};
