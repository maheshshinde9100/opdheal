import React from 'react';
import { cn } from '../utils/helpers';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    className,
    disabled,
    ...props
}) => {
    const baseClass = 'btn inline-flex items-center justify-center gap-2';

    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        success: 'btn-success',
        danger: 'btn-danger',
        outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50',
    };

    const sizeClasses = {
        sm: 'text-sm py-2 px-3',
        md: 'text-base py-3 px-5',
        lg: 'text-lg py-4 px-6',
    };

    return (
        <button
            className={cn(
                baseClass,
                variantClasses[variant],
                sizeClasses[size],
                isLoading && 'opacity-70 cursor-not-allowed',
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading && (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </button>
    );
};
