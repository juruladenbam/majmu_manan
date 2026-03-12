import { useState, useEffect } from 'react';
import { Modal, Button } from '@/components/ui';
import { useCreateReport } from '../hooks';
import type { Item, Section, Bacaan, ReportCategory } from '@project/shared';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'item' | 'section' | 'bacaan';
  target: Item | Section | Bacaan | null;
  bacaanId: number;
}

const KATEGORI_OPTIONS: { value: ReportCategory; label: string }[] = [
  { value: 'salah_ketik', label: 'Salah Ketik' },
  { value: 'teks_hilang', label: 'Teks Hilang' },
  { value: 'terjemahan_salah', label: 'Terjemahan Salah' },
  { value: 'lain_lain', label: 'Lainnya' },
];

const ITEM_FIELDS = [
  { key: 'arabic', label: 'Arabic' },
  { key: 'latin', label: 'Latin' },
  { key: 'terjemahan', label: 'Terjemahan' },
  { key: 'indonesia', label: 'Indonesia' },
];

const SECTION_FIELDS = [
  { key: 'judul_section', label: 'Judul Section' },
];

const BACAAN_FIELDS = [
  { key: 'judul', label: 'Judul' },
  { key: 'judul_arab', label: 'Judul Arab' },
  { key: 'deskripsi', label: 'Deskripsi' },
];

export const ReportModal = ({ isOpen, onClose, type, target, bacaanId }: ReportModalProps) => {
  const [kategori, setKategori] = useState<ReportCategory>('salah_ketik');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [kontenKoreksi, setKontenKoreksi] = useState('');
  const [pelaporNama, setPelaporNama] = useState('');
  const [pelaporEmail, setPelaporEmail] = useState('');
  const [mode, setMode] = useState<'langsung' | 'catatan'>('langsung');

  const createReport = useCreateReport();

  useEffect(() => {
    if (isOpen) {
      setKategori('salah_ketik');
      setSelectedFields(type === 'item' ? ['arabic'] : type === 'section' ? ['judul_section'] : ['judul']);
      setKontenKoreksi('');
      setPelaporNama('');
      setPelaporEmail('');
      setMode('langsung');
    }
  }, [isOpen, type]);

  if (!target) return null;

  const getFields = () => {
    switch (type) {
      case 'item': return ITEM_FIELDS;
      case 'section': return SECTION_FIELDS;
      case 'bacaan': return BACAAN_FIELDS;
      default: return [];
    }
  };

  const getFieldValue = (field: string): string => {
    const t = target as any;
    return t[field] || '';
  };

  const handleSubmit = async () => {
    const kontenAsli: Record<string, string> = {};
    const kontenKoreksiObj: Record<string, string> = {};

    if (mode === 'langsung') {
      // For "Benarkan Langsung", we apply the same correction text to all selected fields
      selectedFields.forEach((field: string) => {
        kontenAsli[field] = getFieldValue(field);
        kontenKoreksiObj[field] = kontenKoreksi;
      });
    } else {
      // For "Pakai Catatan", we just send the same note for all selected fields
      selectedFields.forEach((field: string) => {
        kontenAsli[field] = getFieldValue(field);
        kontenKoreksiObj[field] = kontenKoreksi; // Here, this is actually the note
      });
    }

    try {
      await createReport.mutateAsync({
        bacaan_id: bacaanId,
        kategori,
        jenis_laporan: type,
        target_id: type !== 'bacaan' ? (target as any).id : undefined,
        field_koreksi: selectedFields,
        konten_asli: JSON.stringify(kontenAsli),
        konten_koreksi: JSON.stringify(kontenKoreksiObj),
        pelapor_nama: pelaporNama || undefined,
        pelapor_email: pelaporEmail || undefined,
      });
      onClose();
    } catch (error) {
      console.error('Failed to submit report', error);
      alert('Gagal mengirim laporan. Silakan coba lagi.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lapor Kesalahan">
      <div className="space-y-5 py-2">
        {/* Mode Selection */}
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              mode === 'langsung' 
                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' 
                : 'text-gray-500'
            }`}
            onClick={() => setMode('langsung')}
          >
            Benarkan Langsung
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              mode === 'catatan' 
                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' 
                : 'text-gray-500'
            }`}
            onClick={() => setMode('catatan')}
          >
            Pakai Catatan
          </button>
        </div>

        <div className="space-y-4">
          {/* Kategori */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Kategori Masalah</label>
            <div className="grid grid-cols-2 gap-2">
              {KATEGORI_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setKategori(opt.value)}
                  className={`relative px-4 py-3 text-sm border-2 rounded-2xl transition-all ${
                    kategori === opt.value
                      ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-primary-400/50 text-gray-600 dark:text-gray-400 font-medium'
                  }`}
                >
                  <div className="text-center font-bold">
                    {opt.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Field Selection */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Bagian yang Salah</label>
            <div className="flex flex-wrap gap-2">
              {getFields().map(field => (
                <button
                  key={field.key}
                  onClick={() => {
                    if (selectedFields.includes(field.key)) {
                      if (selectedFields.length > 1) {
                        setSelectedFields(selectedFields.filter((f: string) => f !== field.key));
                      }
                    } else {
                      setSelectedFields([...selectedFields, field.key]);
                    }
                  }}
                  className={`flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold rounded-full border-2 transition-all ${
                    selectedFields.includes(field.key)
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-emerald-400/40'
                  }`}
                >
                  {field.label}
                </button>
              ))}
            </div>
          </div>

          {/* Konten Sekarang */}
          {selectedFields.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Konten Saat Ini</label>
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl space-y-3">
                {selectedFields.map((field: string) => (
                  <div key={field} className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {getFields().find(f => f.key === field)?.label}
                    </span>
                    <div 
                      className={`text-sm ${field === 'arabic' ? 'font-arabic text-xl leading-relaxed text-right' : 'text-gray-600 dark:text-gray-300'}`}
                      dangerouslySetInnerHTML={{ __html: getFieldValue(field) }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Koreksi Input */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              {mode === 'langsung' ? 'Koreksi yang Diusulkan' : 'Detail Catatan / Perbaikan'}
            </label>
            <textarea
              value={kontenKoreksi}
              onChange={(e) => setKontenKoreksi(e.target.value)}
              className={`w-full p-4 border rounded-2xl min-h-[120px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:bg-gray-900 border-gray-200 dark:border-gray-800 ${
                selectedFields.includes('arabic') && mode === 'langsung' ? 'font-arabic text-xl text-right' : 'text-sm'
              }`}
              placeholder={mode === 'langsung' ? 'Tuliskan teks yang benar di sini...' : 'Jelaskan apa yang perlu diperbaiki...'}
            />
          </div>

          {/* Pelapor Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Nama (Opsional)</label>
              <input
                type="text"
                value={pelaporNama}
                onChange={(e) => setPelaporNama(e.target.value)}
                placeholder="Hamba Allah"
                className="w-full p-2.5 text-sm border border-gray-200 dark:border-gray-800 rounded-xl dark:bg-gray-900 focus:border-primary outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Email (Opsional)</label>
              <input
                type="email"
                value={pelaporEmail}
                onChange={(e) => setPelaporEmail(e.target.value)}
                placeholder="email@anda.com"
                className="w-full p-2.5 text-sm border border-gray-200 dark:border-gray-800 rounded-xl dark:bg-gray-900 focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            className="flex-[2]"
            onClick={handleSubmit}
            disabled={createReport.isPending || !kontenKoreksi || selectedFields.length === 0}
          >
            {createReport.isPending ? 'Mengirim...' : 'Kirim Laporan'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
