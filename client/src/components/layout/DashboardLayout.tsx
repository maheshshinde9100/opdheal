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
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold group ${isActive
            ? 'bg-blue-600 text-white shadow-sm'
            : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }`}
        style={isActive ? {} : { color: 'var(--text-secondary)' }}
    >
        <span className={`transition-transform duration-200 ${isActive ? '' : 'group-hover:text-blue-600'}`}>
            {icon}
        </span>
        <span>{label}</span>
        {isActive && <ChevronRight className="ml-auto w-4 h-4 opacity-70" />}
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
        <div className="min-h-screen flex transition-colors duration-300" style={{ background: 'var(--bg-main)' }}>
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm animate-fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 border-r transform transition-transform duration-300 lg:translate-x-0 lg:static flex-shrink-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `} style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border-default)' }}>
                <div className="flex flex-col h-full p-8">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 mb-10 px-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                            OPD<span className="text-blue-600">Heal</span>
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
                        <div className="text-[10px] font-semibold uppercase tracking-widest mb-4 px-4 opacity-50" style={{ color: 'var(--text-muted)' }}>Navigation</div>
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
                    <div className="mt-6 pt-5 border-t space-y-2" style={{ borderColor: 'var(--border-default)' }}>
                        {/* Theme toggle */}
                        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl" style={{ background: 'var(--bg-input)' }}>
                            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Appearance</span>
                            <ThemeToggle showLabel />
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all font-semibold group text-sm"
                        >
                            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 backdrop-blur-md border-b flex items-center justify-between px-6 sticky top-0 z-30 transition-colors flex-shrink-0"
                    style={{ background: 'var(--bg-header)', borderColor: 'var(--border-default)' }}>
                    <button
                        className="p-3 -ml-3 lg:hidden text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-2xl"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={28} />
                    </button>

                    <div className="flex-1 max-w-xl mx-8 hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search patients, records, doctors..."
                                className="w-full rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition-all"
                                style={{
                                    background: 'var(--bg-input)',
                                    color: 'var(--text-primary)',
                                    border: '1.5px solid var(--border-default)'
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 transition-colors rounded-lg relative" style={{ color: 'var(--text-muted)' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-input)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-900"></span>
                        </button>

                        <div className="h-8 w-px" style={{ background: 'var(--border-default)' }}></div>

                        <div className="flex items-center gap-3 cursor-pointer">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>{username}</div>
                                <div className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">{role}</div>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                {username?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8" style={{ background: 'var(--bg-main)' }}>
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};
