import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Menu, X, LogOut, User as UserIcon, ChevronRight } from 'lucide-react';
import { Button } from '../Button';
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
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-3'
            : 'bg-transparent py-6'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-11 h-11 bg-teal-600 rounded-lg flex items-center justify-center shadow-sm">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-gray-900' : 'text-white'
                            }`}>
                            OPDHeal <span className="font-medium text-teal-500">Clinical</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-10">
                        {['Features', 'Doctors', 'Emergency'].map((item) => (
                            <Link
                                key={item}
                                to={`/${item.toLowerCase()}`}
                                className={`text-sm font-semibold uppercase tracking-widest hover:text-teal-600 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white/90'
                                    }`}
                            >
                                {item}
                            </Link>
                        ))}

                        {isAuthenticated ? (
                            <div className="flex items-center gap-6">
                                <Link to={getDashboardLink()} className="flex items-center gap-3 group">
                                    <div className="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600">
                                        <UserIcon size={18} />
                                    </div>
                                    <span className={`font-semibold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                                        {username}
                                    </span>
                                </Link>
                                <Button size="sm" variant="outline" onClick={handleLogout} className="border-red-500 text-red-600 hover:bg-red-50 rounded-lg font-semibold">
                                    <LogOut size={16} className="mr-2" />
                                    <span>Logout</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login">
                                    <span className={`text-sm font-semibold px-4 cursor-pointer hover:text-teal-600 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white/90'}`}>
                                        Provider Login
                                    </span>
                                </Link>
                                <Link to="/register">
                                    <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm font-semibold px-6">
                                        Patient Portal <ChevronRight size={18} className="ml-1 -mr-1" />
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            className="p-2 rounded-lg bg-gray-100"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="text-gray-900" />
                            ) : (
                                <Menu className={isScrolled ? 'text-gray-900' : 'text-white'} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200">
                    <div className="px-6 py-8 space-y-6">
                        {['Features', 'Doctors', 'Emergency'].map((item) => (
                            <Link
                                key={item}
                                to={`/${item.toLowerCase()}`}
                                className="block text-xl font-bold text-gray-800"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item}
                            </Link>
                        ))}
                        <div className="pt-6 border-t border-gray-200 flex flex-col gap-4">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-600">
                                            <UserIcon size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{username}</p>
                                            <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest">{role}</p>
                                        </div>
                                    </div>
                                    <Link to={getDashboardLink()} onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button className="w-full bg-teal-600 text-white h-14">Go to Dashboard</Button>
                                    </Link>
                                    <Button variant="outline" onClick={handleLogout} className="w-full border-red-500 text-red-600 h-14 rounded-lg font-semibold">Logout</Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full border-gray-200 h-14 rounded-lg font-semibold">Provider Login</Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white h-14 rounded-lg font-semibold">Patient Portal</Button>
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
