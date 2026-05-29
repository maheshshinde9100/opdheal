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
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium group ${isActive
            ? 'bg-teal-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700'
            }`}
    >
        <span className={`transition-transform duration-200`}>
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
        { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/patient/dashboard' },
        { icon: <Calendar size={20} />, label: 'Appointments', path: '/patient/appointments' },
        { icon: <FileText size={20} />, label: 'Medical Records', path: '/patient/records' },
        { icon: <ClipboardList size={20} />, label: 'Prescriptions', path: '/patient/prescriptions' },
        { icon: <CreditCard size={20} />, label: 'Billing', path: '/patient/billing' },
        { icon: <Users size={20} />, label: 'Find Doctors', path: '/patient/doctors' },
        { icon: <User size={20} />, label: 'Profile', path: '/patient/profile' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/patient/settings' },
    ];

    const doctorMenuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/doctor/dashboard' },
        { icon: <Calendar size={20} />, label: 'Schedule', path: '/doctor/schedule' },
        { icon: <Users size={20} />, label: 'My Patients', path: '/doctor/patients' },
        { icon: <FileText size={20} />, label: 'Medical History', path: '/doctor/records' },
        { icon: <ClipboardList size={20} />, label: 'Prescriptions', path: '/doctor/prescriptions' },
        { icon: <User size={20} />, label: 'Profile', path: '/doctor/profile' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/doctor/settings' },
    ];

    const adminMenuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Control Panel', path: '/admin/dashboard' },
        { icon: <HeartPulse size={20} />, label: 'Doctors', path: '/admin/doctors' },
        { icon: <Users size={20} />, label: 'Patients', path: '/admin/patients' },
        { icon: <Calendar size={20} />, label: 'Appointments', path: '/admin/appointments' },
        { icon: <CreditCard size={20} />, label: 'Financials', path: '/admin/billing' },
        { icon: <Settings size={20} />, label: 'System Settings', path: '/admin/settings' },
    ];

    const menuItems = role === 'PATIENT' ? patientMenuItems : role === 'DOCTOR' ? doctorMenuItems : adminMenuItems;

    const handleLogout = () => {
        api.logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white transform transition-transform duration-300 lg:translate-x-0 lg:static flex-shrink-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full p-5">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 mb-8 px-2">
                        <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center shadow-sm">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-gray-900">
                            OPD<span className="text-teal-600">Heal</span>
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
                        <div className="text-[10px] font-semibold uppercase tracking-widest mb-3 px-4 text-gray-400">
                            Navigation
                        </div>
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
                    <div className="mt-5 pt-4 border-t border-gray-200 space-y-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all font-medium text-sm"
                        >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30 flex-shrink-0">
                    <button
                        className="p-2 -ml-2 lg:hidden text-gray-500 hover:bg-gray-100 rounded-lg"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex-1 max-w-xl mx-8 hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search patients, records, doctors"
                                className="w-full rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium outline-none bg-gray-50 border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 transition-colors rounded-lg text-gray-500 hover:bg-gray-100 relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        <div className="h-8 w-px bg-gray-200"></div>

                        <div className="flex items-center gap-3 cursor-pointer">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-medium text-gray-900">{username}</div>
                                <div className="text-[10px] font-semibold text-teal-600 uppercase tracking-wider">{role}</div>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                                {username?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};
