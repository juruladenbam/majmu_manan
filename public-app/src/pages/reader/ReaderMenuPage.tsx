import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBacaanDetail } from '@/features/reader/hooks';
import { ReadingItem } from '@/features/reader/components';
import { Button, Card } from '@/components/ui';
import { LoadingPage } from '@/components/common';
import { BookmarkButton } from '@/features/bookmarks/components';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { Helmet } from 'react-helmet-async';

export const ReaderMenuPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: bacaan, isLoading } = useBacaanDetail(slug!);
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

  if (isLoading) return <LoadingPage message="Memuat bacaan..." />;
  if (!bacaan) return (
    <div className="text-center py-12">
      <Helmet>
        <title>Bacaan Tidak Ditemukan - Majmu' Manan</title>
      </Helmet>
      <p className="text-slate-500 dark:text-slate-400">Bacaan tidak ditemukan.</p>
      <Button variant="ghost" onClick={() => navigate('/')} className="mt-4">
        ← Kembali ke Beranda
      </Button>
    </div>
  );

  // Check if single section mode
  const isSingleSection = !bacaan.is_multi_section;

  // Get items for single-section display (from bacaan.items or first section's items)
  const singleSectionItems = isSingleSection
    ? (bacaan.items || bacaan.sections?.[0]?.items || [])
    : [];

  return (
    <div className="animate-fade-in py-8">
      <Helmet>
        <title>{bacaan.judul} - Majmu' Manan</title>
        <meta name="description" content={bacaan.deskripsi || `Bacaan ${bacaan.judul} di Majmu' Manan`} />
        <meta property="og:title" content={`${bacaan.judul} - Majmu' Manan`} />
        <meta property="og:description" content={bacaan.deskripsi || `Bacaan ${bacaan.judul} di Majmu' Manan`} />
        <meta property="og:type" content="article" />
      </Helmet>

      {/* Back button */}
      <Link to="/" className="inline-block mb-4">
        <Button variant="ghost" size="sm" className="text-primary-600 dark:text-primary-400">
          ← Kembali
        </Button>
      </Link>

      {/* Header Section */}
      <div className="text-center py-6 mb-6 bg-gradient-to-b from-primary-50 to-transparent dark:from-primary-900/20 dark:to-transparent rounded-2xl">
        {bacaan.judul_arab && (
          <h1 className="font-arabic text-4xl md:text-5xl text-primary-700 dark:text-primary-400 mb-4 leading-relaxed">
            {bacaan.judul_arab}
          </h1>
        )}
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
          {bacaan.judul}
        </h2>
        {bacaan.deskripsi && (
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            {bacaan.deskripsi}
          </p>
        )}

        {/* Bookmark Button */}
        <div className="mt-6">
          <BookmarkButton
            bacaan={bacaan}
            isBookmarked={isBookmarked}
            onToggle={handleToggleBookmark}
          />
        </div>
      </div>

      {/* Content: Either Single-Section Reader or Multi-Section List */}
      {isSingleSection ? (
        /* ===== SINGLE SECTION MODE ===== */
        singleSectionItems.length > 0 ? (
          <Card className="p-4 md:p-6">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {singleSectionItems.map((item) => (
                <ReadingItem key={item.id} item={item} />
              ))}
            </div>
          </Card>
        ) : (
          <div className="text-center py-12 bg-slate-100 dark:bg-slate-800/50 rounded-2xl">
            <div className="text-4xl mb-4">📄</div>
            <p className="text-slate-500 dark:text-slate-400">
              Belum ada konten dalam bacaan ini.
            </p>
          </div>
        )
      ) : (
        /* ===== MULTI SECTION MODE ===== */
        <div className="space-y-3">
          <h3 className="text-lg font-heading font-semibold text-slate-700 dark:text-slate-300 mb-4">
            📑 Pilih Bagian
          </h3>

          {bacaan.sections?.map((section, index) => (
            <Link key={section.id} to={`/bacaan/${slug}/${section.slug_section}`}>
              <div className="group flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600 transition-all hover:-translate-y-0.5">
                {/* Number badge */}
                <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white font-bold text-sm shadow-lg shadow-primary-500/30">
                  {index + 1}
                </span>

                {/* Section title */}
                <span className="flex-1 font-medium text-slate-700 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {section.judul_section}
                </span>

                {/* Arrow */}
                <span className="text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all">
                  →
                </span>
              </div>
            </Link>
          ))}

          {(!bacaan.sections || bacaan.sections.length === 0) && (
            <div className="text-center py-12 bg-slate-100 dark:bg-slate-800/50 rounded-2xl">
              <div className="text-4xl mb-4">📄</div>
              <p className="text-slate-500 dark:text-slate-400">
                Belum ada bagian dalam bacaan ini.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
