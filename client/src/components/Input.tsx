import React from 'react';
import { cn } from '../utils/helpers';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    className,
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-label)' }}>
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        {leftIcon}
                    </div>
                )}
                <input
                    className={cn(
                        'input',
                        leftIcon ? 'pl-10' : '',
                        rightIcon ? 'pr-10' : '',
                        error ? 'border-red-500 focus:border-red-500' : '',
                        className
                    )}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-error-600">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
            )}
        </div>
    );
};
