import React, { useState, useEffect } from 'react';
import {
    Search,
    Calendar,
    Mail,
    Trash2,
    Eye,
    Download
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import type { Patient } from '../../types';

export const AdminPatients: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        try {
            const data = await api.getAllPatients();
            setPatients(data);
        } catch (error) {
            console.error("Failed to load patients", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredPatients = patients.filter(p =>
        p.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-8 animate-fade-in font-inter">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Patient Registry</h1>
                        <p className="text-neutral-500 font-medium">Global view of all registered patients in the system.</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                        <Input
                            placeholder="Search by patient name, email or ID..."
                            className="pl-12 h-14 bg-white border-neutral-100 shadow-soft"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="h-14 border-neutral-200">
                        <Download size={20} className="mr-2" /> Export Registry
                    </Button>
                </div>

                {/* Patient Cards */}
                <div className="grid gap-4">
                    {isLoading ? (
                        <div className="text-center py-20 font-bold text-neutral-400">Loading patients...</div>
                    ) : filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => (
                            <Card key={patient.id} className="p-6 border-neutral-100 hover:border-primary-200 transition-all group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-[20px] bg-neutral-100 flex items-center justify-center text-neutral-400 font-black text-xl group-hover:bg-primary-600 group-hover:text-white transition-all">
                                            {patient.user?.firstName?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-xl font-extrabold text-neutral-900 ">{patient.user?.firstName} {patient.user?.lastName}</h3>
                                                <Badge variant="auto" className="text-[10px] font-black uppercase tracking-widest bg-neutral-50 border-neutral-200">ID: PT-{patient.id}</Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-neutral-500">
                                                <span className="flex items-center gap-1.5"><Mail size={14} className="text-neutral-300" /> {patient.user?.email}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-neutral-300" /> Registered {formatDate(patient.createdAt || '')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="hidden lg:block text-right mr-6">
                                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Active Status</p>
                                            <p className="font-bold text-success-600">Active Account</p>
                                        </div>
                                        <Button variant="outline" size="sm" className="h-11 px-4 border-neutral-100 rounded-xl font-bold hover:bg-neutral-50">
                                            <Eye size={18} className="mr-2" /> Details
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-11 w-11 p-0 border-neutral-100 rounded-xl hover:text-error-600 hover:bg-error-50">
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-20 font-bold text-neutral-400 italic">No patients found.</div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};
