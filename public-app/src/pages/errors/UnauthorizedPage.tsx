import { Link } from 'react-router-dom';
import { Button } from '../../components/ui';


export const UnauthorizedPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <h1 className="text-6xl font-bold text-amber-500 mb-4">401</h1>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                Akses Ditolak
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
                Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Silakan login atau hubungi administrator jika Anda merasa ini adalah kesalahan.
            </p>
            <div className="flex gap-4">
                <Link to="/">
                    <Button variant="outline">Beranda</Button>
                </Link>
                {/* Assuming there might be a login page or similar action */}
            </div>
        </div>
    );
};
