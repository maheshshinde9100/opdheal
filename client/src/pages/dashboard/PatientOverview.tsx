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
    const username = api.getUsername();
    const profileId = api.getProfileId();

    useEffect(() => {
        const loadData = async () => {
            try {
                let apptsData: Appointment[] = [];
                if (profileId) {
                    const [appts, patientData] = await Promise.all([
                        api.getAppointmentsByPatient(profileId),
                        api.getPatientById(profileId)
                    ]);
                    apptsData = appts;
                    setPatient(patientData);
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

                setAppointments(futureAppts.slice(0, 5));
                if (futureAppts.length > 0) {
                    setNextAppt(futureAppts[0]);
                }
            } catch (error) {
                console.error("Failed to load patient dashboard", error);
            }
        };
        loadData();
    }, [profileId]);

    const statCards = [
        {
            label: 'Next Clinical Visit',
            value: nextAppt ? formatDate(nextAppt.appointmentDateTime?.split('T')[0] || '') : 'None',
            subValue: nextAppt?.doctorName || 'No upcoming',
            icon: <Calendar className="text-blue-600" />, color: 'bg-blue-50'
        },
        { label: 'Pending Invoices', value: '₹ 0', subValue: 'No pending payments', icon: <CreditCard className="text-rose-600" />, color: 'bg-rose-50' },
        { label: 'Active Consultations', value: appointments.length.toString(), subValue: 'Current schedule', icon: <Pill className="text-emerald-600" />, color: 'bg-emerald-50' },
        { label: 'Overall Status', value: 'Stable', subValue: 'No critical alerts', icon: <Activity className="text-amber-500" />, color: 'bg-amber-50' },
    ];

    return (
        <DashboardLayout role="PATIENT">
            <div className="space-y-10 animate-fade-in">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Welcome, <span className="text-blue-600">{username}</span>
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
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-semibold">
                                <Plus size={18} className="mr-2" /> Schedule Visit
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, i) => (
                        <Card key={i} className="shadow-sm border-slate-200">
                            <div className="flex items-start justify-between mb-3">
                                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                <p className="text-xs font-medium text-slate-400">{stat.subValue}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Recent Activities/Appointments */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Upcoming Consultations</h2>
                            <Button variant="outline" size="sm" className="font-semibold text-slate-600 border-slate-300">View Schedule</Button>
                        </div>

                        <div className="space-y-4">
                            {appointments.length > 0 ? (
                                appointments.map((appt: Appointment) => (
                                    <Card key={appt.id} className="p-0 overflow-hidden shadow-sm border border-slate-200">
                                        <div className="flex">
                                            <div className="w-1.5 bg-blue-600"></div>
                                            <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 font-bold text-blue-600">
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
                                                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-0.5">{appt.status}</div>
                                                    </div>
                                                    <Button size="sm" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-semibold shadow-none">
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
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">Browse Providers</Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar widgets */}
                    <div className="space-y-6">
                        {/* Health Summary Card */}
                        <Card className="bg-slate-900 text-white p-6 rounded-xl overflow-hidden relative border border-slate-800 shadow-md">
                            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2">
                                <Activity size={100} strokeWidth={1} />
                            </div>
                            <h3 className="text-lg font-bold mb-6 text-slate-100">Patient Vitals</h3>
                            <div className="space-y-5 relative z-10">
                                <div className="flex justify-between items-end border-b border-slate-700 pb-3">
                                    <div>
                                        <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Blood Type</div>
                                        <div className="text-2xl font-bold text-slate-100">{patient?.bloodGroup || '—'}</div>
                                    </div>
                                    <div className="text-blue-400"><ArrowUpRight size={24} /></div>
                                </div>
                                <div className="flex justify-between items-end border-b border-slate-700 pb-3">
                                    <div>
                                        <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Weight</div>
                                        <div className="text-2xl font-bold text-slate-100">{patient?.weight || '—'} <span className="text-sm font-normal text-slate-400">kg</span></div>
                                    </div>
                                    <div className="text-emerald-400"><ArrowUpRight size={24} /></div>
                                </div>
                            </div>
                            <Button className="w-full mt-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold h-10 transition-all shadow-none">
                                Update Metrics
                            </Button>
                        </Card>

                        {/* Prescriptions Widget */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-lg font-bold text-slate-900">Current Medications</h3>
                                <Link to="/patient/prescriptions" className="text-xs font-semibold text-blue-600 hover:text-blue-700">View History</Link>
                            </div>
                            <div className="space-y-2">
                                {[
                                    { name: 'Amoxicillin', dose: '500mg, 3x Day', color: 'bg-slate-600' },
                                    { name: 'Lisinopril', dose: '10mg, 1x Day', color: 'bg-blue-600' }
                                ].map((med, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                        <div className={`w-1.5 h-8 ${med.color} rounded-full`}></div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-slate-900 text-sm">{med.name}</div>
                                            <div className="text-xs text-slate-500">{med.dose}</div>
                                        </div>
                                        <Button size="sm" variant="outline" className="h-7 w-7 p-0 rounded border-slate-200 text-slate-600 shadow-none">
                                            <ArrowRight size={14} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
