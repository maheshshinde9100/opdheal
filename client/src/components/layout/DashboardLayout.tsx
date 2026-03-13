import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    User,
    FileText,
    ClipboardList,
    CreditCard,
    Settings,
    LogOut,
    Menu,
    Bell,
    Search,
    ChevronRight,
    Activity,
    Users,
    HeartPulse
} from 'lucide-react';
import api from '../../services/api';
import { ThemeToggle } from '../ThemeToggle';

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    path: string;
    isActive: boolean;
    onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, path, isActive, onClick }) => (
    <Link
        to={path}
        onClick={onClick}
        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
            ? 'bg-primary-600 text-white shadow-primary scale-[1.02]'
            : 'text-neutral-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600'
            }`}
    >
        <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
            {icon}
        </span>
        <span className="font-bold tracking-wide">{label}</span>
        {isActive && <ChevronRight className="ml-auto w-4 h-4" />}
    </Link>
);

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const username = api.getUsername();

    const patientMenuItems = [
        { icon: <LayoutDashboard size={22} />, label: 'Overview', path: '/patient/dashboard' },
        { icon: <Calendar size={22} />, label: 'Appointments', path: '/patient/appointments' },
        { icon: <FileText size={22} />, label: 'Medical Records', path: '/patient/records' },
        { icon: <ClipboardList size={22} />, label: 'Prescriptions', path: '/patient/prescriptions' },
        { icon: <CreditCard size={22} />, label: 'Billing', path: '/patient/billing' },
        { icon: <Users size={22} />, label: 'Find Doctors', path: '/patient/doctors' },
        { icon: <User size={22} />, label: 'Profile', path: '/patient/profile' },
        { icon: <Settings size={22} />, label: 'Settings', path: '/patient/settings' },
    ];

    const doctorMenuItems = [
        { icon: <LayoutDashboard size={22} />, label: 'Dashboard', path: '/doctor/dashboard' },
        { icon: <Calendar size={22} />, label: 'Schedule', path: '/doctor/schedule' },
        { icon: <Users size={22} />, label: 'My Patients', path: '/doctor/patients' },
        { icon: <FileText size={22} />, label: 'Medical History', path: '/doctor/records' },
        { icon: <ClipboardList size={22} />, label: 'Prescriptions', path: '/doctor/prescriptions' },
        { icon: <User size={22} />, label: 'Profile', path: '/doctor/profile' },
        { icon: <Settings size={22} />, label: 'Settings', path: '/doctor/settings' },
    ];

    const adminMenuItems = [
        { icon: <LayoutDashboard size={22} />, label: 'Control Panel', path: '/admin/dashboard' },
        { icon: <HeartPulse size={22} />, label: 'Doctors', path: '/admin/doctors' },
        { icon: <Users size={22} />, label: 'Patients', path: '/admin/patients' },
        { icon: <Calendar size={22} />, label: 'Appointments', path: '/admin/appointments' },
        { icon: <CreditCard size={22} />, label: 'Financials', path: '/admin/billing' },
        { icon: <Settings size={22} />, label: 'System Settings', path: '/admin/settings' },
    ];

    const menuItems = role === 'PATIENT' ? patientMenuItems : role === 'DOCTOR' ? doctorMenuItems : adminMenuItems;

    const handleLogout = () => {
        api.logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex transition-colors duration-300">
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm animate-fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-neutral-900 border-r border-neutral-100 dark:border-neutral-800 transform transition-transform duration-300 lg:translate-x-0 lg:static
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full p-8">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 mb-12 px-2">
                        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-primary">
                            <Activity className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-neutral-900 dark:text-white">
                            OPD<span className="text-primary-600">Heal</span>
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
                        <div className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-6 px-5 opacity-60">Operations</div>
                        {menuItems.map((item) => (
                            <SidebarItem
                                key={item.path}
                                {...item}
                                isActive={location.pathname === item.path}
                                onClick={() => setIsSidebarOpen(false)}
                            />
                        ))}
                    </nav>

                    {/* Footer Actions */}
                    <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
                        <div className="flex items-center gap-4 px-5 py-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl mb-4">
                            <ThemeToggle />
                            <span className="text-sm font-bold text-neutral-500 dark:text-neutral-400">Switch Theme</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-error-600 hover:bg-error-50 dark:hover:bg-error-900/10 transition-all font-bold group"
                        >
                            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="h-24 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between px-8 sticky top-0 z-30 transition-colors">
                    <button
                        className="p-3 -ml-3 lg:hidden text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-2xl"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={28} />
                    </button>

                    <div className="flex-1 max-w-2xl mx-12 hidden md:block">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-600 transition-colors" size={22} />
                            <input
                                type="text"
                                placeholder="Search medical history, doctors, prescriptions..."
                                className="w-full bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary-600/20 transition-all font-bold text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <button className="p-3 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-2xl relative group">
                            <Bell size={24} />
                            <span className="absolute top-3 right-3 w-3 h-3 bg-error-500 border-2 border-white dark:border-neutral-900 rounded-full"></span>
                        </button>

                        <div className="h-10 w-px bg-neutral-200 dark:bg-neutral-800 mx-1"></div>

                        <div className="flex items-center gap-4 pl-2 group cursor-pointer">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-black text-neutral-900 dark:text-white capitalize group-hover:text-primary-600 transition-colors">{username}</div>
                                <div className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{role} Profile</div>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 border-2 border-white dark:border-neutral-800 shadow-lg flex items-center justify-center text-white font-black text-xl group-hover:scale-110 transition-transform">
                                {username?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};
