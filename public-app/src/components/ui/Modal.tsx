import { cn } from '@/lib/utils';
import { forwardRef, type HTMLAttributes, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    closeOnOverlayClick?: boolean;
    closeOnEsc?: boolean;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
    (
        {
            isOpen,
            onClose,
            title,
            size = 'md',
            closeOnOverlayClick = true,
            closeOnEsc = true,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const modalRef = useRef<HTMLDivElement>(null);

        // Handle ESC key
        useEffect(() => {
            if (!closeOnEsc) return;

            const handleEsc = (e: KeyboardEvent) => {
                if (e.key === 'Escape' && isOpen) {
                    onClose();
                }
            };

            document.addEventListener('keydown', handleEsc);
            return () => document.removeEventListener('keydown', handleEsc);
        }, [isOpen, onClose, closeOnEsc]);

        // Lock body scroll when modal is open
        useEffect(() => {
            if (isOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
            return () => {
                document.body.style.overflow = '';
            };
        }, [isOpen]);

        if (!isOpen) return null;

        const handleOverlayClick = (e: React.MouseEvent) => {
            if (closeOnOverlayClick && e.target === e.currentTarget) {
                onClose();
            }
        };

        const modalContent = (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={handleOverlayClick}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 dark:bg-black/70 animate-fade-in" />

                {/* Modal */}
                <div
                    ref={ref || modalRef}
                    className={cn(
                        'relative z-10 w-full bg-white dark:bg-slate-800',
                        'rounded-2xl shadow-xl',
                        'animate-slide-up',
                        'max-h-[90vh] overflow-hidden flex flex-col',

                        // Sizes
                        size === 'sm' && 'max-w-sm',
                        size === 'md' && 'max-w-md',
                        size === 'lg' && 'max-w-lg',
                        size === 'xl' && 'max-w-xl',

                        className
                    )}
                    {...props}
                >
                    {/* Header */}
                    {title && (
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                                {title}
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Content */}
                    <div className="px-6 py-4 overflow-y-auto">{children}</div>
                </div>
            </div>
        );

        return createPortal(modalContent, document.body);
    }
);

Modal.displayName = 'Modal';

// Modal subcomponents
export const ModalFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                'flex items-center justify-end gap-3 px-6 py-4',
                'border-t border-slate-200 dark:border-slate-700',
                className
            )}
            {...props}
        />
    )
);
ModalFooter.displayName = 'ModalFooter';
