import React, { useEffect, useState } from 'react';
import {
    Users,
    Calendar,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Shield,
    Database,
    Bell
} from 'lucide-react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import type { DashboardStats, User as UserType } from '../../types';

export const AdminOverview: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [users, setUsers] = useState<UserType[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [statsData, usersData] = await Promise.all([
                    api.getDashboardStats(),
                    api.getAllUsers()
                ]);
                setStats(statsData);
                setUsers(usersData.slice(0, 6));
            } catch (error) {
                console.error("Failed to load admin dashboard", error);
            }
        };
        loadData();
    }, []);

    const statCards = [
        { label: 'Total Doctors', value: stats?.totalDoctors ?? 0, trend: '+12%', trendUp: true, icon: <Users size={30} className="text-primary-600" />, color: 'bg-primary-50' },
        { label: 'Total Patients', value: stats?.totalPatients ?? 0, trend: '+18%', trendUp: true, icon: <Users size={30} className="text-success-600" />, color: 'bg-success-50' },
        { label: 'Total Appointments', value: stats?.totalAppointments ?? 0, trend: '-3%', trendUp: false, icon: <Calendar size={30} className="text-warning-600" />, color: 'bg-warning-50' },
        { label: 'Total Revenue', value: `$${stats?.totalRevenue ?? 0}`, trend: '+24%', trendUp: true, icon: <CreditCard size={30} className="text-secondary-600" />, color: 'bg-secondary-50' },
    ];

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-10 animate-fade-in font-inter">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">System Administration</h1>
                        <p className="text-lg text-neutral-500 font-medium">Global platform overview and management.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button className="bg-white text-neutral-900 border-2 border-neutral-200">
                            System Logs
                        </Button>
                        <Button className="bg-primary-600 text-white shadow-primary">
                            Platform Settings
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, i) => (
                        <Card key={i} className="hover:shadow-xl transition-all border-none shadow-soft overflow-hidden group">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{stat.label}</p>
                                    <h3 className="text-3xl font-black text-neutral-900 leading-none">{stat.value}</h3>
                                    <div className={`flex items-center gap-1 text-xs font-bold mt-2 ${stat.trendUp ? 'text-success-600' : 'text-error-600'}`}>
                                        {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                        {stat.trend} <span className="text-neutral-400">vs last month</span>
                                    </div>
                                </div>
                                <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Recent Users */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-0 overflow-hidden border-none shadow-soft">
                            <div className="p-6 bg-white border-b border-neutral-100 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-neutral-900">Recent User Registrations</h2>
                                <Button variant="outline" size="sm" className="font-bold">Manage All Users</Button>
                            </div>
                            <div className="divide-y divide-neutral-100">
                                {users.map((user) => (
                                    <div key={user.id} className="p-4 px-6 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center text-neutral-400 font-bold overflow-hidden border border-neutral-200">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-neutral-900">{user.firstName} {user.lastName}</h4>
                                                <div className="text-xs font-semibold text-neutral-400">{user.email}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <Badge variant={user.role === 'ADMIN' ? 'error' : user.role === 'DOCTOR' ? 'success' : 'primary'} className="font-bold uppercase tracking-wider text-[10px] px-3">
                                                {user.role}
                                            </Badge>
                                            <div className="text-right hidden sm:block">
                                                <div className="text-xs font-bold text-neutral-400 uppercase">Joined</div>
                                                <div className="text-sm font-bold text-neutral-700">Dec 28, 2025</div>
                                            </div>
                                            <Button size="sm" variant="outline" className="h-9 w-9 p-0 border-neutral-200 rounded-xl">
                                                <ArrowUpRight size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* System Health / Status */}
                    <div className="space-y-6">
                        <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white p-8 border-none overflow-hidden relative">
                            <div className="absolute top-0 right-0 opacity-10 -translate-y-4 translate-x-4">
                                <Shield size={180} />
                            </div>
                            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                                <Activity className="text-success-500" /> System Health
                            </h3>
                            <div className="space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-neutral-400">
                                        <span>Server Load</span>
                                        <span className="text-white">24%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-success-500 w-[24%]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-neutral-400">
                                        <span>Database Integrity</span>
                                        <span className="text-white">99.9%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary-500 w-[99%]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-neutral-400">
                                        <span>API Latency</span>
                                        <span className="text-white">124ms</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-warning-500 w-[35%]" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Database size={16} className="text-primary-400" />
                                    <span className="text-xs font-bold text-neutral-400 uppercase">Master Node: <span className="text-white">Active</span></span>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                            </div>
                        </Card>

                        <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-soft">
                            <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                                <Bell className="text-primary-600" size={18} /> Notifications Hub
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { title: 'Server maintenance', time: '2 hours ago', urgent: true },
                                    { title: 'New doctor verified', time: '5 hours ago', urgent: false },
                                    { title: 'Monthly report ready', time: 'Yesterday', urgent: false },
                                ].map((note, i) => (
                                    <div key={i} className={`p-4 rounded-2xl flex items-center justify-between transition-colors ${note.urgent ? 'bg-error-50' : 'bg-neutral-50 hover:bg-neutral-100'}`}>
                                        <div>
                                            <div className={`text-sm font-bold ${note.urgent ? 'text-error-700' : 'text-neutral-800'}`}>{note.title}</div>
                                            <div className="text-[10px] font-bold text-neutral-400 uppercase">{note.time}</div>
                                        </div>
                                        {note.urgent && <div className="w-2 h-2 rounded-full bg-error-500" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
