import { cn } from '@/lib/utils';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
    logo?: ReactNode;
    title?: string;
    leftContent?: ReactNode;
    rightContent?: ReactNode;
    sticky?: boolean;
}

export const Header = forwardRef<HTMLElement, HeaderProps>(
    (
        {
            logo,
            title = "Majmu' Manan",
            leftContent,
            rightContent,
            sticky = true,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <header
                ref={ref}
                className={cn(
                    'w-full z-50',
                    'bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600',
                    'dark:from-slate-900 dark:via-slate-800 dark:to-slate-900',
                    'shadow-lg shadow-primary-600/20 dark:shadow-slate-900/50',
                    sticky && 'sticky top-0',
                    className
                )}
                {...props}
            >
                {/* Decorative pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 py-4 md:py-5">
                    <div className="flex items-center justify-between">
                        {/* Left side */}
                        <div className="flex items-center gap-3">
                            {leftContent}
                            <Link to="/" className="flex items-center gap-3">
                                {logo || (
                                    <span className="text-2xl">✨</span>
                                )}
                                <div>
                                    <h1 className="text-xl md:text-2xl font-heading font-bold text-white tracking-tight">
                                        {title}
                                    </h1>
                                </div>
                            </Link>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-1 md:gap-2">
                            <ThemeToggle />
                            {rightContent}
                        </div>
                    </div>
                </div>
            </header>
        );
    }
);

Header.displayName = 'Header';
