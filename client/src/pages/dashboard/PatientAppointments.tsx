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
    Stethoscope,
    CreditCard
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import api, { type PaymentRequestDto } from '../../services/api';
import type { Appointment, Doctor } from '../../types';

const STATUS_COLORS: Record<string, string> = {
    SCHEDULED: 'bg-blue-50 text-blue-800 border border-blue-200',
    CONFIRMED: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    IN_PROGRESS: 'bg-amber-50 text-amber-800 border border-amber-200',
    COMPLETED: 'bg-green-50 text-green-800 border border-green-200',
    CANCELLED: 'bg-red-50 text-red-800 border border-red-200',
    NO_SHOW: 'bg-orange-50 text-orange-800 border border-orange-200',
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
                patientId: profileId,
                doctorId: booking.doctorId,
                appointmentDate: booking.date,
                appointmentTime: booking.time,
                reasonForVisit: booking.reason,
                status: 'SCHEDULED',
            } as any);
            setSuccessMsg('Appointment booked successfully');
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
        if (!confirm('Are you sure you want to cancel this appointment?')) return;
        try {
            await api.updateAppointment(id, { status: 'CANCELLED' } as any);
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
        } catch (err) {
            console.error('Cancel failed', err);
        }
    };

    const handlePayment = async (appt: Appointment) => {
        try {
            if (!profileId) return;
            
            const paymentRequest: PaymentRequestDto = {
                amount: 100,
                patientId: profileId,
                appointmentId: appt.id
            };
            
            const orderData = await api.createPaymentOrder(paymentRequest);
            
            // @ts-ignore - Razorpay is loaded via script tag
            const options = {
                key: orderData.razorpayKeyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "OPDHeal",
                description: "Appointment Payment",
                order_id: orderData.orderId,
                handler: function (response: any) {
                    alert("Payment processed successfully");
                },
                prefill: {
                    name: api.getUsername() || "Patient",
                },
                theme: {
                    color: "#0f766e",
                },
            };
            
            // @ts-ignore
            const rzp = new Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error('Payment failed', err);
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
            <div className="space-y-8">
                {/* Success Toast */}
                {successMsg && (
                    <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                        <CheckCircle size={20} />
                        <span className="font-medium">{successMsg}</span>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Appointments</h1>
                        <p className="text-gray-600 mt-1">Schedule, manage, and track your consultations</p>
                    </div>
                    <Button
                        onClick={() => setShowBookModal(true)}
                        className="bg-teal-600 hover:bg-teal-700 text-white h-11 px-5 rounded-lg"
                    >
                        <Plus size={18} className="mr-2" /> Book Appointment
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total', value: appointments.length, color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' },
                        { label: 'Upcoming', value: upcoming.length, color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200' },
                        { label: 'Completed', value: completed.length, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
                        { label: 'Cancelled', value: appointments.filter(a => a.status === 'CANCELLED').length, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.bg} border ${stat.border} rounded-lg p-4 text-center`}>
                            <p className={`text-3xl font-semibold ${stat.color}`}>{stat.value}</p>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            placeholder="Search by doctor, specialization, or reason..."
                            className="pl-12 h-11 bg-white border-gray-200 rounded-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {['ALL', 'SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-4 h-11 rounded-lg text-xs font-semibold transition-all border ${statusFilter === s
                                    ? 'bg-teal-600 text-white border-teal-600'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Appointments List */}
                {isLoading ? (
                    <div className="flex flex-col items-center py-20 gap-4">
                        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-400 font-medium">Loading appointments</p>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid gap-4">
                        {filtered.map((appt) => {
                            const dateObj = appt.appointmentDateTime ? new Date(appt.appointmentDateTime) : null;
                            const isActive = appt.status === 'SCHEDULED' || appt.status === 'CONFIRMED';
                            return (
                                <div
                                    key={appt.id}
                                    className="bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-teal-100 transition-all overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        {/* Date Block */}
                                        <div className="md:w-40 bg-gray-50 p-5 flex flex-col items-center justify-center border-r border-gray-200 text-center">
                                            <div className="text-xs font-semibold text-teal-700 uppercase tracking-widest mb-1">
                                                {dateObj ? dateObj.toLocaleDateString('en-US', { month: 'short' }) : '—'}
                                            </div>
                                            <div className="text-4xl font-bold text-gray-900 leading-none">
                                                {dateObj ? dateObj.getDate() : '—'}
                                            </div>
                                            <div className="text-xs font-medium text-gray-500 uppercase mt-1">
                                                {dateObj ? dateObj.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric' }) : ''}
                                            </div>
                                            <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-700 font-medium">
                                                <Clock size={14} /> {appt.appointmentDateTime ? appt.appointmentDateTime.split('T')[1]?.slice(0, 5) : '—'}
                                            </div>
                                        </div>

                                        {/* Main Content */}
                                        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-xl font-bold text-teal-700 border-2 border-white shadow-sm">
                                                    {appt.doctor?.user?.firstName?.charAt(0) || <User size={22} />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            Dr. {appt.doctor?.user?.firstName} {appt.doctor?.user?.lastName}
                                                        </h3>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full ${STATUS_COLORS[appt.status] || 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                                                            {appt.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-teal-700 font-medium mt-0.5">
                                                        {appt.doctor?.specialization}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {appt.reasonForVisit}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {isActive && (
                                                    <Button
                                                        className="bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 font-medium h-9"
                                                        size="sm"
                                                        onClick={() => handlePayment(appt)}
                                                    >
                                                        <CreditCard size={14} className="mr-2" /> Pay Now
                                                    </Button>
                                                )}
                                                {isActive && (
                                                    <Button
                                                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-medium h-9"
                                                        size="sm"
                                                    >
                                                        <Video size={14} className="mr-2" /> Join Call
                                                    </Button>
                                                )}
                                                {isActive && (
                                                    <button
                                                        onClick={() => handleCancel(appt.id)}
                                                        className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                                                        title="Cancel appointment"
                                                    >
                                                        <Trash2 size={14} />
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
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <Calendar size={40} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments found</h3>
                        <p className="text-gray-500 mb-8">
                            {searchTerm || statusFilter !== 'ALL'
                                ? 'Please adjust your search or filter criteria'
                                : 'You have not scheduled any appointments yet'}
                        </p>
                        <Button
                            onClick={() => setShowBookModal(true)}
                            className="bg-teal-600 hover:bg-teal-700 text-white"
                        >
                            Book Your First Appointment
                        </Button>
                    </div>
                )}
            </div>

            {/* Book Appointment Modal */}
            {showBookModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-teal-600 p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold">Book Appointment</h2>
                                    <p className="text-teal-100 text-sm mt-1">Schedule your consultation with our doctors</p>
                                </div>
                                <button
                                    onClick={() => setShowBookModal(false)}
                                    className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 space-y-4">
                            {/* Doctor Selection */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                                    Select Doctor *
                                </label>
                                <div className="relative">
                                    <Stethoscope size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <select
                                        value={booking.doctorId}
                                        onChange={(e) => setBooking(p => ({ ...p, doctorId: e.target.value }))}
                                        className="w-full h-11 pl-11 pr-4 rounded-lg border border-gray-200 bg-white text-gray-900 font-medium text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
                                    >
                                        <option value="">Choose a doctor</option>
                                        {doctors.map(d => (
                                            <option key={d.id} value={d.id}>
                                                Dr. {d.user?.firstName} {d.user?.lastName} — {d.specialization}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Date & Time Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                                        Date *
                                    </label>
                                    <Input
                                        type="date"
                                        value={booking.date}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setBooking(p => ({ ...p, date: e.target.value }))}
                                        className="h-11 border-gray-200 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                                        Time *
                                    </label>
                                    <Input
                                        type="time"
                                        value={booking.time}
                                        onChange={(e) => setBooking(p => ({ ...p, time: e.target.value }))}
                                        className="h-11 border-gray-200 rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                                    Reason for Visit *
                                </label>
                                <textarea
                                    value={booking.reason}
                                    onChange={(e) => setBooking(p => ({ ...p, reason: e.target.value }))}
                                    placeholder="Please provide a brief description of your symptoms or reason for appointment"
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 resize-none font-medium"
                                />
                            </div>

                            {/* Info Banner */}
                            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <AlertCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-blue-800 font-medium">
                                    All consultations are conducted via secure video call. You will receive a confirmation email with the meeting link.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 h-11 border-gray-200"
                                    onClick={() => setShowBookModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold"
                                    onClick={handleBook}
                                    disabled={isSubmitting || !booking.doctorId || !booking.date || !booking.time || !booking.reason}
                                >
                                    {isSubmitting ? (
                                        <RefreshCw size={16} className="animate-spin mr-2" />
                                    ) : (
                                        <Calendar size={16} className="mr-2" />
                                    )}
                                    {isSubmitting ? 'Booking' : 'Confirm Booking'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};
