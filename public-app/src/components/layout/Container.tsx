import { cn } from '@/lib/utils';
import { forwardRef, type HTMLAttributes } from 'react';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
    ({ size = 'md', className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'w-full mx-auto px-4',
                    size === 'sm' && 'max-w-xl',
                    size === 'md' && 'max-w-3xl',
                    size === 'lg' && 'max-w-5xl',
                    size === 'xl' && 'max-w-7xl',
                    size === 'full' && 'max-w-full',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Container.displayName = 'Container';
