import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    Search,
    Plus,
    Filter,
    Trash2,
    ExternalLink,
    Video,
    User
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import api from '../../services/api';
import { formatTime } from '../../utils/helpers';
import type { Appointment } from '../../types';

export const PatientAppointments: React.FC = () => {
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

    const filteredAppointments = appointments.filter(appt =>
        appt.doctor?.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.doctor?.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.doctor?.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="PATIENT">
            <div className="space-y-8 animate-fade-in font-inter">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">My Appointments</h1>
                        <p className="text-neutral-500 font-medium">View and manage your scheduled consultations.</p>
                    </div>
                    <Button className="bg-primary-600 text-white shadow-primary h-12 px-6">
                        <Plus size={20} className="mr-2" /> Book New Appointment
                    </Button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                        <Input
                            placeholder="Search by doctor or specialization..."
                            className="pl-12 h-12 bg-white border-neutral-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="h-12 border-neutral-200">
                        <Filter size={20} className="mr-2" /> All Logs
                    </Button>
                </div>

                {/* Appointments List */}
                <div className="grid gap-6">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredAppointments.length > 0 ? (
                        filteredAppointments.map((appt) => (
                            <Card key={appt.id} className="p-0 overflow-hidden border-neutral-100 hover:shadow-xl transition-all">
                                <div className="flex flex-col md:flex-row">
                                    {/* Date/Time Sidebar */}
                                    <div className="md:w-48 bg-neutral-50 p-6 flex flex-col items-center justify-center border-r border-neutral-100 text-center">
                                        <div className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-1">
                                            {new Date(appt.appointmentDate).toLocaleDateString('en-US', { month: 'short' })}
                                        </div>
                                        <div className="text-4xl font-black text-neutral-900 leading-none mb-1">
                                            {new Date(appt.appointmentDate).getDate()}
                                        </div>
                                        <div className="text-sm font-bold text-neutral-500 uppercase">
                                            {new Date(appt.appointmentDate).toLocaleDateString('en-US', { weekday: 'short' })}
                                        </div>
                                        <div className="mt-4 flex items-center gap-1.5 text-neutral-900 font-black">
                                            <Clock size={16} /> {formatTime(appt.appointmentTime)}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 border-2 border-white shadow-sm overflow-hidden">
                                                {appt.doctor?.user?.firstName?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-xl font-extrabold text-neutral-900">Dr. {appt.doctor?.user?.firstName} {appt.doctor?.user?.lastName}</h3>
                                                    <Badge variant="auto" status={appt.status} className="uppercase font-black text-[10px] tracking-widest" >{appt.status}</Badge>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm font-semibold text-neutral-500">
                                                    <span className="text-primary-600 underline underline-offset-4">{appt.doctor?.specialization}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1.5"><User size={14} /> Video Consultation</span>
                                                </div>
                                                <p className="mt-3 text-neutral-400 text-sm max-w-md line-clamp-1 italic">
                                                    "Reason: {appt.reasonForVisit}"
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {appt.status === 'SCHEDULED' && (
                                                <Button className="bg-primary-50 text-primary-600 hover:bg-primary-100 border-none font-bold shadow-none">
                                                    <Video size={18} className="mr-2" /> Join Call
                                                </Button>
                                            )}
                                            <Button variant="outline" size="sm" className="h-10 w-10 p-0 border-neutral-200 rounded-xl hover:bg-neutral-50">
                                                <ExternalLink size={18} />
                                            </Button>
                                            <Button variant="outline" size="sm" className="h-10 w-10 p-0 border-neutral-200 rounded-xl hover:bg-error-50 hover:text-error-600 hover:border-error-200">
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-24 bg-white rounded-[32px] border border-dashed border-neutral-300">
                            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-300">
                                <Calendar size={48} />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-900 mb-2">No appointments found</h3>
                            <p className="text-neutral-500 mb-8 max-w-sm mx-auto font-medium">You don't have any appointments matching your search. Schedule your next visit today!</p>
                            <Button className="bg-primary-600 text-white shadow-primary">Schedule Appointment</Button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};
