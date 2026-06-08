import React, { useState, useEffect } from 'react';
import {
    Filter,
    Plus,
    Eye,
    Download,
    Calendar,
    Search as SearchIcon
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import type { MedicalRecord } from '../../types';

export const DoctorRecords: React.FC = () => {
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const profileId = api.getProfileId();

    useEffect(() => {
        loadRecords();
    }, []);

    const loadRecords = async () => {
        try {
            let data: MedicalRecord[] = [];
            if (profileId) {
                data = await api.getMedicalRecordsByDoctor(profileId);
            } else {
                data = await api.getAllMedicalRecords();
            }
            setRecords(data);
        } catch (error) {
            console.error("Failed to load records", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredRecords = records.filter(r =>
        r.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="DOCTOR">
            <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 leading-tight">Patient Medical Archives</h1>
                        <p className="text-slate-500 font-semibold">Comprehensive history of diagnoses and clinical reports.</p>
                    </div>
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white h-14 px-8 rounded-2xl">
                        <Plus size={20} className="mr-2" /> New Clinical Record
                    </Button>
                </div>

                {/* Search & Stats */}
                <div className="grid lg:grid-cols-4 gap-6">
                    <Card className="lg:col-span-3 p-2 border-slate-200 flex flex-col md:flex-row gap-2 rounded-2xl">
                        <div className="flex-1 relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400" size={20} />
                            <Input
                                placeholder="Search by patient name, diagnosis or treatment..."
                                className="pl-12 h-14 border-none focus:ring-0 font-semibold text-slate-700"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="border-slate-200 h-14 rounded-xl font-semibold px-6">
                            <Filter size={20} className="mr-2" /> Advanced View
                        </Button>
                    </Card>
                    <Card className="p-6 bg-teal-600 border-none text-white rounded-2xl flex flex-col justify-center">
                        <p className="text-teal-100 text-[10px] font-semibold uppercase tracking-[0.2em] mb-1">Total Archives</p>
                        <h3 className="text-3xl font-bold">{records.length} Records</h3>
                    </Card>
                </div>

                {/* Records Table */}
                <Card className="p-0 overflow-hidden border-slate-200 rounded-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Patient / ID</th>
                                    <th className="px-8 py-5 text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Diagnosis</th>
                                    <th className="px-8 py-5 text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Date</th>
                                    <th className="px-8 py-5 text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {isLoading ? (
                                    <tr><td colSpan={5} className="text-center py-20 font-semibold text-slate-400 italic">Syncing clinical data...</td></tr>
                                ) : filteredRecords.length > 0 ? (
                                    filteredRecords.map((record) => (
                                        <tr key={record.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
                                                        {record.patient?.firstName?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">Pt. {record.patient?.firstName} {record.patient?.lastName}</div>
                                                        <div className="text-[10px] font-semibold text-slate-400 uppercase">ID: MR-{record.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="font-semibold text-slate-700">{record.diagnosis}</div>
                                                <div className="text-xs text-slate-400 font-medium truncate max-w-xs">{record.treatment}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 font-semibold text-slate-600">
                                                    <Calendar size={14} className="text-teal-500" />
                                                    {formatDate(record.recordDate)}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge className="bg-teal-100 text-teal-700 border border-teal-200 font-semibold text-[9px] tracking-widest uppercase py-1 px-3">Signed</Badge>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" className="h-10 w-10 p-0 border-slate-200 rounded-xl hover:bg-teal-50 transition-all">
                                                        <Eye size={18} />
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="h-10 w-10 p-0 border-slate-200 rounded-xl hover:bg-teal-50 transition-all">
                                                        <Download size={18} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={5} className="text-center py-20">
                                        <p className="text-slate-400 font-semibold italic">No clinical records found.</p>
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};
