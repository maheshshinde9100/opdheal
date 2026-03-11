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
import api from '../../services/api';
import { formatDate, formatTime } from '../../utils/helpers';
import type { Appointment } from '../../types';

export const AdminAppointments: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            const data = await api.getAllAppointments();
            setAppointments(data);
        } catch (error) {
            console.error("Failed to load appointments", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredAppointments = appointments.filter(a =>
        a.patient?.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.doctor?.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-8 animate-fade-in font-poppins">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-neutral-900 dark:text-white leading-tight">Appointment Oversight</h1>
                        <p className="text-neutral-500 font-bold">Monitor systems-wide consultation schedules and status.</p>
                    </div>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Today', count: '124', Icon: Calendar, color: 'bg-primary-600', text: 'text-white' },
                        { label: 'Pending', count: '45', Icon: Clock, color: 'bg-warning-50 dark:bg-warning-900/10', text: 'text-warning-600' },
                        { label: 'In Progress', count: '12', Icon: MapPin, color: 'bg-indigo-50 dark:bg-indigo-900/10', text: 'text-indigo-600' },
                        { label: 'Emergency', count: '03', Icon: AlertCircle, color: 'bg-error-50 dark:bg-error-900/10', text: 'text-error-600' }
                    ].map((stat, i) => (
                        <Card key={i} className={`p-6 border-none rounded-[32px] shadow-soft flex items-center justify-between ${stat.color}`}>
                            <div>
                                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${stat.text === 'text-white' ? 'text-primary-100' : 'text-neutral-400'}`}>{stat.label}</p>
                                <h3 className={`text-2xl font-black ${stat.text === 'text-white' ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>{stat.count}</h3>
                            </div>
                            <div className={`p-3 rounded-2xl ${stat.text === 'text-white' ? 'bg-white/20' : stat.color.replace('50', '100')}`}>
                                <stat.Icon className={stat.text} size={20} />
                            </div>
                        </Card>
                    ))}
                </div>

                <Card className="p-2 border-none shadow-soft rounded-[24px] flex flex-col md:flex-row gap-2 bg-white dark:bg-neutral-800">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                        <input
                            placeholder="Global search across patients & doctors..."
                            className="w-full pl-12 h-14 bg-transparent border-none focus:ring-0 font-bold text-neutral-700 dark:text-neutral-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="border-neutral-100 dark:border-neutral-700 h-14 rounded-xl font-bold px-6">
                        <Download size={20} className="mr-2" /> Export Log
                    </Button>
                </Card>

                {/* Table */}
                <Card className="p-0 overflow-hidden border-neutral-100 dark:border-neutral-800 shadow-soft rounded-[32px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50/50 dark:bg-neutral-800/50 border-b border-neutral-100 dark:border-neutral-800">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Medical Staff</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Patient Details</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Schedule</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {isLoading ? (
                                    <tr><td colSpan={5} className="text-center py-20 font-black text-neutral-400">Loading master schedule...</td></tr>
                                ) : filteredAppointments.length > 0 ? (
                                    filteredAppointments.map((app) => (
                                        <tr key={app.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center font-black">
                                                        {app.doctor?.user?.firstName?.charAt(0)}
                                                    </div>
                                                    <div className="font-bold text-neutral-900 dark:text-white">Dr. {app.doctor?.user?.firstName}</div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-neutral-700 dark:text-neutral-300">Pt. {app.patient?.user?.firstName}</div>
                                                <div className="text-xs font-medium text-neutral-400">{app.reasonForVisit}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-black text-neutral-600 dark:text-neutral-400">{app.appointmentDateTime ? formatDate(app.appointmentDateTime.split('T')[0]) : '—'}</div>
                                                <div className="text-xs font-bold text-primary-500">{app.appointmentDateTime ? formatTime(app.appointmentDateTime.split('T')[1]?.slice(0, 5) ?? '') : '—'}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge status={app.status} className="font-black text-[9px] tracking-widest uppercase py-1 px-3">
                                                    {app.status}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <Button size="sm" variant="outline" className="h-10 w-10 p-0 border-neutral-100 dark:border-neutral-800 rounded-xl">
                                                    <ChevronRight size={18} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={5} className="text-center py-20 italic font-black text-neutral-400">No appointments scheduled in the system.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};
