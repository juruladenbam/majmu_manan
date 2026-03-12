import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReportList } from '@/features/reports/hooks';
import { Button } from '@/components/ui';
import type { ReportStatus, ReportJenis } from '@project/shared';

export const ReportListPage = () => {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<ReportStatus | 'all'>('pending');
    const [jenis, setJenis] = useState<ReportJenis | 'all'>('all');

    const { data, isLoading } = useReportList({
        page,
        status,
        jenis,
        per_page: 15
    });

    const getStatusStyle = (status: ReportStatus) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
            case 'disetujui': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
            case 'ditolak': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getJenisLabel = (jenis: ReportJenis) => {
        switch (jenis) {
            case 'bacaan': return '📚 Bacaan';
            case 'section': return '📑 Section';
            case 'item': return '📝 Item';
            default: return jenis;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Laporan Bacaan</h1>
                    <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
                        Kelola koreksi dan masukan dari pengguna publik.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Status:</span>
                    <select 
                        value={status} 
                        onChange={(e) => { setStatus(e.target.value as any); setPage(1); }}
                        className="text-sm bg-transparent border-none focus:ring-0 cursor-pointer font-medium text-text-main dark:text-gray-200"
                    >
                        <option value="all">Semua Status</option>
                        <option value="pending">Pending</option>
                        <option value="disetujui">Disetujui</option>
                        <option value="ditolak">Ditolak</option>
                    </select>
                </div>
                <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-2 hidden md:block"></div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Jenis:</span>
                    <select 
                        value={jenis} 
                        onChange={(e) => { setJenis(e.target.value as any); setPage(1); }}
                        className="text-sm bg-transparent border-none focus:ring-0 cursor-pointer font-medium text-text-main dark:text-gray-200"
                    >
                        <option value="all">Semua Jenis</option>
                        <option value="bacaan">Bacaan</option>
                        <option value="section">Section</option>
                        <option value="item">Item</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] uppercase font-bold tracking-widest text-gray-400 bg-gray-50/50 dark:bg-gray-800/50 border-b border-border-light dark:border-border-dark">
                            <tr>
                                <th className="px-6 py-4">Tanggal</th>
                                <th className="px-6 py-4">Jenis</th>
                                <th className="px-6 py-4">Bacaan / Target</th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {!data || data.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                                        Tidak ada laporan ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                data.data.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                            {new Date(report.created_at).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-medium text-text-main dark:text-gray-200">
                                                {getJenisLabel(report.jenis_laporan)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-primary truncate max-w-[200px]">
                                                    {report.bacaan?.judul || '-'}
                                                </span>
                                                <span className="text-[10px] text-gray-400 uppercase tracking-tighter">
                                                    ID: {report.target_id || report.bacaan_id}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-gray-600 dark:text-gray-400 capitalize">
                                                {report.kategori.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStatusStyle(report.status)}`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link to={`/reports/${report.id}`}>
                                                <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
                                                    Detail →
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {data && data.last_page > 1 && (
                    <div className="px-6 py-4 flex items-center justify-between border-t border-border-light dark:border-border-dark bg-gray-50/30 dark:bg-gray-800/30">
                        <p className="text-xs text-gray-500 font-medium">
                            Halaman {data.current_page} dari {data.last_page}
                        </p>
                        <div className="flex gap-2">
                            <Button 
                                size="sm" 
                                variant="outline" 
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                Prev
                            </Button>
                            <Button 
                                size="sm" 
                                variant="outline" 
                                disabled={page === data.last_page}
                                onClick={() => setPage(page + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
