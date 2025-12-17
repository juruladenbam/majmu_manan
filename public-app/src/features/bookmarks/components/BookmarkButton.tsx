import { cn } from '@/lib/utils';
import { Card } from '@/components/ui';
import type { Bacaan } from '@project/shared';
import { Link } from 'react-router-dom';

export interface BookmarkButtonProps {
  bacaan: Bacaan;
  isBookmarked: boolean;
  onToggle: () => void;
  className?: string;
}

export const BookmarkButton = ({ isBookmarked, onToggle, className }: BookmarkButtonProps) => {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
        isBookmarked
          ? 'bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400'
          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600',
        className
      )}
    >
      {isBookmarked ? '📌' : '🔖'}
      {isBookmarked ? 'Tersimpan' : 'Simpan'}
    </button>
  );
};

export interface BookmarkCardProps {
  bookmark: {
    slug: string;
    judul: string;
    bookmarkedAt: number;
  };
  className?: string;
}

export const BookmarkCard = ({ bookmark, className }: BookmarkCardProps) => {
  return (
    <Link to={`/bacaan/${bookmark.slug}`}>
      <Card hover className={cn('group', className)}>
        <div className="flex items-center gap-3">
          <span className="text-xl">📌</span>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-slate-800 dark:text-slate-100 truncate">
              {bookmark.judul}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Disimpan: {new Date(bookmark.bookmarkedAt).toLocaleDateString('id-ID')}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

BookmarkButton.displayName = 'BookmarkButton';
BookmarkCard.displayName = 'BookmarkCard';
