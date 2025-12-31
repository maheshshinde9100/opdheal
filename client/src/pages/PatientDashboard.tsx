import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    FileText,
    Pill,
    Wallet,
    Bell,
    Settings,
    LogOut,
    Activity,
    Clock,
    User,
    Search
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { PageLoader } from '../components/Loader';
import api from '../services/api';
import { formatDate, formatTime } from '../utils/helpers';
import type { Appointment, DashboardStats } from '../types';

export const PatientDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [, setStats] = useState<DashboardStats | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const username = api.getUsername();

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [statsData, appointmentsData] = await Promise.all([
                    api.getDashboardStats(),
                    api.getAllAppointments(), // In real app, filter by patient ID
                ]);
                setStats(statsData);
                setAppointments(appointmentsData.slice(0, 5)); // Show latest 5
            } catch (error) {
                console.error('Error loading dashboard:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const handleLogout = () => {
        api.logout();
        navigate('/login');
    };

    if (isLoading) {
        return <PageLoader />;
    }

    const quickActions = [
        { icon: <Calendar />, label: 'Book Appointment', color: 'from-blue-500 to-cyan-500' },
        { icon: <FileText />, label: 'Medical Records', color: 'from-purple-500 to-pink-500' },
        { icon: <Pill />, label: 'Prescriptions', color: 'from-green-500 to-emerald-500' },
        { icon: <Wallet />, label: 'Bills & Payments', color: 'from-orange-500 to-red-500' },
    ];

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header/Navbar */}
            <nav className="bg-white border-b sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <Activity className="w-8 h-8 text-blue-600" />
                            <span className="text-2xl font-bold text-neutral-900">OPD Heal</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Search className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                            <button className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                                <Bell className="w-6 h-6 text-neutral-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="font-semibold text-neutral-900">{username}</p>
                                    <p className="text-xs text-neutral-500">Patient</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8 animate-slide-down">
                    <h1 className="text-4xl font-bold text-neutral-900 mb-2">
                        Welcome back, {username}!
                    </h1>
                    <p className="text-lg text-neutral-600">Here's what's happening with your health today</p>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Total Appointments', value: appointments.length, icon: <Calendar />, color: 'from-blue-500 to-cyan-500' },
                        { label: 'Upcoming', value: appointments.filter(a => a.status === 'SCHEDULED').length, icon: <Clock />, color: 'from-purple-500 to-pink-500' },
                        { label: 'Prescriptions', value: 0, icon: <Pill />, color: 'from-green-500 to-emerald-500' },
                        { label: 'Pending Bills', value: 0, icon: <Wallet />, color: 'from-orange-500 to-red-500' },
                    ].map((stat, i) => (
                        <Card key={i} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-neutral-600 text-sm mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                                </div>
                                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                                    {React.cloneElement(stat.icon, { className: 'w-7 h-7 text-white' })}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                <Card className="mb-8 animate-slide-up">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-4 gap-4">
                            {quickActions.map((action, i) => (
                                <button
                                    key={i}
                                    className="p-6 rounded-xl border-2 border-neutral-200 hover:border-blue-500 hover:shadow-lg transition-all group"
                                >
                                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                        {React.cloneElement(action.icon, { className: 'w-6 h-6 text-white' })}
                                    </div>
                                    <p className="font-semibold text-neutral-900">{action.label}</p>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Recent Appointments */}
                    <div className="lg:col-span-2">
                        <Card className="animate-slide-up">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Recent Appointments</CardTitle>
                                    <Button variant="outline" size="sm">View All</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {appointments.length > 0 ? (
                                    <div className="space-y-4">
                                        {appointments.map((appointment) => (
                                            <div
                                                key={appointment.id}
                                                className="p-4 border border-neutral-200 rounded-lg hover:shadow-md transition-all"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <p className="font-semibold text-neutral-900 mb-1">
                                                            Dr. {appointment.doctor?.user?.firstName} {appointment.doctor?.user?.lastName}
                                                        </p>
                                                        <p className="text-sm text-neutral-600">{appointment.doctor?.specialization}</p>
                                                    </div>
                                                    <Badge status={appointment.status}>{appointment.status}</Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-neutral-600">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatDate(appointment.appointmentDate)}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        {formatTime(appointment.appointmentTime)}
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-sm text-neutral-600">
                                                    Reason: {appointment.reasonForVisit}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                                        <p className="text-neutral-600">No appointments scheduled</p>
                                        <Button variant="primary" size="sm" className="mt-4">
                                            Book Your First Appointment
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <Card className="animate-slide-up">
                            <CardContent>
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <User className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="font-bold text-lg text-neutral-900 mb-1">{username}</h3>
                                    <p className="text-neutral-600 text-sm mb-4">Patient ID: #12345</p>
                                    <div className="space-y-2">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Settings className="w-4 h-4" />
                                            Edit Profile
                                        </Button>
                                        <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Health Tips */}
                        <Card className="animate-slide-up">
                            <CardHeader>
                                <CardTitle>Health Tips</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-neutral-700">
                                            💧 Drink at least 8 glasses of water daily
                                        </p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-lg">
                                        <p className="text-sm text-neutral-700">
                                            🏃 Exercise for 30 minutes every day
                                        </p>
                                    </div>
                                    <div className="p-3 bg-purple-50 rounded-lg">
                                        <p className="text-sm text-neutral-700">
                                            😴 Get 7-8 hours of sleep each night
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
