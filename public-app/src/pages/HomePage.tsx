import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useBacaanList } from '@/features/reader/hooks';
import { BacaanCard } from '@/features/reader/components';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { SearchBar, LoadingPage } from '@/components/common';
import { Helmet } from 'react-helmet-async';

export const HomePage = () => {
  const { data: bacaans, isLoading } = useBacaanList();
  const [searchTerm, setSearchTerm] = useState('');
  const { bookmarks } = useBookmarks();

  const filteredBacaans = useMemo(() => {
    if (!bacaans) return [];
    return bacaans.filter(bacaan =>
      bacaan.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bacaan.judul_arab?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bacaans, searchTerm]);

  if (isLoading) {
    return <LoadingPage message="Memuat daftar bacaan..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <Helmet>
        <title>Majmu' Manan - Keluarga BAM</title>
        <meta name="description" content="Bacaan dan wirid harian keluarga BAM. Tersedia offline." />
        <meta property="og:title" content="Majmu' Manan - Keluarga BAM" />
        <meta property="og:description" content="Bacaan dan wirid harian keluarga BAM. Tersedia offline." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Search Bar */}
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Cari bacaan..."
      />

      {/* Bookmarks Section */}
      {bookmarks.length > 0 && (
        <section className="bg-gradient-to-r from-accent-50 to-primary-50 dark:from-accent-900/20 dark:to-primary-900/20 rounded-2xl p-5">
          <h3 className="flex items-center gap-2 text-lg font-heading font-semibold text-slate-800 dark:text-slate-100 mb-4">
            <span className="text-xl">📌</span>
            Bookmark Tersimpan
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
            {bookmarks.map(b => (
              <Link
                to={`/bacaan/${b.slug}`}
                key={b.slug}
                className="flex-shrink-0 min-w-[200px] bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 border border-slate-200 dark:border-slate-700"
              >
                <h4 className="font-medium text-slate-800 dark:text-slate-100 truncate">
                  {b.judul}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Disimpan: {new Date(b.bookmarkedAt).toLocaleDateString('id-ID')}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Reading List */}
      <section>
        <h3 className="flex items-center gap-2 text-lg font-heading font-semibold text-slate-800 dark:text-slate-100 mb-5">
          <span className="text-xl">📚</span>
          Daftar Bacaan
        </h3>

        <div className="columns-2 gap-3 md:gap-4 space-y-3 md:space-y-4">
          {filteredBacaans.length > 0 ? (
            filteredBacaans.map((bacaan, index) => (
              <div key={bacaan.id} className="break-inside-avoid">
                <BacaanCard bacaan={bacaan} delay={index * 0.05} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-slate-100 dark:bg-slate-800/50 rounded-2xl">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-slate-500 dark:text-slate-400">
                {searchTerm ? 'Tidak ada hasil untuk pencarian ini.' : 'Tidak ada bacaan tersedia.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
