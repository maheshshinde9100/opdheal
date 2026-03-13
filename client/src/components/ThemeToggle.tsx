import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC<{ showLabel?: boolean }> = ({ showLabel = false }) => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center gap-2.5 group"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {/* Icon */}
            <span className={`transition-all duration-300 ${isDark ? 'text-amber-400' : 'text-slate-500'}`}>
                {isDark ? <Moon size={16} /> : <Sun size={16} />}
            </span>

            {/* Pill */}
            <div
                className={`relative flex items-center w-11 h-6 rounded-full transition-colors duration-300 ${
                    isDark ? 'bg-blue-600' : 'bg-slate-300'
                }`}
            >
                <div
                    className={`absolute w-4.5 h-4.5 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                        isDark ? 'translate-x-5.5' : 'translate-x-0.5'
                    }`}
                    style={{ width: '18px', height: '18px', top: '3px',
                        transform: isDark ? 'translateX(22px)' : 'translateX(3px)' }}
                />
            </div>

            {showLabel && (
                <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    {isDark ? 'Dark' : 'Light'}
                </span>
            )}
        </button>
    );
};
