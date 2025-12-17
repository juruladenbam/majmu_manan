import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
    return (
        <svg
            className={cn(
                'animate-spin text-primary-500',
                size === 'sm' && 'h-4 w-4',
                size === 'md' && 'h-6 w-6',
                size === 'lg' && 'h-8 w-8',
                size === 'xl' && 'h-12 w-12',
                className
            )}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
};

export interface LoadingPageProps {
    message?: string;
}

export const LoadingPage = ({ message = 'Memuat...' }: LoadingPageProps) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <LoadingSpinner size="xl" />
            <p className="text-slate-500 dark:text-slate-400">{message}</p>
        </div>
    );
};

LoadingSpinner.displayName = 'LoadingSpinner';
LoadingPage.displayName = 'LoadingPage';
