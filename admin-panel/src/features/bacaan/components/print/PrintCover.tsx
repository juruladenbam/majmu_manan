

interface PrintCoverProps {
    title: string;
    subtitle?: string;
    description?: string;
}

export const PrintCover = ({ title, subtitle, description }: PrintCoverProps) => {
    return (
        <div className="print-page flex flex-col items-center justify-center text-center border-b-8 border-primary/20">
            <div className="flex-1 flex flex-col items-center justify-center w-full">

                <h1 className="text-4xl font-black text-gray-900 uppercase tracking-wider mb-2 leading-tight">
                    {title}
                </h1>

                {subtitle && (
                    <h2 className="text-2xl font-bold text-gray-600 mb-8 max-w-lg">
                        {subtitle}
                    </h2>
                )}

                <div className="w-32 h-1 bg-primary mb-12 rounded-full"></div>

                {description && (
                    <p className="text-gray-500 max-w-md mx-auto text-lg leading-relaxed italic">
                        "{description}"
                    </p>
                )}
            </div>

            <div className="w-full flex flex-col gap-2 pb-10">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Majmu Manan
                </div>
                <div className="text-xs text-gray-400">
                    Dicetak pada: {new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })} WIB
                </div>
            </div>
        </div>
    );
};
