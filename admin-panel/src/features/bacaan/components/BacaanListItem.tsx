import type { Bacaan } from '@project/shared';
import { Link } from 'react-router-dom';

interface BacaanListItemProps {
  bacaan: Bacaan;
  onDelete: (id: number) => void;
}

export const BacaanListItem = ({ bacaan, onDelete }: BacaanListItemProps) => {
  const sectionCount = bacaan.sections_count ?? (bacaan.sections?.length || 0);

  return (
    <div className="group bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-5 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300 relative cursor-pointer flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="size-12 rounded-lg bg-surface-accent dark:bg-surface-accent-dark flex items-center justify-center text-primary-dark shadow-inner">
          <span className="material-symbols-outlined text-yellow-600 dark:text-primary">auto_stories</span>
        </div>
        <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto bg-surface-light dark:bg-surface-dark sm:bg-transparent rounded-full px-2 py-1 sm:p-0 shadow-sm sm:shadow-none border sm:border-none border-border-light">
          <Link to={`/bacaan/${bacaan.id}`} className="size-8 rounded-full hover:bg-surface-accent dark:hover:bg-surface-accent-dark flex items-center justify-center text-text-secondary hover:text-blue-600 transition-colors" title="Edit">
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </Link>
          <a
            href={`/print/bacaan/${bacaan.id}`}
            target="_blank"
            rel="noreferrer"
            className="size-8 rounded-full hover:bg-surface-accent dark:hover:bg-surface-accent-dark flex items-center justify-center text-text-secondary hover:text-green-600 transition-colors"
            title="Cetak PDF"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
          </a>
          <button
            type="button"
            className="size-8 rounded-full hover:bg-surface-accent dark:hover:bg-surface-accent-dark flex items-center justify-center text-text-secondary hover:text-red-500 transition-colors"
            title="Delete"
            onClick={(e) => {
              e.preventDefault();
              onDelete(bacaan.id);
            }}
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-bold mb-1 text-text-dark dark:text-white line-clamp-1 group-hover:text-primary-dark dark:group-hover:text-primary transition-colors">{bacaan.judul}</h3>

        {bacaan.judul_arab ? (
          <p className="text-xl text-text-secondary dark:text-gray-400 line-clamp-1 mb-2 font-arabic h-8">{bacaan.judul_arab}</p>
        ) : (
          <div className="h-8 mb-2"></div>
        )}

        <p className="text-sm text-text-secondary/80 dark:text-gray-500 line-clamp-2 h-10 mb-4 text-pretty">
          {bacaan.deskripsi || "Tidak ada deskripsi."}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border-light dark:border-border-dark mt-auto">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-surface-accent dark:bg-surface-accent-dark text-text-secondary border border-border-light dark:border-border-dark">
            ID: {bacaan.id}
          </span>
          {bacaan.slug && (
            <span className="text-xs text-text-secondary/60 font-mono truncate max-w-[80px]" title={bacaan.slug}>
              /{bacaan.slug}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-text-main dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
          <span className="material-symbols-outlined text-[16px] text-primary-dark dark:text-primary">layers</span>
          <span>{sectionCount} Bagian</span>
        </div>
      </div>
    </div>
  );
};
