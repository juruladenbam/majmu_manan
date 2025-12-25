import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Halaman Tidak Ditemukan</h2>
                <p className="text-gray-500 mb-8">
                    Halaman yang Anda cari tidak dapat ditemukan di dashboard admin.
                </p>
                <Link to="/dashboard">
                    <Button className="w-full">Kembali ke Dashboard</Button>
                </Link>
            </div>
        </div>
    );
};
