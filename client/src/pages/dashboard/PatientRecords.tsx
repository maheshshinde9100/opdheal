import React, { useState, useEffect } from 'react';
import {
    FileText,
    Search,
    Download,
    Link as LinkIcon,
    Eye,
    Calendar,
    Activity,
    Plus,
    User,
    ArrowUpRight
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import type { MedicalRecord } from '../../types';

export const PatientRecords: React.FC = () => {
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadRecords();
    }, []);

    const loadRecords = async () => {
        try {
            // Ideally get records for current patient
            const data = await api.getAllMedicalRecords();
            setRecords(data);
        } catch (error) {
            console.error("Failed to load records", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredRecords = records.filter(record =>
        record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.doctor?.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="PATIENT">
            <div className="space-y-8 animate-fade-in font-inter">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Medical Vault</h1>
                        <p className="text-neutral-500 font-medium">Secure access to all your diagnostic reports and history.</p>
                    </div>
                    <Button className="bg-primary-600 text-white shadow-primary h-12 px-6">
                        <Plus size={20} className="mr-2" /> Upload Record
                    </Button>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <Card className="bg-indigo-50 border-none p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                            <FileText size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Total Records</p>
                            <p className="text-2xl font-black text-neutral-900">{records.length}</p>
                        </div>
                    </Card>
                    <Card className="bg-success-50 border-none p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-success-600 rounded-2xl flex items-center justify-center text-white">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-success-600 uppercase tracking-widest">Recent Activity</p>
                            <p className="text-2xl font-black text-neutral-900">2 Tests</p>
                        </div>
                    </Card>
                    <Card className="bg-primary-50 border-none p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-primary-600 uppercase tracking-widest">Shared Nodes</p>
                            <p className="text-2xl font-black text-neutral-900">5 Doctors</p>
                        </div>
                    </Card>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                    <Input
                        placeholder="Search diagnosis, doctor, or test names..."
                        className="pl-12 h-14 bg-white border-neutral-100 shadow-soft"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Records List/Table */}
                <div className="grid gap-4">
                    {isLoading ? (
                        <div className="text-center py-20">Loading records...</div>
                    ) : filteredRecords.length > 0 ? (
                        filteredRecords.map((record) => (
                            <Card key={record.id} className="p-6 border-neutral-100 hover:border-primary-200 transition-all group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-extrabold text-neutral-900 leading-tight mb-1">{record.diagnosis}</h3>
                                            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-neutral-500">
                                                <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatDate(record.recordDate)}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1.5"><User size={14} /> Dr. {record.doctor?.user?.firstName} {record.doctor?.user?.lastName}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="hidden lg:block text-right mr-4">
                                            <p className="text-xs font-bold text-neutral-400 uppercase">Treatment</p>
                                            <p className="font-bold text-neutral-700">{record.treatment || 'Consultation'}</p>
                                        </div>
                                        <Button variant="outline" size="sm" className="h-10 px-4 border-neutral-200 rounded-xl font-bold">
                                            <Eye size={18} className="mr-2" /> View
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-10 px-4 border-neutral-200 rounded-xl font-bold">
                                            <Download size={18} className="mr-2" /> PDF
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-10 w-10 p-0 border-neutral-200 rounded-xl group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100">
                                            <ArrowUpRight size={18} />
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-neutral-50 italic text-neutral-400 text-sm">
                                    Notes: {record.notes || 'No additional clinical notes provided.'}
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-neutral-50 rounded-[32px] border-2 border-dashed border-neutral-200">
                            <FileText size={48} className="mx-auto text-neutral-300 mb-4" />
                            <p className="text-neutral-500 font-bold">No medical records found.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};
