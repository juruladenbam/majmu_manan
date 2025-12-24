import { useState, useMemo } from 'react';
import { useBacaanList, useDeleteBacaan } from '@/features/bacaan/hooks';
import { BacaanListItem } from '@/features/bacaan/components/BacaanListItem';
import { CreateBacaanModal } from '@/features/bacaan/components/CreateBacaanModal';

export const BacaanListPage = () => {
  const { data: bacaans, isLoading } = useBacaanList();
  const { mutate: deleteBacaan } = useDeleteBacaan();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = (id: number) => {
    if (window.confirm("Hapus bacaan ini?")) {
      deleteBacaan(id);
    }
  };

  const filteredBacaans = useMemo(() => {
    if (!bacaans) return [];
    if (!searchQuery) return bacaans;

    const lowerQuery = searchQuery.toLowerCase();
    return bacaans.filter(item =>
      item.judul.toLowerCase().includes(lowerQuery) ||
      (item.judul_arab && item.judul_arab.includes(searchQuery)) ||
      (item.deskripsi && item.deskripsi.toLowerCase().includes(lowerQuery))
    );
  }, [bacaans, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-20 mt-8">
      {/* Page Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-dark dark:text-white">Daftar Bacaan</h2>
          <p className="text-text-secondary dark:text-gray-400 mt-1">Kelola semua konten bacaan dan doa dalam aplikasi.</p>
        </div>
        <div className="flex gap-2">
          <a
            href="/print/bacaan/all"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 h-12 px-6 bg-white dark:bg-surface-dark text-text-secondary border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-bold rounded-full shadow-sm hover:shadow-md"
          >
            <span className="material-symbols-outlined">print</span>
            <span>Cetak Semua</span>
          </a>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 h-12 px-6 bg-primary hover:brightness-95 transition-all text-text-dark font-bold rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 group"
          >
            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span>
            <span>Tambah Bacaan</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-surface-light dark:bg-surface-dark p-2 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex items-center bg-surface-accent dark:bg-surface-accent-dark rounded-lg px-4 h-12 border border-transparent focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <span className="material-symbols-outlined text-gray-400">search</span>
          <input
            type="text"
            placeholder="Cari judul bacaan, doa, atau wirid..."
            className="bg-transparent border-none outline-none focus:ring-0 w-full ml-3 text-text-dark dark:text-white placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
        {/* Filter Placeholder - Functional UI but no backend support/logic yet */}
        <div className="relative min-w-[180px] hidden sm:block">
          <button className="w-full h-12 flex items-center justify-between px-4 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-surface-accent-dark transition-colors text-sm font-medium">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-400">filter_list</span>
              <span>Filter: Semua</span>
            </div>
            <span className="material-symbols-outlined text-gray-400">expand_more</span>
          </button>
        </div>
      </div>

      {/* Grid List of Readings */}
      {filteredBacaans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 'Add New' Card Style */}
          <div
            onClick={() => setIsCreateModalOpen(true)}
            className="group border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-5 flex flex-col items-center justify-center min-h-[220px] hover:bg-surface-accent/50 dark:hover:bg-surface-accent-dark/50 transition-colors cursor-pointer order-last lg:order-first"
          >
            <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-text-dark mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">add</span>
            </div>
            <h3 className="text-lg font-bold text-gray-600 dark:text-gray-300 text-center">Tambah Baru</h3>
            <p className="text-sm text-gray-400 text-center mt-1">Buat bacaan atau koleksi baru</p>
          </div>

          {filteredBacaans.map((item) => (
            <BacaanListItem
              key={item.id}
              bacaan={item}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 mb-4">
            <span className="material-symbols-outlined text-3xl">search_off</span>
          </div>
          <h3 className="text-lg font-bold text-text-main dark:text-white">Tidak ditemukan</h3>
          <p className="text-text-secondary">Coba kata kunci pencarian yang lain.</p>
        </div>
      )}

      <CreateBacaanModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
