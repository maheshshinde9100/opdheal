import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Video,
    User,
    Clock,
    CheckCircle,
    XCircle,
    RefreshCw,
    ClipboardList
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/Button';
import api from '../../services/api';
import { formatTime } from '../../utils/helpers';
import type { Appointment } from '../../types';

const STATUS_STYLES: Record<string, string> = {
    SCHEDULED: 'bg-blue-50 text-blue-700 border-blue-100',
    CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    IN_PROGRESS: 'bg-amber-50 text-amber-700 border-amber-100',
    COMPLETED: 'bg-green-50 text-green-700 border-green-100',
    CANCELLED: 'bg-red-50 text-red-700 border-red-100',
};

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export const DoctorSchedule: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weekOffset, setWeekOffset] = useState(0);
    const profileId = api.getProfileId();

    useEffect(() => {
        loadSchedule();
    }, []);

    const loadSchedule = async () => {
        setIsLoading(true);
        try {
            const data = profileId
                ? await api.getDoctorAppointments(profileId)
                : await api.getAllAppointments();
            setAppointments(data);
        } catch (error) {
            console.error('Failed to load schedule', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await api.updateAppointment(id, { status } as any);
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: status as any } : a));
        } catch (err) {
            console.error('Status update failed', err);
        }
    };

    // Build week starting from Monday
    const getWeekDays = () => {
        const today = new Date();
        const base = new Date(today);
        base.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7); // Monday-based
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(base);
            d.setDate(base.getDate() + i);
            return d;
        });
    };

    const weekDays = getWeekDays();
    const selectedISO = selectedDate.toISOString().split('T')[0];

    const dayAppointments = appointments
        .filter(a => a.appointmentDate?.startsWith(selectedISO))
        .sort((a, b) => {
            const ta = a.appointmentTime || '';
            const tb = b.appointmentTime || '';
            return ta.localeCompare(tb);
        });

    const todayISO = new Date().toISOString().split('T')[0];
    const todayCount = appointments.filter(a => a.appointmentDate?.startsWith(todayISO)).length;
    const weekCount = weekDays.filter(d => {
        const iso = d.toISOString().split('T')[0];
        return appointments.some(a => a.appointmentDate?.startsWith(iso));
    }).length;

    return (
        <DashboardLayout role="DOCTOR">
            <div className="space-y-8 animate-fade-in font-inter">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">My Schedule</h1>
                        <p className="text-neutral-500 font-medium mt-1">View and manage your daily consultations.</p>
                    </div>
                    <Button onClick={loadSchedule} className="bg-white border border-neutral-200 text-neutral-700 h-11 shadow-sm">
                        <RefreshCw size={16} className="mr-2" /> Refresh
                    </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Today's Appointments", value: todayCount, color: 'text-primary-600', bg: 'bg-primary-50' },
                        { label: 'Active Days This Week', value: weekCount, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Total This Month', value: appointments.length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: 'Completed', value: appointments.filter(a => a.status === 'COMPLETED').length, color: 'text-green-600', bg: 'bg-green-50' },
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.bg} rounded-2xl p-5`}>
                            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Week Calendar Strip */}
                <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-neutral-100">
                        <h2 className="font-bold text-neutral-700 text-sm">
                            {weekDays[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setWeekOffset(w => w - 1)}
                                className="w-9 h-9 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => { setWeekOffset(0); setSelectedDate(new Date()); }}
                                className="px-4 h-9 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors"
                            >
                                Today
                            </button>
                            <button
                                onClick={() => setWeekOffset(w => w + 1)}
                                className="w-9 h-9 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 divide-x divide-neutral-100 p-2 gap-1">
                        {weekDays.map((day, i) => {
                            const iso = day.toISOString().split('T')[0];
                            const isSelected = iso === selectedDate.toISOString().split('T')[0];
                            const isToday = iso === new Date().toISOString().split('T')[0];
                            const dayApts = appointments.filter(a => a.appointmentDate?.startsWith(iso));
                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedDate(day)}
                                    className={`flex flex-col items-center py-4 px-2 rounded-2xl transition-all ${isSelected
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : isToday
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'hover:bg-neutral-50 text-neutral-600'
                                        }`}
                                >
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-primary-200' : 'text-neutral-400'}`}>
                                        {WEEKDAYS[day.getDay()]}
                                    </span>
                                    <span className="text-2xl font-black mt-1">{day.getDate()}</span>
                                    {dayApts.length > 0 && (
                                        <div className={`w-1.5 h-1.5 rounded-full mt-2 ${isSelected ? 'bg-primary-300' : 'bg-primary-500'}`} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Day's Appointments */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-neutral-800">
                            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h2>
                        <span className="text-sm font-semibold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                            {dayAppointments.length} appointment{dayAppointments.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center py-20 gap-4">
                            <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-neutral-400 font-semibold">Loading schedule...</p>
                        </div>
                    ) : dayAppointments.length > 0 ? (
                        <div className="space-y-4">
                            {dayAppointments.map((appt) => (
                                <div
                                    key={appt.id}
                                    className="bg-white rounded-2xl border border-neutral-100 hover:border-primary-200 hover:shadow-md transition-all group overflow-hidden"
                                >
                                    <div className="flex">
                                        {/* Time Block */}
                                        <div className="w-32 bg-gradient-to-b from-neutral-50 to-white p-4 flex flex-col items-center justify-center border-r border-neutral-100 text-center">
                                            <Clock size={14} className="text-neutral-400 mb-1" />
                                            <div className="text-lg font-black text-neutral-900">{appt.appointmentDateTime ? formatTime(appt.appointmentDateTime.split('T')[1]?.slice(0, 5) ?? '') : '—'}</div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-indigo-100 flex items-center justify-center font-black text-primary-600 text-lg">
                                                    {appt.patient?.user?.firstName?.charAt(0) || <User size={20} />}
                                                </div>
                                                <div>
                                                    <h3 className="font-extrabold text-neutral-900 text-base group-hover:text-primary-600 transition-colors">
                                                        {appt.patient?.user?.firstName} {appt.patient?.user?.lastName}
                                                    </h3>
                                                    <p className="text-sm text-neutral-500 font-medium italic mt-0.5">
                                                        {appt.reasonForVisit}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${STATUS_STYLES[appt.status] || ''}`}>
                                                    {appt.status}
                                                </span>
                                                {appt.status === 'SCHEDULED' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            className="bg-primary-50 text-primary-600 hover:bg-primary-100 border-none font-bold h-9 shadow-none"
                                                        >
                                                            <Video size={15} className="mr-1.5" /> Join
                                                        </Button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(appt.id, 'COMPLETED')}
                                                            className="w-9 h-9 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                                                            title="Mark Completed"
                                                        >
                                                            <CheckCircle size={15} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(appt.id, 'CANCELLED')}
                                                            className="w-9 h-9 rounded-xl border border-red-200 bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                                                            title="Cancel"
                                                        >
                                                            <XCircle size={15} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-neutral-200">
                            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-300">
                                <ClipboardList size={36} />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-700 mb-2">No appointments this day</h3>
                            <p className="text-neutral-400 font-medium">Your schedule is clear for this day.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};
