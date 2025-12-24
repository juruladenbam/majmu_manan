import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getBacaanList, getBacaanDetail, getSectionDetail } from '@/features/reader/api';
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

                // 2. Prefetch each bacaan detail in background
                for (const bacaan of bacaanList) {
                    const bacaanDetail = await queryClient.fetchQuery({
                        queryKey: ['public-bacaan-detail', bacaan.slug],
                        queryFn: () => getBacaanDetail(bacaan.slug),
                        staleTime: 1000 * 60 * 60,
                    });

                    // 3. If multi-section, also prefetch each section detail
                    if (bacaanDetail.is_multi_section && bacaanDetail.sections) {
                        for (const section of bacaanDetail.sections) {
                            await queryClient.prefetchQuery({
                                queryKey: ['public-section-detail', bacaan.slug, section.slug_section],
                                queryFn: () => getSectionDetail(bacaan.slug, section.slug_section),
                                staleTime: 1000 * 60 * 60,
                            });
                        }
                    }
                }

                hasPrefetched.current = true;
                console.log('[Prefetch] All bacaan & sections synced!');
            } catch (error) {
                console.error('[Prefetch] Failed to sync:', error);
            }
        };

        prefetchAllBacaan();
    }, [isOnline, queryClient]);

    return { hasPrefetched: hasPrefetched.current };
};
