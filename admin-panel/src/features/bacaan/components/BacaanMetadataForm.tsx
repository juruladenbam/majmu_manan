import { useState, useEffect } from 'react';
import type { Bacaan } from '@project/shared';

interface BacaanMetadataFormProps {
  initialData: Bacaan;
  onUpdate: (data: Partial<Bacaan>) => void;
}

export const BacaanMetadataForm = ({ initialData, onUpdate }: BacaanMetadataFormProps) => {
  const [formData, setFormData] = useState({
    judul: '',
    judul_arab: '',
    deskripsi: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        judul: initialData.judul,
        judul_arab: initialData.judul_arab || '',
        deskripsi: initialData.deskripsi || ''
      });
    }
  }, [initialData]);

  const handleSubmit = () => {
    onUpdate(formData);
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-[2rem] p-6 md:p-8 shadow-sm border border-border-light dark:border-border-dark flex flex-col gap-8">
      {/* Row 1: Title & Arabic Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-text-main dark:text-white ml-1">Judul</label>
          <input
            type="text"
            className="w-full bg-surface-accent dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-text-main dark:text-white font-medium focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-gray-700 transition-all placeholder-text-secondary/70 h-[50px]"
            value={formData.judul}
            onChange={e => setFormData({ ...formData, judul: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-text-main dark:text-white ml-1 flex justify-between">
            <span>Judul Arab</span>
            <span className="text-xs font-normal text-text-secondary">Arabic script</span>
          </label>
          <input
            type="text"
            dir="rtl"
            className="w-full bg-surface-accent dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-text-main dark:text-white font-arabic text-xl focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-gray-700 transition-all placeholder-text-secondary/70 h-[50px]"
            value={formData.judul_arab}
            onChange={e => setFormData({ ...formData, judul_arab: e.target.value })}
          />
        </div>
      </div>

      {/* Row 2: Description */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-text-main dark:text-white ml-1">Deskripsi</label>
        <textarea
          rows={4}
          className="w-full bg-surface-accent dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-text-main dark:text-white font-medium focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-gray-700 transition-all resize-none placeholder-text-secondary/70"
          value={formData.deskripsi}
          onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 rounded-full bg-primary hover:brightness-95 text-text-dark font-bold shadow-md hover:shadow-lg transition-all"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
};
