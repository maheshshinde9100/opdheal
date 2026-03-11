import React from 'react';
import { cn } from '../utils/helpers';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hoverable?: boolean;
    style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
    children,
    className,
    hoverable = false,
    onClick,
    style,
    ...rest
}) => {
    return (
        <div
            className={cn(
                'card',
                hoverable && 'cursor-pointer',
                onClick && 'cursor-pointer',
                className
            )}
            onClick={onClick}
            style={style}
            {...rest}
        >
            {children}
        </div>
    );
};

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
    return (
        <div className={cn('border-b border-neutral-200 pb-3 mb-4', className)}>
            {children}
        </div>
    );
};

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
    return (
        <h3 className={cn('text-xl font-bold text-neutral-900', className)}>
            {children}
        </h3>
    );
};

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
    return (
        <div className={cn('', className)}>
            {children}
        </div>
    );
};

interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
    return (
        <div className={cn('border-t border-neutral-200 pt-4 mt-4', className)}>
            {children}
        </div>
    );
};
