import { cn } from '@/lib/utils';
import { forwardRef, type InputHTMLAttributes } from 'react';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    showValue?: boolean;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
    ({ label, showValue = true, className, id, value, min = 0, max = 100, ...props }, ref) => {
        const sliderId = id || label?.toLowerCase().replace(/\s/g, '-');

        return (
            <div className={cn('w-full', className)}>
                {(label || showValue) && (
                    <div className="flex items-center justify-between mb-2">
                        {label && (
                            <label
                                htmlFor={sliderId}
                                className="text-sm font-medium text-slate-700 dark:text-slate-300"
                            >
                                {label}
                            </label>
                        )}
                        {showValue && (
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                {value}
                            </span>
                        )}
                    </div>
                )}
                <input
                    ref={ref}
                    type="range"
                    id={sliderId}
                    value={value}
                    min={min}
                    max={max}
                    className={cn(
                        'w-full h-2 rounded-full appearance-none cursor-pointer',
                        'bg-slate-200 dark:bg-slate-700',
                        '[&::-webkit-slider-thumb]:appearance-none',
                        '[&::-webkit-slider-thumb]:w-5',
                        '[&::-webkit-slider-thumb]:h-5',
                        '[&::-webkit-slider-thumb]:rounded-full',
                        '[&::-webkit-slider-thumb]:bg-primary-500',
                        '[&::-webkit-slider-thumb]:shadow-md',
                        '[&::-webkit-slider-thumb]:transition-transform',
                        '[&::-webkit-slider-thumb]:hover:scale-110',
                        '[&::-moz-range-thumb]:w-5',
                        '[&::-moz-range-thumb]:h-5',
                        '[&::-moz-range-thumb]:rounded-full',
                        '[&::-moz-range-thumb]:bg-primary-500',
                        '[&::-moz-range-thumb]:border-0',
                        '[&::-moz-range-thumb]:shadow-md'
                    )}
                    {...props}
                />
            </div>
        );
    }
);

Slider.displayName = 'Slider';
