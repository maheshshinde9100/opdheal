import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    AlertCircle,
    Search,
    Download,
    ChevronRight
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import api from '../../services/api';
import { formatDate, formatTime } from '../../utils/helpers';
import type { Appointment } from '../../types';

export const AdminAppointments: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dashboardStats, setDashboardStats] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [apptData, statsData] = await Promise.all([
                api.getAllAppointments(),
                api.getDashboardStats()
            ]);
            setAppointments(apptData);
            setDashboardStats(statsData);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredAppointments = appointments.filter(a =>
        a.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.reason?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate status counts
    const getStatusCount = (status: string) => 
        appointments.filter(a => a.status === status).length;

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-8 animate-fade-in font-inter">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 leading-tight">Appointment Oversight</h1>
                        <p className="text-slate-500 font-medium mt-1">Monitor systems-wide consultation schedules and status.</p>
                    </div>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Today', count: dashboardStats?.todayAppointments || 0, Icon: Calendar, color: 'bg-teal-600', text: 'text-white' },
                        { label: 'Pending', count: getStatusCount('SCHEDULED'), Icon: Clock, color: 'bg-teal-50', text: 'text-teal-700' },
                        { label: 'In Progress', count: getStatusCount('IN_PROGRESS'), Icon: MapPin, color: 'bg-emerald-50', text: 'text-emerald-700' },
                        { label: 'Cancelled', count: getStatusCount('CANCELLED'), Icon: AlertCircle, color: 'bg-rose-50', text: 'text-rose-700' }
                    ].map((stat, i) => (
                        <Card key={i} className={`p-6 border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between ${stat.color}`}>
                            <div>
                                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${stat.text === 'text-white' ? 'text-teal-100' : 'text-slate-500'}`}>{stat.label}</p>
                                <h3 className={`text-3xl font-bold ${stat.text === 'text-white' ? 'text-white' : 'text-slate-900'}`}>{stat.count}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.text === 'text-white' ? 'bg-white/20' : 'bg-teal-100'}`}>
                                <stat.Icon className={stat.text} size={24} />
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <Input
                            placeholder="Global search across patients & doctors..."
                            className="pl-12 h-12 bg-white border-slate-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="border-slate-200 text-slate-700 h-12 font-medium">
                        <Download size={18} className="mr-2" /> Export Log
                    </Button>
                </div>

                {/* Table */}
                <Card className="p-0 overflow-hidden border border-slate-200 shadow-sm rounded-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Medical Staff</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Patient Details</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Schedule</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {isLoading ? (
                                    <tr><td colSpan={5} className="text-center py-16 font-medium text-slate-400">Loading master schedule...</td></tr>
                                ) : filteredAppointments.length > 0 ? (
                                    filteredAppointments.map((app) => (
                                        <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                                                        {app.doctorName?.charAt(0) || 'D'}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900">{app.doctorName}</div>
                                                        <div className="text-xs text-slate-500 font-medium">{app.doctorSpecialization}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="font-semibold text-slate-700">{app.patientName}</div>
                                                <div className="text-xs font-medium text-slate-500">{app.reason}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="text-sm font-semibold text-slate-700">{app.appointmentDateTime ? formatDate(app.appointmentDateTime.split('T')[0]) : '—'}</div>
                                                <div className="text-xs font-semibold text-teal-600">{app.appointmentDateTime ? formatTime(app.appointmentDateTime.split('T')[1]?.slice(0, 5) ?? '') : '—'}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <Badge status={app.status} className="font-semibold text-xs tracking-wider uppercase py-1 px-3">
                                                    {app.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <Button size="sm" variant="outline" className="h-9 w-9 p-0 border-slate-200 rounded-lg text-slate-500">
                                                    <ChevronRight size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={5} className="text-center py-16 font-medium text-slate-400">No appointments scheduled in the system.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};
