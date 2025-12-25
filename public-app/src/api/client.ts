import { createApiClient } from '@project/shared';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const apiClient = createApiClient(baseURL);

// Request interceptor to add token if exists (e.g. for members area in future)
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle 401
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // For public app, we might redirect to unauthorized page instead of login
            // Or if we have a login, redirect there. For now, let's go to unauthorized.
            localStorage.removeItem('auth_token');
            window.location.href = '/unauthorized';
        }
        return Promise.reject(error);
    }
);
