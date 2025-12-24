import { useParams } from 'react-router-dom';
import { useBacaanDetail } from '../../hooks';
import { PrintLayout } from './PrintLayout';
import { PrintCover } from './PrintCover';
import { PrintTableOfContents } from './PrintTableOfContents';
import type { Item } from '@project/shared';

// Helper to sort items
const sortItems = (items: Item[]) => [...items].sort((a, b) => a.urutan - b.urutan);

export const BacaanPrintView = () => {
    const { id } = useParams();
    const { data: bacaan, isLoading } = useBacaanDetail(Number(id));

    if (isLoading) return <div className="p-8 text-center">Loading data for print...</div>;
    if (!bacaan) return <div className="p-8 text-center text-red-500">Bacaan not found</div>;

    // Collect all items from all sections for TOC and rendering
    // For now we just render sections sequentially
    const sections = bacaan.sections || [];

    // Generate TOC items
    const tocItems = sections.map((section, index) => ({
        id: section.id,
        title: section.judul_section || `Bagian ${index + 1}: Tanpa Judul`,
    }));

    // If it's a single section bacaan (or no sections somehow), check if we have items directly attached 
    // or just one Main section.
    // Ideally we iterate through sections.

    return (
        <PrintLayout title={`Cetak - ${bacaan.judul}`}>
            <PrintCover
                title={bacaan.judul}
                subtitle={bacaan.judul_arab || ''}
                description={bacaan.deskripsi || ''}
            />

            {sections.length > 1 && (
                <PrintTableOfContents items={tocItems} />
            )}

            <div className="print-content">
                {sections.map((section, sIndex) => {
                    const sortedItems = sortItems(section.items || []);
                    if (sortedItems.length === 0) return null;

                    return (
                        <div key={section.id} className="print-page">
                            {/* Section Header if Multi Section */}
                            {(sections.length > 1 || section.judul_section) && (
                                <div className="mb-8 border-b-2 border-primary/10 pb-2">
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        {section.judul_section || `Bagian ${sIndex + 1}`}
                                    </h3>
                                </div>
                            )}

                            {/* Items */}
                            <div className="flex flex-col gap-8">
                                {sortedItems.map((item) => (
                                    <div key={item.id} className="item-row break-inside-avoid">
                                        {/* Arabic */}
                                        {item.arabic && (
                                            <div
                                                className="font-arabic text-3xl text-right leading-loose mb-2 dir-rtl"
                                                dangerouslySetInnerHTML={{ __html: item.arabic }}
                                            />
                                        )}

                                        {/* Latin */}
                                        {item.latin && (
                                            <div className="text-sm font-medium text-primary italic mb-1">
                                                {item.latin}
                                            </div>
                                        )}

                                        {/* Translation */}
                                        {item.terjemahan && (
                                            <div className="text-sm text-gray-600">
                                                {item.terjemahan}
                                            </div>
                                        )}

                                        {/* Visual Divider/Spacing */}
                                        <div className="h-px bg-gray-100 my-4 w-1/2 mx-auto"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </PrintLayout>
    );
};
