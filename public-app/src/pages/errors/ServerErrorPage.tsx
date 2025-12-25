import { Button } from '../../components/ui';


interface ServerErrorPageProps {
    error?: Error;
    resetErrorBoundary?: () => void;
}

export const ServerErrorPage = ({ error, resetErrorBoundary }: ServerErrorPageProps) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <h1 className="text-6xl font-bold text-red-600 dark:text-red-500 mb-4">500</h1>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                Terjadi Kesalahan Server
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
                Maaf, terjadi kesalahan internal pada server kami. Silakan coba beberapa saat lagi.
            </p>
            {resetErrorBoundary && (
                <Button onClick={resetErrorBoundary}>Coba Lagi</Button>
            )}
            {!resetErrorBoundary && (
                <Button onClick={() => window.location.reload()}>Muat Ulang Halaman</Button>
            )}

            {error && import.meta.env.DEV && (
                <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-left overflow-auto max-w-full w-full max-h-60 text-xs font-mono">
                    <p className="font-bold mb-2">Error Details:</p>
                    <pre>{error.message}</pre>
                    <pre className="mt-2">{error.stack}</pre>
                </div>
            )}
        </div>
    );
};
