import React, { useEffect, useState } from 'react';
import {
    Calendar,
    Users,
    ArrowRight,
    Video,
    TrendingUp,
    Star,
    AlertCircle
} from 'lucide-react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import { formatTime } from '../../utils/helpers';
import type { Appointment } from '../../types';

export const DoctorOverview: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [todayCount, setTodayCount] = useState<number>(0);
    const username = api.getUsername();
    const profileId = api.getProfileId();

    useEffect(() => {
        const loadData = async () => {
            try {
                if (profileId) {
                    const allAppts = await api.getDoctorAppointments(profileId);
                    setAppointments(allAppts.slice(0, 5));

                    const todayDateString = new Date().toISOString().split('T')[0];
                    const count = allAppts.filter(a => a.appointmentDate?.startsWith(todayDateString)).length;
                    setTodayCount(count);
                } else {
                    const allAppts = await api.getAllAppointments();
                    setAppointments(allAppts.slice(0, 5));
                }
            } catch (error) {
                console.error("Failed to load doctor dashboard", error);
            }
        };
        loadData();
    }, [profileId]);

    const statCards = [
        { label: 'Today Appointments', value: todayCount.toString(), subValue: 'Pending completion', icon: <Calendar className="text-primary-600" />, color: 'bg-primary-50', trend: 'Active' },
        { label: 'New Patients', value: '5', subValue: 'Since yesterday', icon: <Users className="text-success-600" />, color: 'bg-success-50', trend: '+10%' },
        { label: 'Patient Satisfaction', value: '4.9', subValue: 'Out of 5 stars', icon: <Star className="text-warning-600" />, color: 'bg-warning-50', trend: 'High' },
        { label: 'Pending Reports', value: '8', subValue: 'Requires review', icon: <AlertCircle className="text-error-600" />, color: 'bg-error-50', trend: 'Action' },
    ];

    return (
        <DashboardLayout role="DOCTOR">
            <div className="space-y-10 animate-fade-in">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight">
                            Good Morning, <span className="text-primary-600">Dr. {username}</span>
                        </h1>
                        <p className="text-lg text-neutral-500 font-medium">You have {todayCount} appointments scheduled for today.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button className="bg-white text-neutral-900 border-2 border-neutral-200">
                            Manage Schedule
                        </Button>
                        <Button className="bg-primary-600 text-white shadow-primary">
                            Upcoming Patient <ArrowRight size={20} className="ml-2" />
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, i) => (
                        <Card key={i} className="hover:shadow-xl transition-all group border-neutral-100">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                                    {stat.icon}
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.includes('+') ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-600'
                                    }`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-3xl font-black text-neutral-900">{stat.value}</h3>
                                <p className="text-sm font-semibold text-neutral-500">{stat.subValue}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Appointments Table */}
                    <div className="lg:col-span-2">
                        <Card className="p-0 overflow-hidden border-neutral-200">
                            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-neutral-900">Today's Appointments</h2>
                                <Button variant="outline" size="sm" className="font-bold">Full Schedule</Button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-neutral-50 border-b border-neutral-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Patient</th>
                                            <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Time</th>
                                            <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Type</th>
                                            <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {appointments.map((appt: Appointment) => (
                                            <tr key={appt.id} className="hover:bg-neutral-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">
                                                            {appt.patient?.user?.firstName?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-neutral-900">{appt.patient?.user?.firstName} {appt.patient?.user?.lastName}</div>
                                                            <div className="text-xs font-semibold text-neutral-400">ID: {appt.patient?.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-neutral-900">{formatTime(appt.appointmentTime)}</div>
                                                    <div className="text-xs font-semibold text-neutral-400">30 min session</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="primary" className="bg-primary-50 text-primary-700 border-none font-bold">Video Call</Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-success-500"></div>
                                                        <span className="text-sm font-bold text-neutral-700 capitalize">{appt.status.toLowerCase()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Button size="sm" className="h-9 w-9 p-0 bg-primary-50 text-primary-600 hover:bg-primary-100 border-none">
                                                            <Video size={16} />
                                                        </Button>
                                                        <Button size="sm" className="h-9 w-9 p-0 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border-none">
                                                            <ArrowRight size={16} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar widgets */}
                    <div className="space-y-8">
                        {/* Weekly Activity */}
                        <Card className="bg-white border-neutral-200">
                            <h3 className="text-xl font-bold mb-6 text-neutral-900">Weekly Performance</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="text-3xl font-black text-neutral-900">84%</div>
                                        <div className="text-sm font-bold text-neutral-400 uppercase tracking-widest font-poppins">Efficiency</div>
                                    </div>
                                    <div className="text-success-600 bg-success-50 p-3 rounded-2xl"><TrendingUp size={24} /></div>
                                </div>
                                <div className="w-full bg-neutral-100 h-3 rounded-full overflow-hidden">
                                    <div className="bg-primary-600 h-full w-[84%] rounded-full shadow-primary"></div>
                                </div>
                                <p className="text-sm font-semibold text-neutral-500">You're doing great! Keep up the good work and stay healthy.</p>
                            </div>
                        </Card>

                        {/* Recent Reviews */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-neutral-900 px-2">Recent Patient Feedback</h3>
                            <div className="space-y-4">
                                {[
                                    { user: 'Emily R.', rating: 5, comment: 'Dr. John was very thorough and explained everything clearly.' },
                                    { user: 'Michael K.', rating: 4, comment: 'Great service, but had to wait 10 minutes past my time.' }
                                ].map((review, i) => (
                                    <div key={i} className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-soft hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-2 mb-2 text-warning-500">
                                            {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                        </div>
                                        <p className="text-sm font-medium text-neutral-600 mb-4">"{review.comment}"</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-500">{review.user.charAt(0)}</div>
                                            <span className="text-xs font-bold text-neutral-400">{review.user}</span>
                                        </div>
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
