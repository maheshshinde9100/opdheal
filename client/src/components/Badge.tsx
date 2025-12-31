import React from 'react';
import { getStatusColor } from '../utils/helpers';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'success' | 'warning' | 'error' | 'auto';
    status?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'primary',
    status,
    size = 'md',
}) => {
    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-1.5',
    };

    const variantClass = status ? getStatusColor(status) : `badge-${variant}`;

    return (
        <span className={`badge ${variantClass} ${sizeClasses[size]}`}>
            {children}
        </span>
    );
};
