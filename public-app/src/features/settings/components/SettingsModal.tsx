import { Modal, ModalFooter, Button, Slider, Switch } from '@/components/ui';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useEffect, useState } from 'react';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [fontSize, setFontSize] = useLocalStorage<number>('fontSize', 28);
  const [showTranslation, setShowTranslation] = useLocalStorage<boolean>('showTranslation', true);
  const [showLatin, setShowLatin] = useLocalStorage<boolean>('showLatin', true);
  const [themeMode, setThemeMode] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  // Local state for live preview
  const [localFontSize, setLocalFontSize] = useState(fontSize);

  useEffect(() => {
    setLocalFontSize(fontSize);
  }, [fontSize, isOpen]);

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLocalFontSize(value);
    setFontSize(value);
  };

  const handleThemeChange = (mode: 'light' | 'dark') => {
    setThemeMode(mode);
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="⚙️ Pengaturan Bacaan" size="md">
      <div className="space-y-6">
        {/* Theme Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Tema Tampilan
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${themeMode === 'light'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
            >
              <span className="text-2xl">☀️</span>
              <span className="text-sm font-medium">Terang</span>
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${themeMode === 'dark'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
            >
              <span className="text-2xl">🌙</span>
              <span className="text-sm font-medium">Gelap</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-slate-200 dark:border-slate-700" />

        {/* Font Size Slider */}
        <div>
          <Slider
            label="Ukuran Font Arab"
            value={localFontSize}
            min={16}
            max={48}
            step={1}
            onChange={handleFontSizeChange}
          />
          {/* Preview */}
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Preview:</p>
            <p
              className="font-arabic text-right text-slate-800 dark:text-slate-200"
              style={{ fontSize: `${localFontSize}px`, lineHeight: '2' }}
            >
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-slate-200 dark:border-slate-700" />

        {/* Toggle Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Tampilkan Terjemahan
            </span>
            <Switch
              checked={showTranslation}
              onChange={(e) => setShowTranslation(e.target.checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Tampilkan Latin
            </span>
            <Switch
              checked={showLatin}
              onChange={(e) => setShowLatin(e.target.checked)}
            />
          </div>
        </div>
      </div>

      <ModalFooter>
        <Button variant="primary" onClick={onClose}>
          Tutup
        </Button>
      </ModalFooter>
    </Modal>
  );
};

SettingsModal.displayName = 'SettingsModal';
