import React from 'react';

export const Loader: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    return (
        <div className="flex items-center justify-center p-8">
            <div className={`spinner ${sizes[size]}`} />
        </div>
    );
};

export const PageLoader: React.FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-neutral-50 z-50">
            <div className="text-center">
                <div className="spinner w-16 h-16 mb-4 mx-auto" />
                <p className="text-neutral-600 font-medium">Loading...</p>
            </div>
        </div>
    );
};
