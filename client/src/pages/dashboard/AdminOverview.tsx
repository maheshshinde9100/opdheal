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
        { label: 'Registered Providers', value: stats?.totalDoctors ?? 0, trend: '+12%', trendUp: true, icon: <Users size={24} className="text-blue-600" />, color: 'bg-blue-50' },
        { label: 'Active Patients', value: stats?.totalPatients ?? 0, trend: '+18%', trendUp: true, icon: <Users size={24} className="text-emerald-600" />, color: 'bg-emerald-50' },
        { label: 'Total Consultations', value: stats?.totalAppointments ?? 0, trend: '-3%', trendUp: false, icon: <Calendar size={24} className="text-amber-500" />, color: 'bg-amber-50' },
        { label: 'Revenue Generated', value: `$${stats?.totalRevenue ?? 0}`, trend: '+24%', trendUp: true, icon: <CreditCard size={24} className="text-slate-600" />, color: 'bg-slate-100' },
    ];

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-8 animate-fade-in font-inter">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Administration</h1>
                        <p className="text-sm text-slate-600 font-medium mt-1">Global platform overview and infrastructure management.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button className="bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 font-semibold shadow-sm text-sm">
                            System Logs
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm text-sm">
                            Platform Settings
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, i) => (
                        <Card key={i} className="border border-slate-200 shadow-sm overflow-hidden">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-slate-900 leading-none">{stat.value}</h3>
                                    <div className={`flex items-center gap-1 text-xs font-medium mt-2 ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                        {stat.trend} <span className="text-slate-400 ml-1">vs last month</span>
                                    </div>
                                </div>
                                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Recent Users */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-0 overflow-hidden border border-slate-200 shadow-sm">
                            <div className="p-5 bg-white border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900">Recent Platform Registrations</h2>
                                <Button variant="outline" size="sm" className="font-semibold text-slate-600 border-slate-300">Manage Users</Button>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {users.map((user) => (
                                    <div key={user.id} className="p-4 px-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-900 text-sm">{user.firstName} {user.lastName}</h4>
                                                <div className="text-xs text-slate-500 font-medium">{user.email}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <Badge className={`font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded border border-solid ${user.role === 'ADMIN' ? 'bg-rose-50 text-rose-700 border-rose-200' : user.role === 'DOCTOR' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                                {user.role}
                                            </Badge>
                                            <div className="text-right hidden sm:block">
                                                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Registered</div>
                                                <div className="text-xs font-semibold text-slate-700 mt-0.5">Mar 10, 2026</div>
                                            </div>
                                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 rounded shadow-none">
                                                <ArrowUpRight size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* System Health / Status */}
                    <div className="space-y-6">
                        <Card className="bg-slate-900 text-white p-6 border border-slate-800 shadow-md overflow-hidden relative rounded-xl">
                            <div className="absolute top-0 right-0 opacity-5 -translate-y-4 translate-x-4">
                                <Shield size={120} />
                            </div>
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-100">
                                <Activity className="text-emerald-400" size={20} /> Platform Health
                            </h3>
                            <div className="space-y-5 relative z-10">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        <span>Server Load</span>
                                        <span className="text-slate-100">24%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[24%]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        <span>Database Integrity</span>
                                        <span className="text-slate-100">99.9%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[99%]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        <span>API Latency</span>
                                        <span className="text-slate-100">124ms</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 w-[35%]" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Database size={14} className="text-slate-400" />
                                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Master Node: <span className="text-emerald-400">Active</span></span>
                                </div>
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                        </Card>

                        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Bell className="text-slate-600" size={16} /> Notification Center
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { title: 'Server maintenance window', time: '2 hours ago', urgent: true },
                                    { title: 'New medical provider verified', time: '5 hours ago', urgent: false },
                                    { title: 'Monthly audit report available', time: 'Yesterday', urgent: false },
                                ].map((note, i) => (
                                    <div key={i} className={`p-3 rounded-lg flex items-center justify-between transition-colors border ${note.urgent ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 hover:bg-slate-100 border-slate-100'}`}>
                                        <div>
                                            <div className={`text-xs font-semibold ${note.urgent ? 'text-rose-700' : 'text-slate-700'}`}>{note.title}</div>
                                            <div className="text-[10px] font-medium text-slate-500 mt-0.5">{note.time}</div>
                                        </div>
                                        {note.urgent && <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
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
