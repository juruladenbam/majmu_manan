import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Hook to handle PWA service worker updates.
 * Shows a prompt to the user when a new version is available.
 */
export const useServiceWorkerUpdate = () => {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegisteredSW(swUrl: string, r: ServiceWorkerRegistration | undefined) {
            console.log('Service Worker registered:', swUrl);
            // Check for updates every hour
            if (r) {
                setInterval(() => {
                    r.update();
                }, 60 * 60 * 1000);
            }
        },
        onRegisterError(error: Error) {
            console.error('Service Worker registration error:', error);
        },
    });

    const closeUpdatePrompt = () => {
        setNeedRefresh(false);
    };

    const updateApp = () => {
        updateServiceWorker(true);
    };

    return {
        needRefresh,
        updateApp,
        closeUpdatePrompt,
    };
};
