import { cn } from '@/lib/utils';
import type { Bacaan } from '@project/shared';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export interface BacaanCardProps {
  bacaan: Bacaan;
  className?: string;
  delay?: number;
}

export const BacaanCard = ({ bacaan, className, delay = 0 }: BacaanCardProps) => {
  return (
    <Link to={`/bacaan/${bacaan.slug}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay, ease: 'easeOut' }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'group relative overflow-hidden rounded-2xl h-full',
          'bg-white dark:bg-slate-800',
          'border border-slate-200 dark:border-slate-700',
          'border-l-4 border-l-primary-500',
          'shadow-sm hover:shadow-xl',
          'dark:hover:shadow-primary-500/10',
          'transition-shadow duration-300', // CSS transition for shadow
          'p-5',
          className
        )}
      >
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-100 to-transparent dark:from-primary-900/30 dark:to-transparent rounded-bl-[60px] opacity-60 pointer-events-none" />

        <div className="relative flex flex-col gap-3 h-full">
          {/* Arabic title */}
          {bacaan.judul_arab && (
            <h3 className="font-arabic text-2xl md:text-3xl text-right leading-relaxed text-primary-700 dark:text-primary-400 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
              {bacaan.judul_arab}
            </h3>
          )}

          {/* Latin title */}
          <h4 className="font-heading font-semibold text-lg text-slate-800 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {bacaan.judul}
          </h4>

          {/* Spacer to push content to align bottom */}
          <div className="flex-grow" />

          {/* Description */}
          {bacaan.deskripsi && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              {bacaan.deskripsi.length > 60
                ? `${bacaan.deskripsi.substring(0, 60)}...`
                : bacaan.deskripsi}
            </p>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              📖 {bacaan.sections_count || bacaan.sections?.length || 0} bagian
            </span>
          </div>
        </div>

        {/* Hover indicator arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300 pointer-events-none">
          <span className="text-primary-500 dark:text-primary-400 text-xl">→</span>
        </div>
      </motion.div>
    </Link>
  );
};
