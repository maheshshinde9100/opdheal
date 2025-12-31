import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <>
            <div className="overlay animate-fade-in" onClick={onClose} />
            <div className={`modal ${sizeClasses[size]}`}>
                {title && (
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
                {!title && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
                <div className="mb-6">{children}</div>
                {footer && (
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                        {footer}
                    </div>
                )}
            </div>
        </>
    );
};
