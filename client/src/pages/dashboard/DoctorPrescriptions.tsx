import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Pill,
    Calendar,
    ChevronRight,
    Printer,
    Mail
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import type { Prescription } from '../../types';

export const DoctorPrescriptions: React.FC = () => {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadPrescriptions();
    }, []);

    const loadPrescriptions = async () => {
        try {
            const data = await api.getAllPrescriptions();
            setPrescriptions(data);
        } catch (error) {
            console.error("Failed to load prescriptions", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredPrescriptions = prescriptions.filter(p =>
        p.patient?.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.medicationName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="DOCTOR">
            <div className="space-y-8 animate-fade-in font-poppins">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-neutral-900 dark:text-white leading-tight">Digital Prescription Hub</h1>
                        <p className="text-neutral-500 font-bold">Manage medication cycles and issue digital prescriptions securely.</p>
                    </div>
                    <Button className="btn-primary h-14 px-8 rounded-2xl shadow-xl shadow-primary/30">
                        <Plus size={20} className="mr-2" /> Issue New Prescription
                    </Button>
                </div>

                {/* Quick Filters */}
                <Card className="p-2 border-none shadow-soft rounded-[24px] flex flex-col md:flex-row gap-2 bg-white dark:bg-neutral-800">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                        <input
                            placeholder="Search by patient or medicine..."
                            className="w-full pl-12 h-14 bg-transparent border-none focus:ring-0 font-bold text-neutral-700 dark:text-neutral-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="border-neutral-100 dark:border-neutral-700 h-14 rounded-xl font-bold px-6">Active Only</Button>
                        <Button variant="outline" className="border-neutral-100 dark:border-neutral-700 h-14 rounded-xl font-bold px-6">Archives</Button>
                    </div>
                </Card>

                {/* Grid View */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        <div className="col-span-full text-center py-20 font-black text-neutral-400 italic">Accessing digital pharmacopeia...</div>
                    ) : filteredPrescriptions.length > 0 ? (
                        filteredPrescriptions.map((p) => (
                            <Card key={p.id} className="p-8 border-none shadow-soft hover:shadow-medium transition-all group rounded-[40px] flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl flex items-center justify-center font-black">
                                            <Pill size={28} />
                                        </div>
                                        <Badge variant="success" className="font-black text-[9px] tracking-widest uppercase">Issued</Badge>
                                    </div>

                                    <div className="space-y-1 mb-6">
                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Patient</p>
                                        <h3 className="text-xl font-black text-neutral-900 dark:text-white">Pt. {p.patient?.user?.firstName} {p.patient?.user?.lastName}</h3>
                                    </div>

                                    <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-700 mb-6 space-y-4">
                                        <div>
                                            <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-1">Medication</p>
                                            <p className="font-black text-neutral-800 dark:text-neutral-200">{p.medicationName}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-1">Dosage</p>
                                                <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400">{p.dosage}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-1">Duration</p>
                                                <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400">{p.duration}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 mb-8">
                                        <Calendar size={14} />
                                        <span>Last Issued: {formatDate(p.prescriptionDate)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                    <Button variant="outline" className="flex-1 h-12 rounded-xl border-neutral-100 dark:border-neutral-700 group/btn">
                                        <Printer size={18} className="group-hover/btn:scale-110 transition-transform mr-2" /> Print
                                    </Button>
                                    <Button variant="outline" className="flex-1 h-12 rounded-xl border-neutral-100 dark:border-neutral-700 group/btn">
                                        <Mail size={18} className="group-hover/btn:scale-110 transition-transform mr-2" /> Share
                                    </Button>
                                    <Button variant="outline" className="w-12 h-12 p-0 rounded-xl border-neutral-100 dark:border-neutral-700">
                                        <ChevronRight size={18} />
                                    </Button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 font-black text-neutral-400 italic">No issuance data found.</div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};
