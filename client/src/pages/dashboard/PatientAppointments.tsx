import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    Search,
    Plus,
    Trash2,
    Video,
    User,
    X,
    ChevronDown,
    CheckCircle,
    RefreshCw,
    AlertCircle,
    Stethoscope
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import api from '../../services/api';
import { formatTime } from '../../utils/helpers';
import type { Appointment, Doctor } from '../../types';

const STATUS_COLORS: Record<string, string> = {
    SCHEDULED: 'bg-blue-50 text-blue-700 border-blue-100',
    CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    IN_PROGRESS: 'bg-amber-50 text-amber-700 border-amber-100',
    COMPLETED: 'bg-green-50 text-green-700 border-green-100',
    CANCELLED: 'bg-red-50 text-red-700 border-red-100',
};

export const PatientAppointments: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [showBookModal, setShowBookModal] = useState(false);
    const [booking, setBooking] = useState({ doctorId: '', date: '', time: '', reason: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const profileId = api.getProfileId();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [apptData, docData] = await Promise.all([
                profileId ? api.getAppointmentsByPatient(profileId) : api.getAllAppointments(),
                api.getAvailableDoctors(),
            ]);
            setAppointments(apptData);
            setDoctors(docData);
        } catch (error) {
            console.error('Failed to load appointments', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBook = async () => {
        if (!booking.doctorId || !booking.date || !booking.time || !booking.reason) return;
        setIsSubmitting(true);
        try {
            await api.createAppointment({
                patientId: profileId ? Number(profileId) : undefined,
                doctorId: Number(booking.doctorId),
                appointmentDate: booking.date,
                appointmentTime: booking.time,
                reasonForVisit: booking.reason,
                status: 'SCHEDULED',
            } as any);
            setSuccessMsg('Appointment booked successfully!');
            setShowBookModal(false);
            setBooking({ doctorId: '', date: '', time: '', reason: '' });
            await loadData();
            setTimeout(() => setSuccessMsg(''), 4000);
        } catch (err) {
            console.error('Booking failed', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm('Cancel this appointment?')) return;
        try {
            await api.updateAppointment(id, { status: 'CANCELLED' } as any);
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
        } catch (err) {
            console.error('Cancel failed', err);
        }
    };

    const filtered = appointments.filter(a => {
        const matchSearch =
            a.doctor?.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.doctor?.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.doctor?.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.reasonForVisit?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
        return matchSearch && matchStatus;
    }).sort((a, b) => {
        const da = a.appointmentDateTime ? new Date(a.appointmentDateTime).getTime() : 0;
        const db = b.appointmentDateTime ? new Date(b.appointmentDateTime).getTime() : 0;
        return db - da;
    });

    const upcoming = appointments.filter(a => a.status === 'SCHEDULED' || a.status === 'CONFIRMED');
    const completed = appointments.filter(a => a.status === 'COMPLETED');

    return (
        <DashboardLayout role="PATIENT">
            <div className="space-y-8 animate-fade-in font-inter">
                {/* Success Toast */}
                {successMsg && (
                    <div className="fixed top-6 right-6 z-50 bg-success-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up">
                        <CheckCircle size={20} />
                        <span className="font-bold">{successMsg}</span>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">My Appointments</h1>
                        <p className="text-neutral-500 font-medium mt-1">Schedule, manage, and track your consultations.</p>
                    </div>
                    <Button
                        onClick={() => setShowBookModal(true)}
                        className="bg-primary-600 text-white shadow-primary h-12 px-6 rounded-xl"
                    >
                        <Plus size={18} className="mr-2" /> Book Appointment
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total', value: appointments.length, color: 'text-neutral-700', bg: 'bg-neutral-50', border: 'border-neutral-100' },
                        { label: 'Upcoming', value: upcoming.length, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100' },
                        { label: 'Completed', value: completed.length, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-100' },
                        { label: 'Cancelled', value: appointments.filter(a => a.status === 'CANCELLED').length, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-100' },
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.bg} border ${stat.border} rounded-2xl p-4 text-center`}>
                            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                        <Input
                            placeholder="Search by doctor, specialization, reason..."
                            className="pl-12 h-12 bg-white border-neutral-200 rounded-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {['ALL', 'SCHEDULED', 'COMPLETED', 'CANCELLED'].map(s => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-4 h-12 rounded-xl text-xs font-bold transition-all border ${statusFilter === s
                                    ? 'bg-primary-600 text-white border-primary-600'
                                    : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                                    }`}
                            >
                                {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Appointments List */}
                {isLoading ? (
                    <div className="flex flex-col items-center py-24 gap-4">
                        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-neutral-400 font-semibold">Loading appointments...</p>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid gap-4">
                        {filtered.map((appt) => {
                            const dateObj = appt.appointmentDateTime ? new Date(appt.appointmentDateTime) : null;
                            const isActive = appt.status === 'SCHEDULED' || appt.status === 'CONFIRMED';
                            return (
                                <div
                                    key={appt.id}
                                    className="bg-white rounded-2xl border border-neutral-100 hover:shadow-lg hover:border-primary-100 transition-all group overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        {/* Date Block */}
                                        <div className="md:w-44 bg-gradient-to-b from-neutral-50 to-white p-6 flex flex-col items-center justify-center border-r border-neutral-100 text-center">
                                            <div className="text-xs font-black text-primary-600 uppercase tracking-widest mb-1">
                                                {dateObj ? dateObj.toLocaleDateString('en-US', { month: 'short' }) : '—'}
                                            </div>
                                            <div className="text-5xl font-black text-neutral-900 leading-none">
                                                {dateObj ? dateObj.getDate() : '—'}
                                            </div>
                                            <div className="text-xs font-bold text-neutral-400 uppercase mt-1">
                                                {dateObj ? dateObj.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric' }) : ''}
                                            </div>
                                            <div className="mt-3 flex items-center gap-1.5 text-sm text-neutral-700 font-black">
                                                <Clock size={14} /> {appt.appointmentDateTime ? appt.appointmentDateTime.split('T')[1]?.slice(0, 5) : '—'}
                                            </div>
                                        </div>

                                        {/* Main Content */}
                                        <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-indigo-100 flex items-center justify-center text-2xl font-black text-primary-600 border-2 border-white shadow-sm">
                                                    {appt.doctor?.user?.firstName?.charAt(0) || <User size={24} />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="text-lg font-extrabold text-neutral-900 group-hover:text-primary-600 transition-colors">
                                                            Dr. {appt.doctor?.user?.firstName} {appt.doctor?.user?.lastName}
                                                        </h3>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full border ${STATUS_COLORS[appt.status] || 'bg-neutral-100 text-neutral-600'}`}>
                                                            {appt.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-primary-600 font-semibold underline underline-offset-2 mt-0.5">
                                                        {appt.doctor?.specialization}
                                                    </p>
                                                    <p className="text-sm text-neutral-500 mt-1 italic">
                                                        "{appt.reasonForVisit}"
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {isActive && (
                                                    <Button
                                                        className="bg-primary-50 text-primary-600 hover:bg-primary-100 border-none font-bold shadow-none h-10"
                                                        size="sm"
                                                    >
                                                        <Video size={16} className="mr-2" /> Join Call
                                                    </Button>
                                                )}
                                                {isActive && (
                                                    <button
                                                        onClick={() => handleCancel(appt.id)}
                                                        className="w-10 h-10 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                                                        title="Cancel appointment"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-neutral-200">
                        <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-300">
                            <Calendar size={44} />
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 mb-2">No appointments found</h3>
                        <p className="text-neutral-400 font-medium mb-8">
                            {searchTerm || statusFilter !== 'ALL'
                                ? 'Try adjusting your filters.'
                                : "You haven't scheduled any appointments yet."}
                        </p>
                        <Button
                            onClick={() => setShowBookModal(true)}
                            className="bg-primary-600 text-white shadow-primary"
                        >
                            Book Your First Appointment
                        </Button>
                    </div>
                )}
            </div>

            {/* Book Appointment Modal */}
            {showBookModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black">Book Appointment</h2>
                                    <p className="text-primary-200 text-sm mt-1">Schedule your consultation with our doctors</p>
                                </div>
                                <button
                                    onClick={() => setShowBookModal(false)}
                                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5">
                            {/* Doctor Selection */}
                            <div>
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">
                                    Select Doctor *
                                </label>
                                <div className="relative">
                                    <Stethoscope size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                                    <select
                                        value={booking.doctorId}
                                        onChange={(e) => setBooking(p => ({ ...p, doctorId: e.target.value }))}
                                        className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-200 bg-white text-neutral-900 font-semibold text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
                                    >
                                        <option value="">Choose a doctor...</option>
                                        {doctors.map(d => (
                                            <option key={d.id} value={d.id}>
                                                Dr. {d.user?.firstName} {d.user?.lastName} — {d.specialization}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Date & Time Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">
                                        Date *
                                    </label>
                                    <Input
                                        type="date"
                                        value={booking.date}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setBooking(p => ({ ...p, date: e.target.value }))}
                                        className="h-12 border-neutral-200 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">
                                        Time *
                                    </label>
                                    <Input
                                        type="time"
                                        value={booking.time}
                                        onChange={(e) => setBooking(p => ({ ...p, time: e.target.value }))}
                                        className="h-12 border-neutral-200 rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">
                                    Reason for Visit *
                                </label>
                                <textarea
                                    value={booking.reason}
                                    onChange={(e) => setBooking(p => ({ ...p, reason: e.target.value }))}
                                    placeholder="Briefly describe your symptoms or reason for the appointment..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 resize-none font-medium"
                                />
                            </div>

                            {/* Info Banner */}
                            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
                                <AlertCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-blue-700 font-medium">
                                    All consultations are video-based. You'll receive a confirmation with the meeting link.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 h-12 border-neutral-200"
                                    onClick={() => setShowBookModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 h-12 bg-primary-600 text-white rounded-xl font-bold"
                                    onClick={handleBook}
                                    disabled={isSubmitting || !booking.doctorId || !booking.date || !booking.time || !booking.reason}
                                >
                                    {isSubmitting ? (
                                        <RefreshCw size={16} className="animate-spin mr-2" />
                                    ) : (
                                        <Calendar size={16} className="mr-2" />
                                    )}
                                    {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};
