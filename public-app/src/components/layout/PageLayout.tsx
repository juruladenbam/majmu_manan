import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Container } from './Container';

export interface PageLayoutProps {
    children?: ReactNode;
    headerProps?: React.ComponentProps<typeof Header>;
    containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    className?: string;
    showHeader?: boolean;
}

export const PageLayout = ({
    children,
    headerProps,
    containerSize = 'md',
    className,
    showHeader = true,
}: PageLayoutProps) => {
    return (
        <div className={cn('min-h-screen bg-slate-50 dark:bg-slate-900', className)}>
            {showHeader && <Header {...headerProps} />}

            <main className="py-6">
                <Container size={containerSize}>
                    {children || <Outlet />}
                </Container>
            </main>
        </div>
    );
};

PageLayout.displayName = 'PageLayout';
