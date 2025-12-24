import { cn } from '@/lib/utils';
import type { Item } from '@project/shared';
import { useLocalStorage } from '@/features/settings/hooks/useLocalStorage';

export interface ReadingItemProps {
  item: Item;
  className?: string;
}

export const ReadingItem = ({ item, className }: ReadingItemProps) => {
  const [fontSize] = useLocalStorage<number>('fontSize', 28);
  const [showTranslation] = useLocalStorage<boolean>('showTranslation', true);
  const [showLatin] = useLocalStorage<boolean>('showLatin', true);

  // Dynamic font size style
  const arabicStyle = { fontSize: `${fontSize}px` };

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
            dangerouslySetInnerHTML={{ __html: item.arabic || '' }}
          />
        );

      case 'syiir':
        return (
          <div
            className="font-arabic text-center text-slate-800 dark:text-slate-200"
            style={{ fontSize: `${fontSize}px`, lineHeight: '2.5' }}
            dangerouslySetInnerHTML={{ __html: item.arabic || '' }}
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
            <span dangerouslySetInnerHTML={{ __html: item.arabic || '' }} />
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
            className="font-arabic text-right text-slate-800 dark:text-slate-200"
            style={{ ...arabicStyle, lineHeight: '2' }}
            dangerouslySetInnerHTML={{ __html: item.arabic || '' }}
          />
        );
    }
  };

  const isPoetry = item.tipe_tampilan === 'syiir';
  const isImage = item.tipe_tampilan === 'image';
  const isNote = item.tipe_tampilan === 'keterangan';

  return (
    <div className={cn('py-5 border-b border-slate-100 dark:border-slate-800', className)}>
      <div className="flex flex-col gap-4">
        {/* Main Content (Arabic/Image/Title) */}
        {renderContent()}

        {/* Latin Transliteration */}
        {showLatin && !isImage && !isNote && item.latin && (
          <p className={cn(
            'text-primary-600 dark:text-primary-400 italic',
            isPoetry ? 'text-center' : 'text-left'
          )}>
            {item.latin}
          </p>
        )}

        {/* Translation */}
        {showTranslation && !isImage && item.terjemahan && (
          <p className={cn(
            'text-slate-600 dark:text-slate-400',
            isPoetry ? 'text-center' : 'text-left'
          )}>
            {item.terjemahan}
          </p>
        )}
      </div>
    </div>
  );
};

ReadingItem.displayName = 'ReadingItem';
