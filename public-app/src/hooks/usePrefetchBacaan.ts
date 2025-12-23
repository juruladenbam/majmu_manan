import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getBacaanList, getBacaanDetail } from '@/features/reader/api';
import { useOnlineStatus } from './useOnlineStatus';

/**
 * Auto-prefetch all bacaan data when online.
 * This enables full offline access after the first sync.
 */
export const usePrefetchBacaan = () => {
    const queryClient = useQueryClient();
    const isOnline = useOnlineStatus();
    const hasPrefetched = useRef(false);

    useEffect(() => {
        // Only prefetch when online and haven't done so yet
        if (!isOnline || hasPrefetched.current) return;

        const prefetchAllBacaan = async () => {
            try {
                // 1. Fetch and cache the bacaan list
                const bacaanList = await queryClient.fetchQuery({
                    queryKey: ['public-bacaan-list'],
                    queryFn: getBacaanList,
                    staleTime: 1000 * 60 * 60, // 1 hour
                });

                console.log(`[Prefetch] Syncing ${bacaanList.length} bacaan...`);

                // 2. Prefetch each bacaan detail in background (sequentially to avoid overwhelming API)
                for (const bacaan of bacaanList) {
                    await queryClient.prefetchQuery({
                        queryKey: ['public-bacaan-detail', bacaan.slug],
                        queryFn: () => getBacaanDetail(bacaan.slug),
                        staleTime: 1000 * 60 * 60,
                    });
                }

                hasPrefetched.current = true;
                console.log('[Prefetch] All bacaan synced and cached!');
            } catch (error) {
                console.error('[Prefetch] Failed to sync:', error);
            }
        };

        prefetchAllBacaan();
    }, [isOnline, queryClient]);

    return { hasPrefetched: hasPrefetched.current };
};
