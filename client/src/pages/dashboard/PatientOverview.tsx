import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    Pill,
    CreditCard,
    ArrowUpRight,
    Video,
    Plus,
    ArrowRight,
    Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import { formatDate, formatTime } from '../../utils/helpers';
import type { Appointment, Patient } from '../../types';

export const PatientOverview: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [nextAppt, setNextAppt] = useState<Appointment | null>(null);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [stats, setStats] = useState<any>(null);
    const username = api.getUsername();
    const profileId = api.getProfileId();

    useEffect(() => {
        const loadData = async () => {
            try {
                let apptsData: Appointment[] = [];
                if (profileId) {
                    const [appts, patientData, patientStats] = await Promise.all([
                        api.getAppointmentsByPatient(profileId),
                        api.getPatientById(profileId),
                        api.getPatientDashboardStats(profileId)
                    ]);
                    apptsData = appts;
                    setPatient(patientData);
                    setStats(patientStats);
                } else {
                    apptsData = await api.getAllAppointments();
                }

                // Sort by appointmentDateTime ascending
                const futureAppts = apptsData.filter(a => {
                    const dt = a.appointmentDateTime ? new Date(a.appointmentDateTime) : null;
                    return dt ? dt >= new Date(new Date().setHours(0, 0, 0, 0)) : false;
                }).sort((a, b) => {
                    const dateA = a.appointmentDateTime ? new Date(a.appointmentDateTime).getTime() : 0;
                    const dateB = b.appointmentDateTime ? new Date(b.appointmentDateTime).getTime() : 0;
                    return dateA - dateB;
                });

                setAppointments(futureAppts.slice(0, 3));
                setNextAppt(futureAppts[0] || null);
            } catch (error) {
                console.error("Failed to load patient dashboard", error);
            }
        };
        loadData();
    }, [profileId]);

    const statCards = [
        { label: 'Next Clinical Visit', value: nextAppt ? formatDate(nextAppt.appointmentDateTime?.split('T')[0] || '') : 'None', subValue: nextAppt?.doctorName || 'No upcoming', icon: <Calendar className="text-teal-600" />, color: 'bg-teal-50' },
        { label: 'Prescriptions', value: stats?.totalPrescriptions?.toString() || '0', subValue: 'Prescriptions issued', icon: <Pill className="text-emerald-600" />, color: 'bg-emerald-50' },
        { label: 'Total Appointments', value: stats?.totalAppointments?.toString() || '0', subValue: 'All time', icon: <Activity className="text-amber-500" />, color: 'bg-amber-50' },
        { label: 'Outstanding Balance', value: '₹ 0', subValue: 'No pending payments', icon: <CreditCard className="text-teal-600" />, color: 'bg-teal-50' },
    ];

    return (
        <DashboardLayout role="PATIENT">
            <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Welcome, <span className="text-teal-600">{username}</span>
                        </h1>
                        <p className="text-base text-slate-600 font-medium mt-1">Manage your health records and upcoming clinical appointments.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/patient/records">
                            <Button className="bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-sm font-semibold">
                                Medical Records
                            </Button>
                        </Link>
                        <Link to="/patient/doctors">
                            <Button className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm font-semibold">
                                <Plus size={18} className="mr-2" /> Schedule Visit
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, i) => (
                        <Card key={i} className="shadow-sm border-slate-200">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-slate-900 leading-none">{stat.value}</h3>
                                    <p className="text-sm font-medium text-slate-500">{stat.subValue}</p>
                                </div>
                                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Upcoming Appointments</h2>
                            <Link to="/patient/appointments" className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">View all <ArrowUpRight size={16} /></Link>
                        </div>
                        {appointments.length > 0 ? (
                            appointments.map((appt: Appointment) => (
                                <Card key={appt.id} className="p-0 overflow-hidden shadow-sm border border-slate-200">
                                    <div className="flex">
                                        <div className="w-1.5 bg-teal-600"></div>
                                        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-100 font-bold text-teal-600">
                                                    {appt.doctorName?.charAt(0) || 'D'}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900">{appt.doctorName}</h4>
                                                    <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                                                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">{appt.doctorSpecialization}</span>
                                                        <span className="flex items-center gap-1"><Clock size={14} /> {appt.appointmentDateTime ? formatTime(appt.appointmentDateTime.split('T')[1]?.slice(0, 5) ?? '') : '—'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right hidden sm:block">
                                                    <div className="text-sm font-semibold text-slate-900">{appt.appointmentDateTime ? formatDate(appt.appointmentDateTime.split('T')[0]) : '—'}</div>
                                                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">{appt.status}</div>
                                                </div>
                                                <Button size="sm" className="bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 font-semibold shadow-none">
                                                    <Video size={16} className="mr-2" /> Join Telehealth
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300 shadow-sm">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-400">
                                    <Calendar size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">No Consultations Scheduled</h3>
                                <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto font-normal">You currently have no upcoming appointments. Schedule a visit to consult with a provider.</p>
                                <Link to="/patient/doctors">
                                    <Button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-sm">Browse Providers</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
