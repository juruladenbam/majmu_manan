import { Link } from 'react-router-dom';
import type { RecentActivity } from '@project/shared';

interface Props {
  activities: RecentActivity[];
}

const formatTime = (date: string): string => {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 60) return `${mins} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days === 1) return 'kemarin';
  if (days < 7) return `${days} hari lalu`;
  return d.toLocaleDateString('id-ID');
};

export const RecentActivityCard = ({ activities }: Props) => (
  <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden">
    <div className="p-5 border-b border-border-light dark:border-border-dark">
      <h3 className="text-lg font-bold text-text-dark dark:text-white flex items-center gap-2">
        <span className="material-symbols-outlined text-primary-dark dark:text-primary">history</span>
        Terbaru Diperbarui
      </h3>
    </div>
    <div className="divide-y divide-border-light dark:divide-border-dark">
      {activities.map((a) => (
        <Link
          key={a.id}
          to={`/bacaan/${a.id}`}
          className="flex items-center justify-between p-4 hover:bg-surface-accent/50 dark:hover:bg-surface-accent-dark/50 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="size-10 rounded-lg bg-surface-accent dark:bg-surface-accent-dark flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-text-secondary">auto_stories</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-text-dark dark:text-white truncate">{a.judul}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${a.change_source === 'item' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' :
                    a.change_source === 'section' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300' :
                      'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                  {a.change_source === 'item' ? 'Item' : a.change_source === 'section' ? 'Section' : 'Bacaan'}
                </span>
                <span className="text-xs text-text-secondary dark:text-gray-400 truncate">
                  {a.change_preview || `/${a.slug}`}
                </span>
              </div>
            </div>
          </div>
          <div className="text-sm text-text-secondary dark:text-gray-400 flex-shrink-0 ml-2">{formatTime(a.latest_activity || a.updated_at)}</div>
        </Link>
      ))}
    </div>
    <div className="p-4 border-t border-border-light dark:border-border-dark">
      <Link to="/bacaan" className="text-sm font-medium text-primary-dark dark:text-primary hover:underline flex items-center gap-1">
        Lihat Semua <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </Link>
    </div>
  </div>
);
