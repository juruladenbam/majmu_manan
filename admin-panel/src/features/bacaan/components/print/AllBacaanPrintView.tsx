import { PrintLayout } from './PrintLayout';
import { PrintCover } from './PrintCover';
import { PrintTableOfContents } from './PrintTableOfContents';
import type { Item, Bacaan } from '@project/shared';
import { useState, useEffect } from 'react';
import { apiClient } from '@/api/client';

// We need a custom hook or query to fetch ALL full data.
// Since the standard list API might paginate or not return full items/sections, 
// we might need to fetch each ID or assume the list is sufficient if updated.
// For now, let's assume we need to fetch full details for each.
// Or we can just iterate the list if the list payload is heavy enough (unlikely).
// Let's rely on a hypothetical 'fetchAll' or just iterate the list and fetch details.

// Actually, fetching N requests for N bacaans is safer than one giant timeout request.

const sortItems = (items: Item[]) => [...items].sort((a, b) => a.urutan - b.urutan);

const SingleBacaanRenderer = ({ bacaan }: { bacaan: Bacaan }) => {
    const sections = bacaan.sections || [];

    return (
        <>
            {/* Divider / Title Page for this Bacaan */}
            <div className="print-page flex flex-col justify-center text-center border-l-4 border-primary/20">
                <h2 className="text-3xl font-bold mb-2">{bacaan.judul}</h2>
                {bacaan.judul_arab && <p className="text-xl font-arabic">{bacaan.judul_arab}</p>}
                {bacaan.deskripsi && <p className="text-gray-500">{bacaan.deskripsi}</p>}
            </div>

            {sections.map((section, sIndex) => {
                const sortedItems = sortItems(section.items || []);
                if (sortedItems.length === 0) return null;

                return (
                    <div key={section.id} className="print-page">
                        {(sections.length > 1 || section.judul_section) && (
                            <div className="mb-6 border-b border-gray-100 pb-2">
                                <h3 className="text-xl font-bold text-gray-700">
                                    {section.judul_section || `Bagian ${sIndex + 1}`}
                                </h3>
                            </div>
                        )}

                        <div className="flex flex-col gap-6">
                            {sortedItems.map((item) => (
                                <div key={item.id} className="item-row break-inside-avoid">
                                    {item.arabic && (
                                        <div
                                            className="font-arabic text-2xl text-right leading-loose mb-2"
                                            dangerouslySetInnerHTML={{ __html: item.arabic }}
                                        />
                                    )}
                                    {(item.latin || item.terjemahan) && (
                                        <div className="bg-gray-50 rounded p-3 text-sm">
                                            {item.latin && <div className="text-primary italic font-medium mb-1">{item.latin}</div>}
                                            {item.terjemahan && <div className="text-gray-600">{item.terjemahan}</div>}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </>
    );
};


export const AllBacaanPrintView = () => {
    // 1. Fetch List
    // We need a stronger query here, usually standard `useBacaans` from `features/bacaan/api.ts`
    // I'll assume standard axios call for now to skip hooks if they have pagination

    const [allData, setAllData] = useState<Bacaan[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // Fetch all headers
                const listRes = await apiClient.get<Bacaan[]>('/admin/bacaan'); // Ensure we get all
                const list = listRes.data;

                // Now fetch details for each (parallel)
                // Warning: This could be heavy. Ideally backend supports ?with=sections.items
                // Let's try to see if backend supports including relations in list.
                // If not, we do parallel fetch.

                const detailPromises = list.map((b: Bacaan) => apiClient.get<Bacaan>(`/admin/bacaan/${b.id}`));
                const detailsRes = await Promise.all(detailPromises);
                const details = detailsRes.map(r => r.data);

                setAllData(details);
            } catch (error) {
                console.error("Failed to fetch all bacaans", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-gray-500 animate-pulse">Menyiapkan dokumen lengkap... (Ini mungkin memakan waktu)</p>
            </div>
        );
    }

    if (!allData) return <div>Error loading data.</div>;

    const tocItems = allData.map(b => ({
        id: b.id,
        title: b.judul,
    }));

    return (
        <PrintLayout title="Cetak Semua - Majmu Manan">
            <PrintCover
                title="Majmu Manan"
                subtitle="Kumpulan Bacaan & Wirid"
                description="Dokumen cetak lengkap seluruh isi database."
            />

            <PrintTableOfContents items={tocItems} />

            <div className="print-content">
                {allData.map(bacaan => (
                    <SingleBacaanRenderer key={bacaan.id} bacaan={bacaan} />
                ))}
            </div>
        </PrintLayout>
    );
};
