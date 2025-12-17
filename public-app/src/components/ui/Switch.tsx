import { cn } from '@/lib/utils';
import { forwardRef, type InputHTMLAttributes } from 'react';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
    ({ label, className, id, checked, ...props }, ref) => {
        const switchId = id || label?.toLowerCase().replace(/\s/g, '-');

        return (
            <label
                htmlFor={switchId}
                className={cn('inline-flex items-center cursor-pointer', className)}
            >
                <div className="relative">
                    <input
                        ref={ref}
                        type="checkbox"
                        id={switchId}
                        checked={checked}
                        className="sr-only peer"
                        {...props}
                    />
                    <div
                        className={cn(
                            'w-11 h-6 rounded-full transition-colors duration-200',
                            'bg-slate-200 dark:bg-slate-700',
                            'peer-checked:bg-primary-500',
                            'peer-focus:ring-2 peer-focus:ring-primary-500/50'
                        )}
                    />
                    <div
                        className={cn(
                            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-200',
                            'bg-white shadow-sm',
                            'peer-checked:translate-x-5'
                        )}
                    />
                </div>
                {label && (
                    <span className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                        {label}
                    </span>
                )}
            </label>
        );
    }
);

Switch.displayName = 'Switch';
