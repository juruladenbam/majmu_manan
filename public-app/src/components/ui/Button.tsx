import { cn } from '@/lib/utils';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            className,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    // Base styles
                    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2',
                    'dark:focus:ring-offset-slate-900',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',

                    // Variants
                    variant === 'primary' && [
                        'bg-primary-500 text-white',
                        'hover:bg-primary-600 hover:-translate-y-0.5',
                        'hover:shadow-lg hover:shadow-primary-500/25',
                        'active:translate-y-0',
                    ],
                    variant === 'secondary' && [
                        'bg-slate-100 text-slate-700',
                        'dark:bg-slate-800 dark:text-slate-200',
                        'hover:bg-slate-200 dark:hover:bg-slate-700',
                    ],
                    variant === 'ghost' && [
                        'text-slate-600 dark:text-slate-300',
                        'hover:bg-slate-100 dark:hover:bg-slate-800',
                    ],
                    variant === 'outline' && [
                        'border border-slate-300 dark:border-slate-600',
                        'text-slate-700 dark:text-slate-200',
                        'hover:bg-slate-50 dark:hover:bg-slate-800',
                    ],

                    // Sizes
                    size === 'sm' && 'px-3 py-1.5 text-sm',
                    size === 'md' && 'px-4 py-2',
                    size === 'lg' && 'px-6 py-3 text-lg',

                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <svg
                        className="animate-spin h-4 w-4"
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
                ) : (
                    leftIcon
                )}
                {children}
                {rightIcon}
            </button>
        );
    }
);

Button.displayName = 'Button';
