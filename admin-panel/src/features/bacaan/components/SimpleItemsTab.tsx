import type { Bacaan } from '@project/shared';
import { ItemEditorList } from '@/features/item/components/ItemEditorList';

interface SimpleItemsTabProps {
    bacaan: Bacaan;
}

export const SimpleItemsTab = ({ bacaan }: SimpleItemsTabProps) => {
    // In single section mode, we assume there is at least one section (created by default)
    // We use the first section for all items.
    const firstSection = bacaan.sections?.[0];

    if (!firstSection) {
        return (
            <div className="p-8 text-center text-text-secondary bg-surface-light dark:bg-surface-dark rounded-xl border border-dashed border-border-light dark:border-border-dark">
                <p>Data section tidak ditemukan. Silakan refresh halaman atau coba switch ke mode Multi Section.</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border-light dark:border-border-dark bg-surface-accent/30 dark:bg-surface-accent-dark/30 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-gray-400">
                        <span className="material-symbols-outlined text-[20px]">list_alt</span>
                        <p>Kelola konten bacaan (Single Section)</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                        Section ID: {firstSection.id}
                    </div>
                </div>

                <div className="p-4 md:p-6">
                    <ItemEditorList
                        bacaanId={bacaan.id}
                        sectionId={firstSection.id}
                        items={firstSection.items || []}
                    />
                </div>
            </div>
        </div>
    );
};
