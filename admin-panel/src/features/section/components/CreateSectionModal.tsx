import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';

interface CreateSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (title: string) => void;
}

export const CreateSectionModal = ({ isOpen, onClose, onSubmit }: CreateSectionModalProps) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onSubmit(title);
            setTitle('');
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Tambah Bagian Baru (Section)"
            maxWidth="max-w-md"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-text-main dark:text-white ml-1">Judul Bagian</label>
                    <input
                        type="text"
                        className="w-full bg-surface-accent dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-text-main dark:text-white font-medium focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-gray-700 transition-all placeholder-text-secondary/70"
                        placeholder="Contoh: Muqaddimah, Pasal 1..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />
                </div>

                <button
                    type="submit"
                    className="w-full px-6 py-3 rounded-full bg-primary hover:brightness-95 text-text-dark font-bold shadow-md hover:shadow-lg transition-all mt-2"
                    disabled={!title.trim()}
                >
                    Buat Bagian
                </button>
            </form>
        </Modal>
    );
};
