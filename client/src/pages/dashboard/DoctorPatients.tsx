import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Activity,
    Phone,
    Mail
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import api from '../../services/api';
import type { PatientDto } from '../../types';

export const DoctorPatients: React.FC = () => {
    const [patients, setPatients] = useState<PatientDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const profileId = api.getProfileId();

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        try {
            let data: PatientDto[] = [];
            if (profileId) {
                data = await api.getPatientsByDoctor(profileId);
            } else {
                data = await api.getAllPatients();
            }
            setPatients(data);
        } catch (error) {
            console.error("Failed to load patients", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredPatients = patients.filter(p =>
        p.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="DOCTOR">
            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Patient Directory</h1>
                        <p className="text-slate-500 font-medium">Manage and view your assigned patient records.</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400" size={20} />
                        <Input
                            placeholder="Search patients by name..."
                            className="pl-12 h-14 bg-white border-slate-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="h-14 border-slate-200">
                        <Filter size={20} className="mr-2" /> All Conditions
                    </Button>
                </div>

                {/* Patients List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        [1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>)
                    ) : filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => (
                            <Card key={patient.id} className="p-8 border-slate-200 hover:shadow-xl transition-all group rounded-2xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-teal-100">
                                    <Activity size={100} />
                                </div>

                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center font-black text-2xl border-2 border-white shadow-sm transition-transform group-hover:scale-110">
                                        {patient.firstName?.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                                            {patient.firstName} {patient.lastName}
                                        </h3>
                                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">{patient.gender}, {patient.dateOfBirth ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear() : 'N/A'} Yrs</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3 text-slate-500 text-sm font-semibold">
                                        <Phone size={16} className="text-teal-400" />
                                        <span>{patient.phoneNumber}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 text-sm font-semibold">
                                        <Mail size={16} className="text-teal-400" />
                                        <span className="truncate">{patient.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge className="bg-slate-100 border-none text-slate-600 font-semibold uppercase text-[10px]">Blood: {patient.bloodGroup || 'N/A'}</Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-100">
                                    <Button variant="outline" className="rounded-xl font-semibold h-11 border-slate-200 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-100">
                                        History
                                    </Button>
                                    <Button className="bg-teal-600 text-white rounded-xl font-semibold h-11 hover:bg-teal-700 transition-all">
                                        Add Record
                                    </Button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 font-semibold text-slate-400 italic">No patients found.</div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};
