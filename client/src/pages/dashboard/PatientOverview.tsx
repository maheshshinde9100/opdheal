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
import { Badge } from '../../components/Badge';
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
            label: 'Next Appointment',
            value: nextAppt ? formatDate(nextAppt.appointmentDateTime?.split('T')[0] || '') : 'None',
            subValue: nextAppt?.doctorName || 'No upcoming',
            icon: <Calendar className="text-primary-600" />, color: 'bg-primary-50'
        },
        { label: 'Pending Bills', value: '₹ 0', subValue: 'No pending payments', icon: <CreditCard className="text-error-600" />, color: 'bg-error-50' },
        { label: 'Consultations', value: appointments.length.toString(), subValue: 'Active schedule', icon: <Pill className="text-success-600" />, color: 'bg-success-50' },
        { label: 'Health Score', value: '100%', subValue: 'Excellent condition', icon: <Activity className="text-warning-600" />, color: 'bg-warning-50' },
    ];

    return (
        <DashboardLayout role="PATIENT">
            <div className="space-y-10 animate-fade-in">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">
                            Hello, <span className="text-primary-600">{username}</span>!
                        </h1>
                        <p className="text-lg text-neutral-500 font-medium">Your health journey is looking great today.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/patient/records">
                            <Button className="bg-white text-neutral-900 border-2 border-neutral-200 hover:bg-neutral-50">
                                View Records
                            </Button>
                        </Link>
                        <Link to="/patient/doctors">
                            <Button className="bg-primary-600 text-white shadow-primary">
                                <Plus size={20} className="mr-2" /> Book Appointment
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, i) => (
                        <Card key={i} className="hover:border-primary-200 transition-all group overflow-hidden relative">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider">{stat.label}</p>
                                    <h3 className="text-2xl font-extrabold text-neutral-900">{stat.value}</h3>
                                    <p className="text-sm font-semibold text-neutral-500 flex items-center gap-1">
                                        {stat.subValue}
                                    </p>
                                </div>
                                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 h-1 bg-primary-500 w-0 group-hover:w-full transition-all duration-300"></div>
                        </Card>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Recent Activities/Appointments */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-neutral-900">Upcoming Consultations</h2>
                            <Button variant="outline" size="sm" className="font-bold">See Schedule</Button>
                        </div>

                        <div className="space-y-4">
                            {appointments.length > 0 ? (
                                appointments.map((appt: Appointment) => (
                                    <Card key={appt.id} className="p-0 overflow-hidden hover:shadow-xl transition-all border-neutral-200">
                                        <div className="flex">
                                            <div className="w-2 bg-primary-600"></div>
                                            <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm font-black text-neutral-400">
                                                        {appt.doctorName?.charAt(0) || 'D'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-lg text-neutral-900">{appt.doctorName}</h4>
                                                        <div className="flex items-center gap-2 text-neutral-500 font-semibold text-sm">
                                                            <Badge variant="primary" className="text-[10px]">{appt.doctorSpecialization}</Badge>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1"><Clock size={14} /> {appt.appointmentDateTime ? formatTime(appt.appointmentDateTime.split('T')[1]?.slice(0, 5) ?? '') : '—'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right hidden sm:block">
                                                        <div className="text-sm font-bold text-neutral-900">{appt.appointmentDateTime ? formatDate(appt.appointmentDateTime.split('T')[0]) : '—'}</div>
                                                        <div className="text-xs font-semibold text-neutral-400 capitalize">{appt.status.toLowerCase()}</div>
                                                    </div>
                                                    <Button size="sm" className="bg-primary-50 text-primary-600 hover:bg-primary-100 border-none font-bold">
                                                        <Video size={16} className="mr-2" /> Join Call
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-neutral-300">
                                    <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-400">
                                        <Calendar size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-neutral-900 mb-2">No Appointments scheduled</h3>
                                    <p className="text-neutral-500 mb-8 max-w-xs mx-auto font-medium">Schedule your first appointment with our expert doctors today.</p>
                                    <Button className="bg-primary-600 text-white shadow-primary">Find a Doctor</Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar widgets */}
                    <div className="space-y-8">
                        {/* Health Summary Card */}
                        <Card className="bg-gradient-to-br from-indigo-900 to-primary-800 text-white p-8 rounded-[32px] overflow-hidden relative border-none">
                            <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4">
                                <Activity size={150} strokeWidth={1} />
                            </div>
                            <h3 className="text-2xl font-bold mb-6">Medical History</h3>
                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                    <div>
                                        <div className="text-white/60 text-sm font-bold uppercase tracking-wider mb-1">Blood Type</div>
                                        <div className="text-3xl font-extrabold font-poppins">{patient?.bloodGroup || '—'}</div>
                                    </div>
                                    <div className="text-primary-300"><ArrowUpRight size={32} /></div>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                    <div>
                                        <div className="text-white/60 text-sm font-bold uppercase tracking-wider mb-1">Weight</div>
                                        <div className="text-3xl font-extrabold font-poppins">{patient?.weight || '—'} <span className="text-lg font-bold opacity-60">kg</span></div>
                                    </div>
                                    <div className="text-success-400"><ArrowUpRight size={32} /></div>
                                </div>
                            </div>
                            <Button className="w-full mt-8 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold h-12 rounded-2xl transition-all">
                                Update Vitals
                            </Button>
                        </Card>

                        {/* Prescriptions Widget */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-xl font-bold text-neutral-900">Current Medications</h3>
                                <Link to="/patient/prescriptions" className="text-sm font-bold text-primary-600 hover:text-primary-700">View All</Link>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { name: 'Amoxicillin', dose: '500mg, 3x Day', color: 'bg-emerald-500' },
                                    { name: 'Lisinopril', dose: '10mg, 1x Day', color: 'bg-blue-500' }
                                ].map((med, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className={`w-3 h-10 ${med.color} rounded-full`}></div>
                                        <div className="flex-1">
                                            <div className="font-bold text-neutral-900">{med.name}</div>
                                            <div className="text-xs font-semibold text-neutral-400">{med.dose}</div>
                                        </div>
                                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-lg">
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
