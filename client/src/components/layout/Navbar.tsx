import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Menu, X, LogOut, User as UserIcon, ChevronRight } from 'lucide-react';
import { Button } from '../Button';
import { ThemeToggle } from '../ThemeToggle';
import api from '../../services/api';

export const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const isAuthenticated = api.isAuthenticated();
    const role = api.getRole();
    const username = api.getUsername();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        api.logout();
        navigate('/');
    };

    const getDashboardLink = () => {
        switch (role) {
            case 'ADMIN': return '/admin/dashboard';
            case 'DOCTOR': return '/doctor/dashboard';
            case 'PATIENT': return '/patient/dashboard';
            default: return '/';
        }
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
            ? 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-soft py-3'
            : 'bg-transparent py-6'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-11 h-11 bg-primary-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-primary">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <span className={`text-2xl font-black tracking-tighter ${isScrolled ? 'text-neutral-900 dark:text-white' : 'text-white'
                            }`}>
                            OPD<span className="text-primary-500">Heal</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-10">
                        {['Features', 'Doctors', 'Emergency'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                className={`text-sm font-bold uppercase tracking-widest hover:text-primary-500 transition-colors ${isScrolled ? 'text-neutral-600 dark:text-neutral-400' : 'text-white/90'
                                    }`}
                            >
                                {item}
                            </a>
                        ))}

                        <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-700 mx-2"></div>

                        <ThemeToggle />

                        {isAuthenticated ? (
                            <div className="flex items-center gap-6">
                                <Link to={getDashboardLink()} className="flex items-center gap-3 group">
                                    <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
                                        <UserIcon size={18} />
                                    </div>
                                    <span className={`font-bold ${isScrolled ? 'text-neutral-900 dark:text-white' : 'text-white'}`}>
                                        {username}
                                    </span>
                                </Link>
                                <Button size="sm" variant="outline" onClick={handleLogout} className="border-error-500 text-error-500 hover:bg-error-50 rounded-xl font-bold">
                                    <LogOut size={16} className="mr-2" />
                                    <span>Logout</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login">
                                    <span className={`text-sm font-bold uppercase tracking-widest px-4 cursor-pointer hover:text-primary-500 transition-colors ${isScrolled ? 'text-neutral-600 dark:text-neutral-400' : 'text-white/90'}`}>
                                        Login
                                    </span>
                                </Link>
                                <Link to="/register">
                                    <Button className="btn-primary">
                                        Register Now <ChevronRight size={18} className="ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <ThemeToggle />
                        <button
                            className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="text-neutral-900 dark:text-white" />
                            ) : (
                                <Menu className={isScrolled ? 'text-neutral-900 dark:text-white' : 'text-white'} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-neutral-900 shadow-2xl animate-fade-in border-t border-neutral-100 dark:border-neutral-800">
                    <div className="px-6 py-8 space-y-6">
                        {['Features', 'Doctors', 'Emergency'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                className="block text-xl font-black text-neutral-800 dark:text-neutral-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item}
                            </a>
                        ))}
                        <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-4">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
                                            <UserIcon size={24} />
                                        </div>
                                        <div>
                                            <p className="font-black text-neutral-900 dark:text-white">{username}</p>
                                            <p className="text-xs font-bold text-primary-600 uppercase tracking-widest">{role}</p>
                                        </div>
                                    </div>
                                    <Link to={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button className="w-full btn-primary h-14">Go to Dashboard</Button>
                                    </Link>
                                    <Button variant="outline" onClick={handleLogout} className="w-full border-error-500 text-error-500 h-14 rounded-2xl font-bold">Logout</Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full border-neutral-200 dark:border-neutral-700 h-14 rounded-2xl font-bold">Login</Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button className="w-full btn-primary h-14">Get Started</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};
