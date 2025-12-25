import { Button } from '../../components/ui/Button';

interface ServerErrorPageProps {
    error?: Error;
    resetErrorBoundary?: () => void;
}

export const ServerErrorPage = ({ error, resetErrorBoundary }: ServerErrorPageProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-6xl font-bold text-red-600 mb-4">500</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Terjadi Kesalahan Server</h2>
                <p className="text-gray-500 mb-8">
                    Terjadi kesalahan internal pada sistem admin. Silakan coba lagi atau hubungi tim teknis.
                </p>

                {resetErrorBoundary ? (
                    <Button onClick={resetErrorBoundary} variant="default" className="w-full mb-2">
                        Coba Lagi
                    </Button>
                ) : (
                    <Button onClick={() => window.location.reload()} variant="default" className="w-full mb-2">
                        Muat Ulang
                    </Button>
                )}

                {error && import.meta.env.DEV && (
                    <div className="mt-4 p-4 bg-red-50 text-red-800 rounded text-left overflow-auto max-h-40 text-xs font-mono border border-red-100">
                        <p className="font-bold mb-1">Error Details:</p>
                        <pre>{error.message}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};
