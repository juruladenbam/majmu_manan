import { useQuery } from '@tanstack/react-query';
import { getBacaanList, getBacaanDetail, getSectionDetail } from '../api';

export const useBacaanList = () => {
  return useQuery({
    queryKey: ['public-bacaan-list'],
    queryFn: getBacaanList,
  });
};

export const useBacaanDetail = (slug: string) => {
  return useQuery({
    queryKey: ['public-bacaan-detail', slug],
    queryFn: () => getBacaanDetail(slug),
    enabled: !!slug,
  });
};

export const useSectionDetail = (slug: string, sectionSlug: string) => {
  return useQuery({
    queryKey: ['public-section-detail', slug, sectionSlug],
    queryFn: () => getSectionDetail(slug, sectionSlug),
    enabled: !!slug && !!sectionSlug,
  });
};
