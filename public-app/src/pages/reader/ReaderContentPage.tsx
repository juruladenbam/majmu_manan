import { useParams, useNavigate } from 'react-router-dom';
import { useSectionDetail, useBacaanDetail } from '@/features/reader/hooks';
import { ReadingItem } from '@/features/reader/components';
import { Button, Card } from '@/components/ui';
import { LoadingPage } from '@/components/common';
import { BookmarkButton } from '@/features/bookmarks/components';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export const ReaderContentPage = () => {
  const { slug, sectionSlug } = useParams<{ slug: string; sectionSlug: string }>();
  const navigate = useNavigate();

  // Scroll to top whenever sectionSlug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [sectionSlug]);

  // Fetch Bacaan to know prev/next sections
  const { data: bacaan } = useBacaanDetail(slug!);
  const { data: section, isLoading } = useSectionDetail(slug!, sectionSlug!);
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();

  // Check if bookmarked
  const isBookmarked = bookmarks.some(b => b.slug === slug);
  const handleToggleBookmark = () => {
    if (!bacaan) return;
    if (isBookmarked) {
      removeBookmark(slug!);
    } else {
      addBookmark(bacaan);
    }
  };

  // Calculate Navigation
  const currentIndex = bacaan?.sections?.findIndex(s => s.slug_section === sectionSlug) ?? -1;
  const totalSections = bacaan?.sections?.length ?? 0;
  const prevSection = currentIndex > 0 ? bacaan?.sections?.[currentIndex - 1] : null;
  const nextSection = currentIndex < totalSections - 1 ? bacaan?.sections?.[currentIndex + 1] : null;

  const handleNext = () => {
    if (nextSection) navigate(`/bacaan/${slug}/${nextSection.slug_section}`);
  };

  const handlePrev = () => {
    if (prevSection) navigate(`/bacaan/${slug}/${prevSection.slug_section}`);
  };

  // Swipe: Right swipe = next (RTL reading direction)
  const handlers = useSwipeable({
    onSwipedRight: () => handleNext(),
    onSwipedLeft: () => handlePrev(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  if (isLoading) return <LoadingPage message="Memuat konten..." />;
  if (!section) return (
    <div className="text-center py-12">
      <Helmet>
        <title>Section Tidak Ditemukan - Majmu' Manan</title>
      </Helmet>
      <p className="text-slate-500 dark:text-slate-400">Section tidak ditemukan.</p>
      <Button variant="ghost" onClick={() => navigate(`/bacaan/${slug}`)} className="mt-4">
        ← Kembali ke Daftar Isi
      </Button>
    </div>
  );

  return (
    <div className="min-h-[80vh] animate-fade-in pb-8">
      <Helmet>
        <title>{section.judul_section} - {bacaan?.judul || "Majmu' Manan"}</title>
      </Helmet>
      {/* Sticky Navigation Header - positioned below navbar */}
      <div className="sticky top-[68px] md:top-[76px] z-10 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm py-3 mb-6 -mx-4 px-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {/* Next button on LEFT (for RTL reading) */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            disabled={!nextSection}
            className="text-primary-600 dark:text-primary-400 disabled:opacity-30"
          >
            ← Lanjut
          </Button>

          <div className="flex-1 text-center px-2">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
              {section.judul_section}
            </h3>
            <div className="flex items-center justify-center gap-2 mt-1">
              {/* Progress dots - RTL direction (section 1 on right, last on left) */}
              <div className="flex gap-1" dir="rtl">
                {bacaan?.sections?.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex
                      ? 'bg-primary-500'
                      : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {currentIndex + 1}/{totalSections}
              </span>
            </div>
          </div>

          {/* Prev button on RIGHT (for RTL reading) */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={!prevSection}
            className="text-primary-600 dark:text-primary-400 disabled:opacity-30"
          >
            Kembali →
          </Button>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-col items-center m-4 gap-4">
        {/* Swipe Hint */}
        <p className="text-sm text-slate-400 dark:text-slate-500">
          ← Usap kiri untuk kembali | Usap kanan untuk lanjut →
        </p>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          {...handlers}
        >
          <Card className="p-4 md:p-6 shadow-lg">
            {/* Bookmark Button */}
            <div className="flex justify-end mb-4">
              <BookmarkButton
                bacaan={bacaan!}
                isBookmarked={isBookmarked}
                onToggle={handleToggleBookmark}
              />
            </div>

            {/* Reading Items */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {section.items?.map((item) => (
                <ReadingItem key={item.id} item={item} />
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Footer */}
      <div className="flex flex-col items-center mt-8 gap-4">
        <Button variant="outline" onClick={() => navigate(`/bacaan/${slug}`)}>
          📑 Kembali ke Daftar Isi
        </Button>

        {/* Swipe Hint */}
        <p className="text-sm text-slate-400 dark:text-slate-500">
          ← Usap kiri untuk kembali | Usap kanan untuk lanjut →
        </p>
      </div>
    </div>
  );
};
