import type { ContentHealth } from '@project/shared';

interface Props {
  health: ContentHealth;
}

export const ContentHealthCard = ({ health }: Props) => {
  const hasIssues = health.bacaan_without_image > 0 || health.empty_sections > 0 || health.items_without_translation > 0;

  return (
    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border-light dark:border-border-dark">
        <h3 className="text-lg font-bold text-text-dark dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-500">warning</span>
          Perlu Perhatian
        </h3>
      </div>
      <div className="p-5">
        {!hasIssues ? (
          <div className="text-center py-4">
            <div className="size-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
            </div>
            <div className="text-text-secondary dark:text-gray-400">Semua konten dalam kondisi baik!</div>
          </div>
        ) : (
          <div className="space-y-3">
            {health.bacaan_without_image > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">image</span>
                <span className="text-sm font-medium text-text-dark dark:text-white">
                  {health.bacaan_without_image} bacaan tanpa gambar
                </span>
              </div>
            )}
            {health.empty_sections > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">folder_off</span>
                <span className="text-sm font-medium text-text-dark dark:text-white">
                  {health.empty_sections} section kosong
                </span>
              </div>
            )}
            {health.items_without_translation > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">translate</span>
                <span className="text-sm font-medium text-text-dark dark:text-white">
                  {health.items_without_translation} item tanpa terjemahan
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
