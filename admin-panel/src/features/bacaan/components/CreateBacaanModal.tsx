import { useState } from 'react';
import { useCreateBacaan } from '../hooks';
import { Modal } from '@/components/ui/Modal';

interface CreateBacaanModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateBacaanModal = ({ isOpen, onClose }: CreateBacaanModalProps) => {
    const { mutate: createBacaan, isPending } = useCreateBacaan();
    const [formData, setFormData] = useState({
        judul: '',
        judul_arab: '',
        deskripsi: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createBacaan(formData, {
            onSuccess: () => {
                setFormData({ judul: '', judul_arab: '', deskripsi: '' });
                onClose();
            }
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Tambah Bacaan Baru"
            maxWidth="max-w-lg"
        >
            <form id="create-bacaan-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-text-main dark:text-white" htmlFor="judul">
                        Judul Bacaan <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="judul"
                        type="text"
                        required
                        className="w-full rounded-xl border-border-light dark:border-border-dark bg-surface-accent dark:bg-gray-800 px-4 py-3 text-text-main dark:text-white focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-gray-700 transition-all placeholder:text-text-secondary/50"
                        placeholder="Contoh: Yasin, Waqiah, Ratib..."
                        value={formData.judul}
                        onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-text-main dark:text-white flex justify-between" htmlFor="judul_arab">
                        <span>Judul Arab</span>
                        <span className="text-xs font-normal text-text-secondary">Opsional</span>
                    </label>
                    <input
                        id="judul_arab"
                        type="text"
                        dir="rtl"
                        className="w-full rounded-xl border-border-light dark:border-border-dark bg-surface-accent dark:bg-gray-800 px-4 py-3 text-text-main dark:text-white font-arabic text-lg focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-gray-700 transition-all placeholder:text-text-secondary/50"
                        placeholder="لوريم إيبسوم"
                        value={formData.judul_arab}
                        onChange={(e) => setFormData({ ...formData, judul_arab: e.target.value })}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-text-main dark:text-white" htmlFor="deskripsi">
                        Deskripsi Singkat
                    </label>
                    <textarea
                        id="deskripsi"
                        rows={3}
                        className="w-full rounded-xl border-border-light dark:border-border-dark bg-surface-accent dark:bg-gray-800 px-4 py-3 text-text-main dark:text-white focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-gray-700 transition-all placeholder:text-text-secondary/50 resize-none"
                        placeholder="Tambahkan keterangan singkat tentang bacaan ini..."
                        value={formData.deskripsi}
                        onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-full font-bold text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-6 py-2.5 rounded-full bg-primary hover:brightness-95 text-text-dark font-bold shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isPending ? (
                            <>
                                <div className="size-4 border-2 border-text-dark/30 border-t-text-dark rounded-full animate-spin"></div>
                                <span>Menyimpan...</span>
                            </>
                        ) : (
                            <span>Simpan Bacaan</span>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
