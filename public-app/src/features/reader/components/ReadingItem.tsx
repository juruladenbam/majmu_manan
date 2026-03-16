import { cn } from '@/lib/utils';
import type { Item } from '@project/shared';
import { useLocalStorage } from '@/features/settings/hooks/useLocalStorage';
import { ReportModal } from '@/features/reports/components/ReportModal';
import { useState, useRef, useEffect, useCallback } from 'react';
import { MoreVertical } from 'lucide-react';

export interface ReadingItemProps {
  item: Item;
  className?: string;
}

export const ReadingItem = ({ item, className }: ReadingItemProps) => {
  const [fontSize] = useLocalStorage<number>('fontSize', 28);
  const [showTranslation] = useLocalStorage<boolean>('showTranslation', true);
  const [showLatin] = useLocalStorage<boolean>('showLatin', true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => setShowMenu(false), []);

  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu, closeMenu]);

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
        className={cn(
          'py-5 border-b border-slate-100 dark:border-slate-800 relative',
          className
        )}
      >
        {/* Three-dot menu button */}
        <div className="absolute top-2 left-2 z-10">
          <button
            ref={buttonRef}
            onClick={() => setShowMenu((prev) => !prev)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Menu"
          >
            <MoreVertical size={16} />
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute left-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 min-w-[160px] z-20"
            >
              <button
                onClick={() => {
                  closeMenu();
                  setShowReportModal(true);
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                Laporkan Kesalahan
              </button>
            </div>
          )}
        </div>

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
