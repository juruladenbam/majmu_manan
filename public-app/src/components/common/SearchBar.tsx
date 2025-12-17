import { cn } from '@/lib/utils';
import { forwardRef, type InputHTMLAttributes } from 'react';

export interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    onSearch?: (value: string) => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
    ({ className, placeholder = 'Cari bacaan...', onSearch, onChange, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e);
            onSearch?.(e.target.value);
        };

        return (
            <div className={cn('relative', className)}>
                {/* Search icon */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>

                <input
                    ref={ref}
                    type="search"
                    placeholder={placeholder}
                    onChange={handleChange}
                    className={cn(
                        'w-full pl-12 pr-4 py-3 rounded-xl',
                        'bg-white dark:bg-slate-800',
                        'border border-slate-200 dark:border-slate-700',
                        'text-slate-900 dark:text-slate-100',
                        'placeholder:text-slate-400 dark:placeholder:text-slate-500',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
                        'transition-all duration-200',
                        'text-base'
                    )}
                    {...props}
                />
            </div>
        );
    }
);

SearchBar.displayName = 'SearchBar';
