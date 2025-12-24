import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

/**
 * Offline indicator banner that appears when user loses internet connection
 */
export const OfflineIndicator = () => {
    const isOnline = useOnlineStatus();

    if (isOnline) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-500 text-amber-950 px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium shadow-lg animate-slide-down">
            <WifiOff className="w-4 h-4" />
            <span>Anda sedang offline. Menampilkan data tersimpan.</span>
        </div>
    );
};
