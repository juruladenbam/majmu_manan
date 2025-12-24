import { type ReactNode, useEffect } from 'react';

interface PrintLayoutProps {
    children: ReactNode;
    title?: string;
}

export const PrintLayout = ({ children, title = 'Cetak Dokumen' }: PrintLayoutProps) => {
    useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <div className="bg-gray-100 min-h-screen p-8 print:p-0 print:bg-white print:h-auto">


            <style>{`
                @media print {
                    @page {
                        margin: 20mm; /* Standard A4 margin to avoid printer clipping */
                        size: A4;
                    }
                    body {
                        background: white;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        margin: 0;
                    }
                    /* Hides elements marked as no-print */
                    .no-print {
                        display: none !important;
                    }
                    
                    /* Reset container styles for print */
                    .print-page {
                        box-shadow: none;
                        margin: 0;
                        width: 100%;
                        max-width: none;
                        padding: 0;
                        min-height: auto;
                        page-break-after: auto; /* Let content flow naturally */
                    }

                    /* Ensure items don't get cut in half */
                    .item-row {
                        page-break-inside: avoid;
                        break-inside: avoid;
                        margin-bottom: 2rem; /* Give space between items */
                    }

                    /* Force page break before section titles if needed, or let them flow but avoid widow/orphans */
                    h3 {
                        break-after: avoid;
                        page-break-after: avoid;
                    }
                }
                
                /* Screen helper styles to mimic A4 paper */
                .print-page {
                    background: white;
                    width: 210mm;
                    min-height: 297mm;
                    padding: 20mm;
                    margin: 0 auto 2rem auto;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    position: relative;
                    /* Screen view needs to contain overflow */
                    overflow: visible; 
                }

                @media screen {
                    body {
                        background-color: #f3f4f6; /* bg-gray-100 */
                    }
                }
            `}</style>

            {/* Floating Print Button for Screen View */}
            <div className="fixed bottom-6 right-6 z-50 no-print">
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:bg-primary-dark transition-all transform hover:scale-105 font-bold"
                >
                    <span className="material-symbols-outlined">print</span>
                    Cetak / Simpan PDF
                </button>
            </div>

            {children}
        </div>
    );
};
