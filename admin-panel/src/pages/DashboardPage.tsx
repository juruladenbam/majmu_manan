import { Link } from 'react-router-dom';
import { useDashboardStats } from '../features/dashboard/hooks';
import { StatCard, RecentActivityCard, ContentHealthCard } from '../features/dashboard/components';

export const DashboardPage = () => {
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 mb-4">
          <span className="material-symbols-outlined text-3xl">error</span>
        </div>
        <h3 className="text-lg font-bold text-text-main dark:text-white">Gagal memuat dashboard</h3>
        <p className="text-text-secondary">Silakan coba lagi nanti.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-dark dark:text-white">Dashboard</h2>
          <p className="text-text-secondary dark:text-gray-400 mt-1">Ringkasan konten Majmu Manan.</p>
        </div>
        <Link
          to="/bacaan"
          className="flex items-center justify-center gap-2 h-12 px-6 bg-primary hover:brightness-95 transition-all text-text-dark font-bold rounded-full shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined">add</span>
          Tambah Bacaan
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="auto_stories" value={data.stats.total_bacaan} label="Total Bacaan" sublabel={`${data.stats.multi_section_count} multi-section`} />
        <StatCard icon="layers" value={data.stats.total_sections} label="Total Sections" />
        <StatCard icon="article" value={data.stats.total_items} label="Total Items" />
        <StatCard icon="build" value={data.maintenance_mode ? 1 : 0} label="Maintenance" sublabel={data.maintenance_mode ? 'Aktif' : 'Nonaktif'} />
      </div>

      {/* Activity & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityCard activities={data.recent_activity} />
        <ContentHealthCard health={data.content_health} />
      </div>

      {/* Quick Actions */}
      <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-5">
        <h3 className="text-lg font-bold text-text-dark dark:text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-dark dark:text-primary">bolt</span>
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/bacaan" className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-accent dark:bg-surface-accent-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
            <span className="material-symbols-outlined text-[18px]">list</span>
            Kelola Bacaan
          </Link>
          <Link to="/settings" className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-accent dark:bg-surface-accent-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
            <span className="material-symbols-outlined text-[18px]">settings</span>
            Pengaturan
          </Link>
        </div>
      </div>
    </div>
  );
};
