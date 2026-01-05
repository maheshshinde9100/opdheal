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
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import type { MedicalRecord } from '../../types';

export const DoctorRecords: React.FC = () => {
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadRecords();
    }, []);

    const loadRecords = async () => {
        try {
            // In a real scenario, we'd fetch records for this specific doctor's patients
            const data = await api.getAllMedicalRecords();
            setRecords(data);
        } catch (error) {
            console.error("Failed to load records", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredRecords = records.filter(r =>
        r.patient?.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="DOCTOR">
            <div className="space-y-8 animate-fade-in font-poppins">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-neutral-900 dark:text-white leading-tight">Patient Medical Archives</h1>
                        <p className="text-neutral-500 font-bold">Comprehensive history of diagnoses and clinical reports.</p>
                    </div>
                    <Button className="btn-primary h-14 px-8 rounded-2xl shadow-xl shadow-primary/30">
                        <Plus size={20} className="mr-2" /> New Clinical Record
                    </Button>
                </div>

                {/* Search & Stats */}
                <div className="grid lg:grid-cols-4 gap-6">
                    <Card className="lg:col-span-3 p-2 border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row gap-2 rounded-[24px]">
                        <div className="flex-1 relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by patient name, diagnosis or treatment..."
                                className="w-full pl-12 h-14 bg-transparent border-none focus:ring-0 font-bold text-neutral-700 dark:text-neutral-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="border-neutral-100 dark:border-neutral-800 h-14 rounded-xl font-bold px-6">
                            <Filter size={20} className="mr-2" /> Advanced View
                        </Button>
                    </Card>
                    <Card className="p-6 bg-primary-600 border-none text-white rounded-[24px] flex flex-col justify-center">
                        <p className="text-primary-100 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Archives</p>
                        <h3 className="text-3xl font-black">{records.length} Records</h3>
                    </Card>
                </div>

                {/* Records Table */}
                <Card className="p-0 overflow-hidden border-neutral-100 dark:border-neutral-800 shadow-soft rounded-[32px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50/50 dark:bg-neutral-800/50 border-b border-neutral-100 dark:border-neutral-800">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Patient / ID</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Diagnosis</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Date</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {isLoading ? (
                                    <tr><td colSpan={5} className="text-center py-20 font-black text-neutral-400 italic">Syncing clinical data...</td></tr>
                                ) : filteredRecords.length > 0 ? (
                                    filteredRecords.map((record) => (
                                        <tr key={record.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center font-black">
                                                        {record.patient?.user?.firstName?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-neutral-900 dark:text-white">Pt. {record.patient?.user?.firstName}</div>
                                                        <div className="text-[10px] font-black text-neutral-400 uppercase">ID: MR-{record.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-neutral-700 dark:text-neutral-300">{record.diagnosis}</div>
                                                <div className="text-xs text-neutral-400 font-medium truncate max-w-xs">{record.treatment}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 font-bold text-neutral-600 dark:text-neutral-400">
                                                    <Calendar size={14} className="text-primary-500" />
                                                    {formatDate(record.recordDate)}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge variant="success" className="font-black text-[9px] tracking-widest uppercase py-1 px-3">Signed</Badge>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" className="h-10 w-10 p-0 border-neutral-100 dark:border-neutral-800 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all">
                                                        <Eye size={18} />
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="h-10 w-10 p-0 border-neutral-100 dark:border-neutral-800 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all">
                                                        <Download size={18} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={5} className="text-center py-20">
                                        <p className="text-neutral-400 font-black italic">No clinical records found.</p>
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
