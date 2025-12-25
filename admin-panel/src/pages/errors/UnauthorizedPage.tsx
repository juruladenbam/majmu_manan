import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const UnauthorizedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-6xl font-bold text-amber-500 mb-4">403</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Akses Ditolak</h2>
                <p className="text-gray-500 mb-8">
                    Anda tidak memiliki izin untuk mengakses halaman admin ini.
                </p>
                <div className="flex flex-col gap-3">
                    <Button onClick={() => navigate(-1)} variant="outline" className="w-full">
                        Kembali
                    </Button>
                    <Button onClick={() => navigate('/login')} variant="default" className="w-full">
                        Ke Halaman Login
                    </Button>
                </div>
            </div>
        </div>
    );
};
