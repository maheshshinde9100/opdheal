import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all group"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <Moon size={20} className="group-hover:rotate-12 transition-transform" />
            ) : (
                <Sun size={20} className="group-hover:rotate-90 transition-transform" />
            )}
        </button>
    );
};
