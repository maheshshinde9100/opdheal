import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Phone, Video, CheckCircle2, XCircle, Clock3 } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import api from '../../services/api';
import { formatDate, formatTime } from '../../utils/helpers';
import type { Appointment } from '../../types';

export const DoctorSchedule: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
    const profileId = api.getProfileId();

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        setIsLoading(true);
        try {
            const data = profileId ? await api.getDoctorAppointments(profileId) : await api.getAllAppointments();
            setAppointments(data);
        } catch (error) {
            console.error('Failed to load appointments', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (appointmentId: string, newStatus: Appointment['status']) => {
        setStatusUpdating(appointmentId);
        try {
            let updated;
            switch (newStatus) {
                case 'CONFIRMED':
                    updated = await api.markAppointmentConfirmed(appointmentId);
                    break;
                case 'IN_PROGRESS':
                    updated = await api.markAppointmentInProgress(appointmentId);
                    break;
                case 'COMPLETED':
                    updated = await api.markAppointmentComplete(appointmentId);
                    break;
                case 'CANCELLED':
                    updated = await api.markAppointmentCancelled(appointmentId);
                    break;
                case 'NO_SHOW':
                    updated = await api.markAppointmentNoShow(appointmentId);
                    break;
                default:
                    return;
            }
            setAppointments(appointments.map(apt => apt.id === appointmentId ? updated : apt));
        } catch (error) {
            console.error('Failed to update status', error);
        } finally {
            setStatusUpdating(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'SCHEDULED': return <Badge className="bg-slate-100 text-slate-700 border border-slate-200">Scheduled</Badge>;
            case 'CONFIRMED': return <Badge className="bg-teal-100 text-teal-700 border border-teal-200">Confirmed</Badge>;
            case 'IN_PROGRESS': return <Badge className="bg-amber-100 text-amber-700 border border-amber-200">In Progress</Badge>;
            case 'COMPLETED': return <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">Completed</Badge>;
            case 'CANCELLED': return <Badge className="bg-red-100 text-red-700 border border-red-200">Cancelled</Badge>;
            case 'NO_SHOW': return <Badge className="bg-slate-100 text-slate-700 border border-slate-200">No Show</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    const getStatusActions = (appointment: Appointment) => {
        const { status, id } = appointment;
        const isLoading = statusUpdating === id;

        switch (status) {
            case 'SCHEDULED':
                return (
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="border-slate-200 text-slate-700" onClick={() => handleStatusChange(id, 'CANCELLED')} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button size="sm" className="bg-teal-600 text-white" onClick={() => handleStatusChange(id, 'CONFIRMED')} disabled={isLoading}>
                            Confirm
                        </Button>
                    </div>
                );
            case 'CONFIRMED':
                return (
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="border-slate-200 text-slate-700" onClick={() => handleStatusChange(id, 'CANCELLED')} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button size="sm" className="bg-teal-600 text-white" onClick={() => handleStatusChange(id, 'IN_PROGRESS')} disabled={isLoading}>
                            Start
                        </Button>
                    </div>
                );
            case 'IN_PROGRESS':
                return (
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="border-slate-200 text-slate-700" onClick={() => handleStatusChange(id, 'CANCELLED')} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button size="sm" className="bg-teal-600 text-white" onClick={() => handleStatusChange(id, 'COMPLETED')} disabled={isLoading}>
                            Complete
                        </Button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <DashboardLayout role="DOCTOR">
            <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Schedule</h1>
                        <p className="text-slate-500 font-medium mt-1">Manage your appointments for the day.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center py-20 gap-4">
                            <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-slate-400 font-medium">Loading your schedule...</p>
                        </div>
                    ) : appointments.length > 0 ? (
                        appointments.map(appointment => (
                            <Card key={appointment.id} className="border-slate-200">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                                            {appointment.appointmentDateTime ? <Calendar size={24} /> : <Clock size={24} />}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-semibold text-slate-900">{appointment.patientName}</h3>
                                                {getStatusBadge(appointment.status)}
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium">
                                                <span className="inline-flex items-center gap-1">
                                                    <Clock3 size={14} />{formatDate(appointment.appointmentDateTime?.split('T')[0])}
                                                </span>
                                                {' '}
                                                <span className="inline-flex items-center gap-1">
                                                    <Clock size={14} />{formatTime(appointment.appointmentDateTime?.split('T')[1]?.slice(0,5))}
                                                </span>
                                            </p>
                                            <p className="text-sm text-slate-500">{appointment.reasonForVisit || 'General Consultation'}</p>
                                        </div>
                                    </div>
                                    {getStatusActions(appointment)}
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Appointments</h3>
                            <p className="text-slate-400 font-medium">You have no upcoming appointments.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};
