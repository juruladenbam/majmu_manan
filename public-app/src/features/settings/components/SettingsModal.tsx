import { Modal, ModalFooter, Button, Slider, Switch } from '@/components/ui';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { usePWAInstall } from '@/hooks/usePWAInstall';
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
  const { isHere, isIOS, isInstalled, promptInstall } = usePWAInstall();

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

        {/* Divider */}
        <hr className="border-slate-200 dark:border-slate-700" />

        {/* PWA Install Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Aplikasi
          </label>

          {!isInstalled ? (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <img src="/icons/icon.png" alt="Majmu icon" className="w-10 h-10 rounded-lg shadow-sm" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100">Install Aplikasi</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Akses cepat & offline</p>
                </div>
              </div>

              {isIOS ? (
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2 bg-white dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="font-medium">Cara Install di iOS:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-xs">
                    <li>Tap tombol <strong>Share</strong> <span className="text-blue-500">⎋</span> di browser</li>
                    <li>Scroll dan pilih <strong>"Add to Home Screen"</strong> (Tambah ke Utama)</li>
                    <li>Tap <strong>Add</strong> (Tambah)</li>
                  </ol>
                </div>
              ) : isHere ? (
                <Button
                  onClick={promptInstall}
                  className="w-full justify-center bg-primary-600 hover:bg-primary-700 text-white"
                >
                  📲 Install Sekarang
                </Button>
              ) : (
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2 bg-white dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="font-medium">Cara Install di Android Chrome:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-xs">
                    <li>Tap tombol <strong>menu ⋮</strong> di pojok kanan atas</li>
                    <li>Pilih <strong>"Install app"</strong> atau <strong>"Add to Home screen"</strong></li>
                    <li>Tap <strong>Install</strong></li>
                  </ol>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">
                    💡 Jika tidak muncul opsi install, coba scroll halaman terlebih dahulu
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
              <span>✅</span>
              <span className="text-sm font-medium">Aplikasi sudah terinstall</span>
            </div>
          )}
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
