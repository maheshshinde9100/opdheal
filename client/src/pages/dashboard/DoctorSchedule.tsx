import React, { useState, useEffect } from 'react';
import {
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Video
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import api from '../../services/api';
import { formatTime } from '../../utils/helpers';
import type { Appointment } from '../../types';

export const DoctorSchedule: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<'day' | 'week'>('day');

    useEffect(() => {
        loadSchedule();
    }, []);

    const loadSchedule = async () => {
        try {
            const data = await api.getAllAppointments();
            setAppointments(data);
        } catch (error) {
            console.error("Failed to load schedule", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout role="DOCTOR">
            <div className="space-y-8 animate-fade-in font-inter">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Daily Schedule</h1>
                        <p className="text-neutral-500 font-medium">Manage your consultations and patient time-slots.</p>
                    </div>
                    <div className="flex bg-neutral-100 p-1 rounded-2xl">
                        <button
                            onClick={() => setView('day')}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === 'day' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                        >
                            Day View
                        </button>
                        <button
                            onClick={() => setView('week')}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${view === 'week' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                        >
                            Week View
                        </button>
                    </div>
                </div>

                {/* Calendar Ribbon */}
                <div className="flex items-center justify-between bg-white p-6 rounded-[32px] shadow-soft border border-neutral-100">
                    <Button variant="outline" className="w-12 h-12 p-0 rounded-2xl border-neutral-100">
                        <ChevronLeft size={20} />
                    </Button>
                    <div className="flex-1 px-8 grid grid-cols-7 gap-2 overflow-hidden">
                        {[1, 2, 3, 4, 5, 6, 7].map((_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() + (i - 3));
                            const isActive = i === 3;
                            return (
                                <div key={i} className={`flex flex-col items-center p-3 rounded-2xl transition-all cursor-pointer ${isActive ? 'bg-primary-600 text-white shadow-primary' : 'hover:bg-neutral-50'}`}>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-primary-100' : 'text-neutral-400'}`}>
                                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </span>
                                    <span className="text-xl font-black mt-1">
                                        {date.getDate()}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <Button variant="outline" className="w-12 h-12 p-0 rounded-2xl border-neutral-100">
                        <ChevronRight size={20} />
                    </Button>
                </div>

                {/* Schedule List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="text-center py-20 font-bold text-neutral-400">Loading schedule...</div>
                    ) : appointments.length > 0 ? (
                        appointments.map((appt) => (
                            <Card key={appt.id} className="p-0 overflow-hidden border-neutral-100 hover:border-primary-200 transition-all group">
                                <div className="flex">
                                    <div className="w-40 bg-neutral-50 p-6 flex flex-col items-center justify-center border-r border-neutral-100 text-center">
                                        <div className="text-2xl font-black text-neutral-900 leading-none mb-1">
                                            {formatTime(appt.appointmentTime).split(' ')[0]}
                                        </div>
                                        <div className="text-xs font-black text-primary-600 uppercase tracking-widest">
                                            {formatTime(appt.appointmentTime).split(' ')[1]}
                                        </div>
                                    </div>
                                    <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center font-bold text-neutral-500">
                                                {appt.patient?.user?.firstName?.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-extrabold text-neutral-900 group-hover:text-primary-600 transition-colors">
                                                    {appt.patient?.user?.firstName} {appt.patient?.user?.lastName}
                                                </h3>
                                                <p className="text-sm font-bold text-neutral-500 mt-1 italic flex items-center gap-2">
                                                    Reason: {appt.reasonForVisit}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Badge variant="auto" status={appt.status} className="h-8 font-black text-[10px] tracking-widest uppercase px-3">{appt.status}</Badge>
                                            <div className="h-8 w-px bg-neutral-100 mx-2"></div>
                                            <Button size="sm" className="bg-primary-50 text-primary-600 hover:bg-primary-100 border-none font-bold h-10 shadow-none">
                                                <Video size={16} className="mr-2" /> Start Call
                                            </Button>
                                            <Button variant="outline" size="sm" className="w-10 h-10 p-0 border-neutral-100 rounded-xl">
                                                <MoreVertical size={18} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-neutral-50 rounded-[32px] border-2 border-dashed border-neutral-200">
                            <p className="font-bold text-neutral-400">No appointments for this day.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};
