import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
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

/** Strip HTML tags from a string, converting <br> and </div> to newlines */
const stripHtml = (html: string): string => {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]*>?/gm, '')
    .trim();
};

export const ReportModal = ({ isOpen, onClose, type, target, bacaanId }: ReportModalProps) => {
  const [kategori, setKategori] = useState<ReportCategory>('salah_ketik');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [koreksiPerField, setKoreksiPerField] = useState<Record<string, string>>({});
  const [catatan, setCatatan] = useState('');
  const [pelaporNama, setPelaporNama] = useState('');
  const [pelaporEmail, setPelaporEmail] = useState('');
  const [mode, setMode] = useState<'langsung' | 'catatan'>('langsung');
  const [isCopied, setIsCopied] = useState(false);

  const createReport = useCreateReport();

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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && target) {
      setKategori('salah_ketik');
      const defaultFields = type === 'item' ? ['arabic'] : type === 'section' ? ['judul_section'] : ['judul'];
      setSelectedFields(defaultFields);
      // Pre-fill koreksiPerField with stripped original content
      const initial: Record<string, string> = {};
      defaultFields.forEach((field) => {
        initial[field] = stripHtml(getFieldValue(field));
      });
      setKoreksiPerField(initial);
      setCatatan('');
      setPelaporNama('');
      setPelaporEmail('');
      setMode('langsung');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, type]);

  if (!target) return null;

  const handleFieldToggle = (fieldKey: string) => {
    if (selectedFields.includes(fieldKey)) {
      if (selectedFields.length > 1) {
        setSelectedFields(selectedFields.filter((f: string) => f !== fieldKey));
        // Clean up koreksi for removed field
        setKoreksiPerField((prev) => {
          const next = { ...prev };
          delete next[fieldKey];
          return next;
        });
      }
    } else {
      setSelectedFields([...selectedFields, fieldKey]);
      // Pre-fill koreksi for newly added field
      setKoreksiPerField((prev) => ({
        ...prev,
        [fieldKey]: stripHtml(getFieldValue(fieldKey)),
      }));
    }
  };

  const handleSubmit = async () => {
    const kontenAsli: Record<string, string> = {};
    const kontenKoreksiObj: Record<string, string> = {};
    let fieldsToSend: string[] = [];

    if (mode === 'langsung') {
      fieldsToSend = selectedFields;
      selectedFields.forEach((field: string) => {
        kontenAsli[field] = getFieldValue(field);
        kontenKoreksiObj[field] = koreksiPerField[field] || '';
      });
    } else {
      // Mode catatan: automatically include all fields that have content
      fieldsToSend = getFields()
        .map(f => f.key)
        .filter(key => getFieldValue(key));
      fieldsToSend.forEach((field: string) => {
        kontenAsli[field] = getFieldValue(field);
      });
      // Store catatan as a single note, not per-field
      kontenKoreksiObj['_catatan'] = catatan;
    }

    try {
      await createReport.mutateAsync({
        bacaan_id: bacaanId,
        kategori,
        jenis_laporan: type,
        mode_koreksi: mode,
        target_id: type !== 'bacaan' ? (target as any).id : undefined,
        field_koreksi: fieldsToSend,
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

  // Validation: check if form is ready to submit
  const isFormValid = () => {
    if (mode === 'langsung') {
      if (selectedFields.length === 0) return false;
      // At least one field must have been edited (different from original)
      return selectedFields.some((field) => {
        const original = stripHtml(getFieldValue(field));
        const edited = koreksiPerField[field] || '';
        return edited.trim() !== '' && edited !== original;
      });
    } else {
      // Catatan mode: just needs a non-empty note
      return catatan.trim() !== '';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lapor Kesalahan">
      <div className="space-y-5 py-2">
        {/* Mode Selection */}
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'langsung'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary'
                : 'text-gray-500'
              }`}
            onClick={() => setMode('langsung')}
          >
            Benarkan Langsung
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'catatan'
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
                  className={`relative px-4 py-3 text-sm border-2 rounded-2xl transition-all ${kategori === opt.value
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

          {/* Field Selection — only shown in mode langsung */}
          {mode === 'langsung' && (
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Bagian yang Salah</label>
              <div className="flex flex-wrap gap-2">
                {getFields().map(field => (
                  <button
                    key={field.key}
                    onClick={() => handleFieldToggle(field.key)}
                    className={`flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold rounded-full border-2 transition-all ${selectedFields.includes(field.key)
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-emerald-400/40'
                      }`}
                  >
                    {field.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* === MODE LANGSUNG: Per-field editing === */}
          {mode === 'langsung' && selectedFields.length > 0 && (
            <div className="space-y-4">
              {selectedFields.map((field: string) => {
                const fieldLabel = getFields().find(f => f.key === field)?.label || field;
                const isArabic = field === 'arabic' || field === 'judul_arab';

                return (
                  <div key={field} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {fieldLabel}
                      </span>
                      <button
                        onClick={() => {
                          const text = stripHtml(getFieldValue(field));
                          navigator.clipboard.writeText(text);
                          setIsCopied(true);
                          setTimeout(() => setIsCopied(false), 2000);
                        }}
                        className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        {isCopied ? <Check size={10} /> : <Copy size={10} />}
                        {isCopied ? 'Tersalin' : 'Copy Asli'}
                      </button>
                    </div>

                    {/* Original content preview */}
                    <div className={`p-3 bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl ${isArabic ? 'font-arabic text-lg leading-relaxed' : 'text-sm text-gray-600 dark:text-gray-300'}`}>
                      <div
                        dir={isArabic ? 'rtl' : 'ltr'}
                        dangerouslySetInnerHTML={{ __html: getFieldValue(field) }}
                      />
                    </div>

                    {/* Correction textarea */}
                    <textarea
                      value={koreksiPerField[field] || ''}
                      onChange={(e) => setKoreksiPerField((prev) => ({ ...prev, [field]: e.target.value }))}
                      dir={isArabic ? 'rtl' : 'ltr'}
                      className={`w-full p-3 border rounded-xl min-h-[80px] focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all dark:bg-gray-900 border-green-200 dark:border-green-900/30 bg-green-50/30 dark:bg-green-900/5 ${isArabic ? 'font-arabic text-lg' : 'text-sm'
                        }`}
                      placeholder={`Tulis koreksi ${fieldLabel.toLowerCase()} yang benar...`}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* === MODE CATATAN: Single note textarea === */}
          {mode === 'catatan' && (
            <div className="space-y-4">
              {/* Auto-show all available content as context */}
              {(() => {
                const fieldsWithContent = getFields().filter(f => getFieldValue(f.key));
                if (fieldsWithContent.length === 0) return null;
                return (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Konten Saat Ini</label>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl space-y-3 max-h-[200px] overflow-y-auto">
                      {fieldsWithContent.map((field) => {
                        const isArabic = field.key === 'arabic' || field.key === 'judul_arab';
                        return (
                          <div key={field.key} className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                              {field.label}
                            </span>
                            <div
                              className={`text-sm ${isArabic ? 'font-arabic text-xl leading-relaxed' : 'text-gray-600 dark:text-gray-300'}`}
                              dir={isArabic ? 'rtl' : 'ltr'}
                              dangerouslySetInnerHTML={{ __html: getFieldValue(field.key) }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Detail Catatan / Perbaikan
                </label>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  className="w-full p-4 border rounded-2xl min-h-[120px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-sm"
                  placeholder="Jelaskan apa yang perlu diperbaiki, misalnya: 'ayat ke-3 dari bawah seharusnya...'"
                />
              </div>
            </div>
          )}

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
            disabled={createReport.isPending || !isFormValid()}
          >
            {createReport.isPending ? 'Mengirim...' : 'Kirim Laporan'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
