

export interface MaintenancePageProps {
    message?: string | null;
}

export const MaintenancePage = ({ message }: MaintenancePageProps) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <div className="text-6xl mb-6">🔧</div>
                <h1 className="text-2xl font-heading font-bold text-slate-800 dark:text-slate-100 mb-4">
                    Sedang Maintenance
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    {message || 'Aplikasi sedang dalam pemeliharaan. Silakan kembali beberapa saat lagi.'}
                </p>
            </div>
        </div>
    );
};
