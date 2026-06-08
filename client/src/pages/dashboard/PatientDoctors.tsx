import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Star,
    Clock,
    MapPin,
    Activity,
    ChevronRight,
    PlusCircle,
    CheckCircle2,
    Calendar,
    Stethoscope
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';
import api from '../../services/api';
import type { Doctor } from '../../types';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export const PatientDoctors: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

    // Booking Form State
    const [bookingData, setBookingData] = useState({
        date: '',
        time: '',
        reason: ''
    });

    useEffect(() => {
        loadDoctors();
    }, []);

    const loadDoctors = async () => {
        try {
            const data = await api.getAllDoctors();
            setDoctors(data);
        } catch (error) {
            console.error("Failed to load doctors", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBookClick = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setIsBookingModalOpen(true);
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!selectedDoctor) return;
        setIsPaymentProcessing(true);

        try {
            const res = await loadRazorpayScript();
            if (!res) {
                alert("Failed to load payment gateway. Please try again.");
                return;
            }

            const patientId = api.getProfileId();
            const paymentRequest = {
                patientId: patientId || '',
                amount: selectedDoctor.consultationFee || 500,
                currency: 'INR'
            };

            const orderData = await api.createPaymentOrder(paymentRequest);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'OPDHeal',
                description: 'Appointment Booking Charge',
                order_id: orderData.id,
                handler: async function (response: any) {
                    await handleConfirmBooking();
                },
                prefill: {
                    name: selectedDoctor.user?.firstName + " " + selectedDoctor.user?.lastName,
                    email: selectedDoctor.user?.email,
                    contact: selectedDoctor.phoneNumber
                },
                theme: {
                    color: '#0d9488' // Teal color
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment failed", error);
            alert("Payment failed. Please try again.");
        } finally {
            setIsPaymentProcessing(false);
        }
    };

    const handleConfirmBooking = async () => {
        if (!selectedDoctor) return;

        try {
            const patientId = api.getProfileId();
            await api.createAppointment({
                patientId: patientId || '',
                doctorId: selectedDoctor.id,
                appointmentDateTime: `${bookingData.date}T${bookingData.time}:00`,
                reasonForVisit: bookingData.reason,
                status: 'SCHEDULED'
            });
            setIsBookingModalOpen(false);
            alert("Appointment booked successfully!");
        } catch (error) {
            console.error("Booking failed", error);
            alert("Failed to book appointment. Please try again.");
        }
    };

    const filteredDoctors = doctors.filter(doc =>
        doc.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="PATIENT">
            <div className="space-y-8 animate-fade-in font-inter">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Expert Specialists</h1>
                        <p className="text-slate-500 font-medium mt-1">Find and book appointments with top-rated medical professionals.</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500" size={20} />
                        <Input
                            placeholder="Search by specialty, doctor name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-14"
                        />
                    </div>
                    <div className="flex gap-2 p-2">
                        <Button variant="outline" className="border-slate-200 h-full px-6 rounded-xl">
                            <Filter size={20} className="mr-2" /> Filters
                        </Button>
                    </div>
                </div>

                {/* Doctors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        [1, 2, 3].map(i => <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>)
                    ) : filteredDoctors.length > 0 ? (
                        filteredDoctors.map((doctor) => (
                            <Card key={doctor.id} className="p-0 overflow-hidden border-slate-200 hover:shadow-xl transition-all group rounded-2xl">
                                {/* Doctor Card Header */}
                                <div className="h-32 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 p-6 relative">
                                    <div className="absolute -bottom-10 right-6 w-24 h-24 rounded-2xl bg-white p-1 shadow-xl">
                                        <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center text-teal-700 font-bold text-3xl">
                                            {doctor.user?.firstName?.charAt(0) || 'D'}
                                        </div>
                                    </div>
                                    <Badge className="bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold uppercase tracking-widest text-[10px]">
                                        {doctor.available ? 'Available' : 'Busy Today'}
                                    </Badge>
                                </div>

                                {/* Doctor Info */}
                                <div className="p-8 pt-12 space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors leading-tight">
                                            Dr. {doctor.user?.firstName} {doctor.user?.lastName}
                                        </h3>
                                        <p className="text-teal-700 font-semibold text-sm uppercase tracking-wider mt-1">{doctor.specialization}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 items-center">
                                        <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
                                            <Star className="text-amber-500 fill-amber-500" size={16} />
                                            <span>{doctor.averageRating.toFixed(1)} ({doctor.ratingCount}+)</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
                                            <Clock className="text-teal-500" size={16} />
                                            <span>{doctor.experienceYears}Y Exp.</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-slate-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-500 text-xs font-semibold uppercase">Consultation Fee</span>
                                            <span className="text-slate-900 font-black text-xl">₹{doctor.consultationFee}</span>
                                        </div>
                                        <Button
                                            onClick={() => handleBookClick(doctor)}
                                            className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-14 font-bold transition-all shadow-md"
                                        >
                                            Book Appointment <ChevronRight size={18} className="ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-slate-500 font-semibold">No doctors found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Booking Modal */}
            <Modal
                title={`Book Appointment with Dr. ${selectedDoctor?.user?.firstName}`}
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
            >
                <div className="space-y-6">
                    <div className="bg-teal-50 p-4 rounded-2xl flex items-center gap-4 border border-teal-100">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-teal-600 shadow-sm">
                            <Stethoscope size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest">Selected Specialist</p>
                            <p className="text-slate-900 font-bold">Dr. {selectedDoctor?.user?.firstName} {selectedDoctor?.user?.lastName}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Select Date"
                            type="date"
                            value={bookingData.date}
                            onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        />
                        <Input
                            label="Select Time"
                            type="time"
                            value={bookingData.time}
                            onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                        />
                    </div>

                    <Input
                        label="Reason for Visit"
                        placeholder="Describe your symptoms or reason for consulting..."
                        value={bookingData.reason}
                        onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                    />

                    <div className="pt-4 border-t border-slate-100 flex gap-4">
                        <Button variant="outline" className="flex-1 h-14 rounded-xl font-semibold" onClick={() => setIsBookingModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-teal-600 text-white rounded-xl h-14 font-bold shadow-md"
                            onClick={handlePayment}
                            isLoading={isPaymentProcessing}
                        >
                            Pay ₹{selectedDoctor?.consultationFee || 500} & Confirm Booking
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 justify-center text-xs font-semibold text-emerald-600">
                        <CheckCircle2 size={14} /> Instant confirmation upon booking
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
};
