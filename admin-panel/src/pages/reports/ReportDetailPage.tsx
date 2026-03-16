import { useParams, useNavigate, Link } from 'react-router-dom';
import { useReportDetail, useApproveReport, useRejectReport } from '@/features/reports/hooks';
import { Button } from '@/components/ui';
import type { ReportStatus } from '@project/shared';
import { useState, useEffect } from 'react';

export const ReportDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: report, isLoading } = useReportDetail(Number(id));
    const [editedKoreksi, setEditedKoreksi] = useState<Record<string, string>>({});

    useEffect(() => {
        if (report) {
            if (report.mode_koreksi === 'catatan') {
                // For catatan mode, initialize empty corrections for admin to fill in
                const initial: Record<string, string> = {};
                (report.field_koreksi || []).forEach((field: string) => {
                    initial[field] = '';
                });
                setEditedKoreksi(initial);
            } else {
                setEditedKoreksi(report.konten_koreksi || {});
            }
        }
    }, [report]);

    const approveMutation = useApproveReport();
    const rejectMutation = useRejectReport();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!report) return (
        <div className="flex flex-col items-center justify-center py-20">
            <h2 className="text-xl font-bold">Laporan tidak ditemukan</h2>
            <Link to="/reports" className="mt-4 text-primary font-medium hover:underline">
                ← Kembali ke Daftar Laporan
            </Link>
        </div>
    );

    const getStatusStyle = (status: ReportStatus) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
            case 'disetujui': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
            case 'ditolak': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleApprove = async () => {
        if (!window.confirm('Setujui laporan ini? Data asli akan diperbarui sesuai usulan perbaikan (termasuk jika ada perubahan oleh admin).')) return;
        try {
            await approveMutation.mutateAsync({
                id: report.id,
                kontenKoreksi: editedKoreksi
            });
            alert('Laporan disetujui and data diperbarui.');
            navigate('/reports');
        } catch (error) {
            alert('Gagal menyetujui laporan.');
        }
    };

    const handleReject = async () => {
        if (!window.confirm('Tolak laporan ini?')) return;
        try {
            await rejectMutation.mutateAsync(report.id);
            alert('Laporan ditolak.');
            navigate('/reports');
        } catch (error) {
            alert('Gagal menolak laporan.');
        }
    };

    // Ensure konten_asli and konten_koreksi are treated as objects for mapping
    const kontenAsli = report.konten_asli || {};
    const kontenKoreksi = report.konten_koreksi || {};
    const fields = report.field_koreksi || [];
    const isCatatanMode = report.mode_koreksi === 'catatan';
    const catatanText = isCatatanMode ? (kontenKoreksi['_catatan'] || '') : '';

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/reports">
                        <Button variant="ghost" size="sm" className="bg-gray-100 dark:bg-gray-800 rounded-full size-10 flex items-center justify-center p-0 text-text-main dark:text-white">
                            ←
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">Detail Laporan</h1>
                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStatusStyle(report.status)}`}>
                                {report.status}
                            </span>
                        </div>
                        <p className="text-sm text-text-secondary dark:text-gray-400">
                            ID Laporan: #{report.id} • Dari: {report.pelapor_nama || 'Hamba Allah'} ({report.pelapor_email || 'Tanpa Email'})
                        </p>
                    </div>
                </div>

                {report.status === 'pending' && (
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="bg-red-50 text-red-600 border-red-100 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-900/40 dark:text-red-400"
                            onClick={handleReject}
                            disabled={rejectMutation.isPending}
                        >
                            {rejectMutation.isPending ? 'Memproses...' : 'Tolak'}
                        </Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
                            onClick={handleApprove}
                            disabled={approveMutation.isPending}
                        >
                            {approveMutation.isPending ? 'Memproses...' : 'Setujui & Terapkan'}
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Info Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="p-6 bg-white dark:bg-background-dark border border-border-light dark:border-border-dark rounded-2xl shadow-sm">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Informasi Target</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Bacaan</label>
                                <p className="font-bold text-text-main dark:text-gray-200">{report.bacaan?.judul || '-'}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Jenis Laporan</label>
                                <p className="font-medium capitalize">{report.jenis_laporan}</p>
                            </div>
                            {report.target_id && (
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Target ID</label>
                                    <p className="font-medium">{report.target_id}</p>
                                </div>
                            )}
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Kategori Masalah</label>
                                <span className="px-2 py-1 text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20 rounded-lg capitalize">
                                    {report.kategori.replace('_', ' ')}
                                </span>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Mode Koreksi</label>
                                <span className={`px-2 py-1 text-xs font-bold rounded-lg border ${
                                    isCatatanMode
                                        ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
                                }`}>
                                    {isCatatanMode ? '📝 Catatan' : '✏️ Koreksi Langsung'}
                                </span>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Waktu Laporan</label>
                                <p className="text-sm font-medium">
                                    {new Date(report.created_at).toLocaleString('id-ID', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Comparison */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-6 bg-white dark:bg-background-dark border border-border-light dark:border-border-dark rounded-2xl shadow-sm">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                            {isCatatanMode ? 'Catatan & Konten' : 'Perbandingan Konten'}
                            <span className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></span>
                        </h3>

                        <div className="space-y-8">
                            {/* === MODE CATATAN === */}
                            {isCatatanMode && (
                                <>
                                    {/* User's note */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="size-2 rounded-full bg-blue-500"></div>
                                            <h4 className="text-sm font-bold uppercase tracking-wider text-text-main dark:text-gray-200">
                                                Catatan dari Pelapor
                                            </h4>
                                        </div>
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-2xl">
                                            <p className="text-sm text-blue-900 dark:text-blue-200 whitespace-pre-wrap leading-relaxed">
                                                {catatanText || <span className="italic text-gray-400">Tidak ada catatan</span>}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Reference content + admin correction fields */}
                                    {fields.map((field: string) => (
                                        <div key={field} className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="size-2 rounded-full bg-primary"></div>
                                                <h4 className="text-sm font-bold uppercase tracking-wider text-text-main dark:text-gray-200">
                                                    Field: {field.replace('_', ' ')}
                                                </h4>
                                            </div>

                                            {/* Current content as reference */}
                                            <div className="space-y-1.5">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase ml-2 tracking-tighter">Konten Sekarang (Referensi)</span>
                                                <div className="p-4 bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-2xl min-h-[60px]">
                                                    <div className={`${field === 'arabic' || field === 'judul_arab' ? 'font-arabic text-2xl leading-relaxed' : 'text-sm text-gray-600 dark:text-gray-400'}`}
                                                        dir={field === 'arabic' || field === 'judul_arab' ? 'rtl' : 'ltr'}
                                                    >
                                                        {kontenAsli[field] ? (
                                                            <div dangerouslySetInnerHTML={{ __html: kontenAsli[field] }} />
                                                        ) : (
                                                            <span className="italic text-gray-400">Kosong</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Admin writes correction */}
                                            {report.status === 'pending' && (
                                                <div className="space-y-1.5">
                                                    <span className="text-[10px] font-bold text-green-600 uppercase ml-2 tracking-tighter">
                                                        Perbaikan oleh Admin (isi jika ingin menyetujui)
                                                    </span>
                                                    <textarea
                                                        value={editedKoreksi[field] || ''}
                                                        onChange={(e) => setEditedKoreksi(prev => ({ ...prev, [field]: e.target.value }))}
                                                        dir={field === 'arabic' || field === 'judul_arab' ? 'rtl' : 'ltr'}
                                                        className={`w-full p-4 bg-green-50/50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-2xl min-h-[100px] outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all ${field === 'arabic' || field === 'judul_arab' ? 'font-arabic text-2xl leading-relaxed' : 'text-sm text-text-main dark:text-gray-200'
                                                            }`}
                                                        placeholder={`Tulis koreksi ${field.replace('_', ' ')} yang benar...`}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* === MODE LANGSUNG === */}
                            {!isCatatanMode && fields.map((field: string) => (
                                <div key={field} className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="size-2 rounded-full bg-primary"></div>
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-text-main dark:text-gray-200">
                                            Field: {field.replace('_', ' ')}
                                        </h4>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Current Content */}
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-bold text-red-500 uppercase ml-2 tracking-tighter">Konten Sekarang</span>
                                            <div className="p-4 bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl min-h-[80px]">
                                                <div className={`${field === 'arabic' || field === 'judul_arab' ? 'font-arabic text-2xl leading-relaxed' : 'text-sm text-gray-600 dark:text-gray-400'}`}
                                                    dir={field === 'arabic' || field === 'judul_arab' ? 'rtl' : 'ltr'}
                                                >
                                                    {kontenAsli[field] ? (
                                                        <div dangerouslySetInnerHTML={{ __html: kontenAsli[field] }} />
                                                    ) : (
                                                        <span className="italic text-gray-400">Kosong</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Correction Content */}
                                        <div className="space-y-1.5 flex flex-col">
                                            <span className="text-[10px] font-bold text-green-600 uppercase ml-2 tracking-tighter">
                                                {report.status === 'pending' ? 'Usulan Perbaikan (Editable)' : 'Usulan Perbaikan'}
                                            </span>
                                            {report.status === 'pending' ? (
                                                <textarea
                                                    value={editedKoreksi[field] || ''}
                                                    onChange={(e) => setEditedKoreksi(prev => ({ ...prev, [field]: e.target.value }))}
                                                    dir={field === 'arabic' || field === 'judul_arab' ? 'rtl' : 'ltr'}
                                                    className={`p-4 bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-2xl min-h-[120px] outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all ${field === 'arabic' || field === 'judul_arab' ? 'font-arabic text-2xl leading-relaxed' : 'text-sm text-text-main dark:text-gray-200'
                                                        }`}
                                                />
                                            ) : (
                                                <div className="p-4 bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-2xl min-h-[80px]">
                                                    <div className={`${field === 'arabic' || field === 'judul_arab' ? 'font-arabic text-2xl leading-relaxed' : 'text-sm text-text-main dark:text-gray-200'}`}
                                                        dir={field === 'arabic' || field === 'judul_arab' ? 'rtl' : 'ltr'}
                                                    >
                                                        {editedKoreksi[field] || <span className="italic text-gray-400">Kosong</span>}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {fields.length === 0 && (
                                <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-400 italic">Tidak ada data field yang dilaporkan.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
