import { useQuery } from '@tanstack/react-query';
import { getBacaanList, getBacaanDetail, getSectionDetail } from '../api';

export const useBacaanList = () => {
  return useQuery({
    queryKey: ['public-bacaan-list'],
    queryFn: getBacaanList,
    staleTime: 1000 * 60 * 60, // 1 hour - won't refetch if data is fresh
    gcTime: 1000 * 60 * 60 * 24, // 24 hours - keep in memory cache
  });
};

export const useBacaanDetail = (slug: string) => {
  return useQuery({
    queryKey: ['public-bacaan-detail', slug],
    queryFn: () => getBacaanDetail(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
};

export const useSectionDetail = (slug: string, sectionSlug: string) => {
  return useQuery({
    queryKey: ['public-section-detail', slug, sectionSlug],
    queryFn: () => getSectionDetail(slug, sectionSlug),
    enabled: !!slug && !!sectionSlug,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
};

