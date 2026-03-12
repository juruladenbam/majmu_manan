import { cn } from '@/lib/utils';
import type { Item } from '@project/shared';
import { useLocalStorage } from '@/features/settings/hooks/useLocalStorage';
import { useLongPress } from '@/hooks/useLongPress';
import { ReportModal } from '@/features/reports/components/ReportModal';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export interface ReadingItemProps {
  item: Item;
  className?: string;
}

export const ReadingItem = ({ item, className }: ReadingItemProps) => {
  const [fontSize] = useLocalStorage<number>('fontSize', 28);
  const [showTranslation] = useLocalStorage<boolean>('showTranslation', true);
  const [showLatin] = useLocalStorage<boolean>('showLatin', true);
  const [showReportModal, setShowReportModal] = useState(false);

  const { showMenu, closeMenu, handlers } = useLongPress({
    onLongPress: () => {
      // Trigger haptic feedack if available
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    },
  });

  // Dynamic font size style
  // const arabicStyle = { fontSize: `${fontSize}px` };

  const renderContent = () => {
    switch (item.tipe_tampilan) {
      case 'judul_tengah':
        return (
          <div
            className={cn(
              'font-arabic text-center font-bold py-3 px-4',
              'text-primary-700 dark:text-primary-400',
              'bg-primary-50 dark:bg-primary-900/30 rounded-lg'
            )}
            style={{ fontSize: `${fontSize * 1.2}px`, lineHeight: '2.2' }}
            dangerouslySetInnerHTML={{ __html: item.arabic || item.indonesia || '' }}
          />
        );

      case 'syiir':
        return (
          <div
            className="font-arabic text-center text-slate-800 dark:text-slate-200"
            style={{ fontSize: `${fontSize}px`, lineHeight: '2.5' }}
            dangerouslySetInnerHTML={{ __html: item.arabic || item.indonesia || '' }}
          />
        );

      case 'keterangan':
        return (
          <div
            className={cn(
              'text-center py-3 px-4 mx-auto max-w-lg',
              'text-slate-600 dark:text-slate-400 italic text-sm',
              'bg-slate-100 dark:bg-slate-800/50 rounded-lg',
              'border-l-4 border-l-accent-500'
            )}
            style={{ fontSize: `${fontSize * 0.7}px` }}
          >
            <span className="mr-2">📝</span>
            <span dangerouslySetInnerHTML={{ __html: item.arabic || item.indonesia || '' }} />
          </div>
        );

      case 'image':
        return (
          <div className="text-center">
            <img
              src={item.arabic || ''}
              alt="Gambar Bacaan"
              className="max-h-72 mx-auto rounded-lg"
            />
          </div>
        );

      case 'text':
      default:
        return (
          <div
            className={cn(
              item.indonesia && !item.arabic ? 'text-left' : 'text-right font-arabic',
              'text-slate-800 dark:text-slate-200'
            )}
            style={{
              fontSize: item.indonesia && !item.arabic ? `${fontSize * 0.8}px` : `${fontSize}px`,
              lineHeight: '2'
            }}
            dangerouslySetInnerHTML={{ __html: item.arabic || item.indonesia || '' }}
          />
        );
    }
  };

  const isPoetry = item.tipe_tampilan === 'syiir';
  const isImage = item.tipe_tampilan === 'image';
  const isNote = item.tipe_tampilan === 'keterangan';

  return (
    <>
      <style>
        {`
          ol, menu {
            list-style: auto !important;
            padding: 0 40px 0 !important;
          }
          ol > li > ol{
            list-style: lower-alpha !important;
          }
        `}
      </style>
      <div
        {...handlers}
        className={cn(
          'py-5 border-b border-slate-100 dark:border-slate-800 relative transition-colors',
          showMenu ? 'bg-primary-50/50 dark:bg-primary-900/10' : '',
          className
        )}
      >
        <div className="flex flex-col gap-4">
          {/* Main Content (Arabic/Image/Title) */}
          {renderContent()}

          {/* Latin Transliteration */}
          {showLatin && !isImage && !isNote && item.latin && (
            <p
              className={cn(
                'text-primary-600 dark:text-primary-400 italic',
                isPoetry ? 'text-center' : 'text-left'
              )}
              dangerouslySetInnerHTML={{ __html: item.latin }}
            />
          )}

          {/* Translation */}
          {showTranslation && !isImage && item.terjemahan && (
            <p
              className={cn(
                'text-slate-600 dark:text-slate-400',
                isPoetry ? 'text-center' : 'text-left'
              )}
              dangerouslySetInnerHTML={{ __html: item.terjemahan }}
            />
          )}

          {/* Indonesia Content (if both arabic and indonesia exist) */}
          {item.indonesia && item.arabic && (
            <div
              className={cn(
                'text-slate-700 dark:text-slate-300 leading-relaxed',
                isPoetry ? 'text-center' : 'text-left'
              )}
              style={{ fontSize: `${fontSize * 0.75}px` }}
              dangerouslySetInnerHTML={{ __html: item.indonesia }}
            />
          )}
        </div>

        {/* Long Press Menu Overlay */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-slate-900/10 dark:bg-white/5 backdrop-blur-sm rounded-lg z-10 p-4"
              onClick={(e) => {
                e.stopPropagation();
                closeMenu();
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 p-2 rounded-2xl flex flex-col gap-1 min-w-[180px]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeMenu();
                    setShowReportModal(true);
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">Laporkan</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Ada kesalahan teks/arti</div>
                  </div>
                </button>

                <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeMenu();
                  }}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left text-slate-400 dark:text-slate-500"
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    <X size={18} />
                  </div>
                  <span className="text-xs font-semibold">Batal</span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        type="item"
        target={item}
        bacaanId={item.bacaan_id}
      />
    </>
  );
};

ReadingItem.displayName = 'ReadingItem';
