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
        { label: 'Today\'s Schedule', value: todayCount.toString(), subValue: 'Appointments pending', icon: <Calendar className="text-blue-600" />, color: 'bg-blue-50', trend: 'Active' },
        { label: 'New Patients', value: '5', subValue: 'Since yesterday', icon: <Users className="text-emerald-600" />, color: 'bg-emerald-50', trend: '+10%' },
        { label: 'Patient Satisfaction', value: '4.9', subValue: 'Out of 5 stars', icon: <Star className="text-amber-500" />, color: 'bg-amber-50', trend: 'High' },
        { label: 'Pending Reviews', value: '8', subValue: 'Lab reports/Results', icon: <AlertCircle className="text-rose-600" />, color: 'bg-rose-50', trend: 'Action' },
    ];

    return (
        <DashboardLayout role="DOCTOR">
            <div className="space-y-10 animate-fade-in">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Welcome, <span className="text-blue-600">Dr. {username}</span>
                        </h1>
                        <p className="text-base text-slate-600 font-medium mt-1">You have {todayCount} appointments scheduled for today.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button className="bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-sm font-semibold">
                            Manage Schedule
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-semibold">
                            Next Patient <ArrowRight size={18} className="ml-2" />
                        </Button>
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
                                <span className={`text-xs font-bold px-2 py-1 rounded-md ${stat.trend.includes('+') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-50 text-slate-600 border border-slate-200'
                                    }`}>
                                    {stat.trend}
                                </span>
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
                    {/* Appointments Table */}
                    <div className="lg:col-span-2">
                        <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900">Today's Appointments</h2>
                                <Button variant="outline" size="sm" className="font-semibold text-slate-600 border-slate-300">View Schedule</Button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {appointments.map((appt: Appointment) => (
                                            <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                                                            {appt.patientName?.charAt(0) || 'P'}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900">{appt.patientName}</div>
                                                            <div className="text-xs text-slate-500">MRN-{appt.patientId}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-slate-900">{formatTime(appt.appointmentDateTime?.split('T')[1]?.slice(0, 5) || '')}</div>
                                                    <div className="text-xs text-slate-500">Consultation</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-semibold px-2 py-0.5 rounded text-xs text-center border-solid mb-0 inline-block font-sans">Clinical Visit</Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                        <span className="text-xs font-semibold text-slate-700 uppercase">{appt.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Button size="sm" className="h-8 w-8 p-0 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 shadow-none">
                                                            <Video size={14} />
                                                        </Button>
                                                        <Button size="sm" className="h-8 w-8 p-0 bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-none">
                                                            <ArrowRight size={14} />
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
                        <Card className="bg-white border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold mb-5 text-slate-900">Clinical Efficiency</h3>
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="text-2xl font-bold text-slate-900">84%</div>
                                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Schedule Adherence</div>
                                    </div>
                                    <div className="text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-100"><TrendingUp size={20} /></div>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-blue-600 h-full w-[84%] rounded-full shadow-sm"></div>
                                </div>
                                <p className="text-sm font-normal text-slate-600">Performance metrics indicate above-average schedule adherence this week.</p>
                            </div>
                        </Card>

                        {/* Recent Reviews */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-900 px-1">Patient Feedback</h3>
                            <div className="space-y-3">
                                {[
                                    { user: 'Mahesh S.', rating: 5, comment: 'Clear explanations and very professional clinical care.' },
                                    { user: 'Sanjay P.', rating: 4, comment: 'Efficient service, minimal waiting time.' }
                                ].map((review, i) => (
                                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-1 mb-2 text-amber-500">
                                            {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                        </div>
                                        <p className="text-sm font-medium text-slate-700 mb-3">"{review.comment}"</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">{review.user.charAt(0)}</div>
                                            <span className="text-xs font-semibold text-slate-500">{review.user}</span>
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
