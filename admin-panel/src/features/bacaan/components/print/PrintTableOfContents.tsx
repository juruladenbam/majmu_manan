interface TocItem {
    id: number | string;
    title: string;
    pageNumber?: number | string; // Optional if we can't calculate pages
}

interface PrintTableOfContentsProps {
    items: TocItem[];
    title?: string;
}

export const PrintTableOfContents = ({ items, title = 'Daftar Isi' }: PrintTableOfContentsProps) => {
    return (
        <div className="print-page">
            <div className="mb-12 border-b-2 border-gray-100 pb-4">
                <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            </div>

            <div className="flex flex-col gap-1">
                {items.map((item, index) => (
                    <div key={item.id} className="flex items-baseline gap-2 py-2 border-b border-gray-50 border-dashed">
                        <span className="text-sm font-mono text-gray-400 w-8 text-right">{index + 1}.</span>
                        <span className="text-lg font-medium text-gray-800 flex-1">{item.title}</span>
                        {/* 
                            Note: Page numbers are hard to determine in HTML/CSS print.
                            We might just leave the line dotted leader without a number, 
                            or use counters if items are on their own main pages.
                        */}
                    </div>
                ))}

                {items.length === 0 && (
                    <p className="text-gray-400 italic">Tidak ada item.</p>
                )}
            </div>
        </div>
    );
};
