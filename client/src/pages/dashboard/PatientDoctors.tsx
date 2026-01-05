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

export const PatientDoctors: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

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

    const handleConfirmBooking = async () => {
        if (!selectedDoctor) return;

        try {
            await api.createAppointment({
                doctorId: selectedDoctor.id,
                appointmentDate: bookingData.date,
                appointmentTime: `${bookingData.date}T${bookingData.time}:00`,
                reasonForVisit: bookingData.reason,
                status: 'SCHEDULED'
            });
            setIsBookingModalOpen(false);
            // Show success - maybe redirect to appointments
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
                        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Expert Specialists</h1>
                        <p className="text-neutral-500 font-medium italic">Find and book appointments with top-rated medical professionals.</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-2 rounded-[24px] shadow-soft border border-neutral-100 flex flex-col md:flex-row gap-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search by specialty, doctor name..."
                            className="w-full pl-12 h-14 bg-transparent border-none focus:ring-0 text-lg font-medium text-neutral-900 placeholder:text-neutral-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 p-2">
                        <Button variant="outline" className="border-neutral-100 h-full px-6 rounded-2xl">
                            <Filter size={20} className="mr-2" /> Filters
                        </Button>
                        <Button className="bg-primary-600 text-white shadow-primary h-full px-8 rounded-2xl">
                            Find Now
                        </Button>
                    </div>
                </div>

                {/* Doctors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        [1, 2, 3].map(i => <div key={i} className="h-80 bg-neutral-100 rounded-[32px] animate-pulse"></div>)
                    ) : filteredDoctors.length > 0 ? (
                        filteredDoctors.map((doctor) => (
                            <Card key={doctor.id} className="p-0 overflow-hidden border-neutral-100 hover:shadow-2xl transition-all group rounded-[32px]">
                                {/* Doctor Card Header */}
                                <div className="h-32 bg-gradient-to-br from-primary-500 via-primary-600 to-indigo-700 p-6 relative">
                                    <div className="absolute -bottom-10 right-6 w-24 h-24 rounded-3xl bg-white p-1 shadow-xl">
                                        <div className="w-full h-full rounded-2xl bg-neutral-100 flex items-center justify-center text-primary-600 font-black text-3xl">
                                            {doctor.user?.firstName?.charAt(0)}
                                        </div>
                                    </div>
                                    <Badge className="bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold uppercase tracking-widest text-[10px]">
                                        {doctor.available ? 'Available' : 'Busy Today'}
                                    </Badge>
                                </div>

                                {/* Doctor Info */}
                                <div className="p-8 pt-12 space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-black text-neutral-900 group-hover:text-primary-600 transition-colors leading-tight">
                                            Dr. {doctor.user?.firstName} {doctor.user?.lastName}
                                        </h3>
                                        <p className="text-primary-600 font-bold text-sm uppercase tracking-wider mt-1">{doctor.specialization}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 items-center">
                                        <div className="flex items-center gap-2 text-neutral-500 font-bold text-sm">
                                            <Star className="text-warning-500 fill-warning-500" size={16} />
                                            <span>4.9 (120+)</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-neutral-500 font-bold text-sm">
                                            <Clock className="text-primary-400" size={16} />
                                            <span>{doctor.experience}Y Exp.</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-neutral-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-neutral-400 text-xs font-bold uppercase">Consultation Fee</span>
                                            <span className="text-neutral-900 font-black text-xl">${doctor.consultationFee}</span>
                                        </div>
                                        <Button
                                            onClick={() => handleBookClick(doctor)}
                                            className="w-full bg-neutral-900 hover:bg-primary-600 text-white rounded-2xl h-14 font-bold transition-all shadow-lg active:scale-95"
                                        >
                                            Book Appointment <ChevronRight size={18} className="ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-neutral-500 font-bold">No doctors found matching your criteria.</p>
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
                    <div className="bg-primary-50 p-4 rounded-2xl flex items-center gap-4 border border-primary-100">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
                            <Stethoscope size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-primary-600 uppercase tracking-widest">Selected Specialist</p>
                            <p className="text-neutral-900 font-black">Dr. {selectedDoctor?.user?.firstName} {selectedDoctor?.user?.lastName}</p>
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

                    <div className="pt-4 border-t border-neutral-100 flex gap-4">
                        <Button variant="outline" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setIsBookingModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="flex-1 bg-primary-600 text-white rounded-2xl h-14 font-bold shadow-primary" onClick={handleConfirmBooking}>
                            Confirm Booking
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 justify-center text-xs font-bold text-success-600">
                        <CheckCircle2 size={14} /> Instant confirmation upon booking
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
};
