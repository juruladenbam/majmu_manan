import { Link } from 'react-router-dom';
import { Button } from '../../components/ui';


export const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                Halaman Tidak Ditemukan
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
                Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman tersebut telah dipindahkan atau dihapus.
            </p>
            <Link to="/">
                <Button>Kembali ke Beranda</Button>
            </Link>
        </div>
    );
};
