import { cn } from '@/lib/utils';
import { forwardRef, type HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'bordered';
    hover?: boolean;
    accent?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ variant = 'default', hover = true, accent = false, className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-xl p-4 transition-all duration-200',

                    // Variants
                    variant === 'default' && [
                        'bg-white dark:bg-slate-800',
                        'border border-slate-200 dark:border-slate-700',
                    ],
                    variant === 'elevated' && [
                        'bg-white dark:bg-slate-800',
                        'shadow-md dark:shadow-slate-900/50',
                    ],
                    variant === 'bordered' && [
                        'bg-transparent',
                        'border-2 border-slate-200 dark:border-slate-700',
                    ],

                    // Accent border
                    accent && 'border-l-4 border-l-primary-500',

                    // Hover effect
                    hover && [
                        'hover:shadow-md hover:border-primary-200',
                        'dark:hover:shadow-primary-500/10 dark:hover:border-primary-600',
                    ],

                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

// Card subcomponents
export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex flex-col space-y-1.5 pb-4', className)}
            {...props}
        />
    )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn('text-lg font-semibold text-slate-900 dark:text-slate-50', className)}
            {...props}
        />
    )
);
CardTitle.displayName = 'CardTitle';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('', className)} {...props} />
    )
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex items-center pt-4', className)}
            {...props}
        />
    )
);
CardFooter.displayName = 'CardFooter';
