import React, { useState, useEffect } from 'react';
import {
    Pill,
    Search,
    Download,
    Calendar,
    CheckCircle2,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import type { Prescription } from '../../types';

export const PatientPrescriptions: React.FC = () => {
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
        p.medicationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.doctor?.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="PATIENT">
            <div className="space-y-8 animate-fade-in font-inter">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Prescription Hub</h1>
                        <p className="text-neutral-500 font-medium">Digital prescriptions and medication guidance from your doctors.</p>
                    </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-primary-600 border-none p-6 text-white flex flex-col justify-between h-40">
                        <div className="flex justify-between items-start">
                            <Pill size={32} />
                            <Badge className="bg-white/20 border-white/30 text-white text-[10px] font-bold">Active</Badge>
                        </div>
                        <div>
                            <p className="text-primary-100 text-xs font-bold uppercase tracking-widest">Active Meds</p>
                            <h3 className="text-3xl font-black">4 Drugs</h3>
                        </div>
                    </Card>
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <Card className="bg-white border-neutral-100 p-6 flex items-center gap-4 shadow-soft">
                            <div className="w-12 h-12 bg-success-50 rounded-2xl flex items-center justify-center text-success-600">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Next Dosage</p>
                                <p className="text-lg font-black text-neutral-900">02:00 PM</p>
                            </div>
                        </Card>
                        <Card className="bg-white border-neutral-100 p-6 flex items-center gap-4 shadow-soft">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Renew Date</p>
                                <p className="text-lg font-black text-neutral-900">In 5 Days</p>
                            </div>
                        </Card>
                        <Card className="bg-white border-neutral-100 p-6 flex items-center gap-4 shadow-soft">
                            <div className="w-12 h-12 bg-warning-50 rounded-2xl flex items-center justify-center text-warning-600">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Refills left</p>
                                <p className="text-lg font-black text-neutral-900">2 Left</p>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                    <Input
                        placeholder="Search by medicine name or doctor..."
                        className="pl-12 h-14 bg-white border-neutral-100 shadow-soft"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Prescriptions List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {isLoading ? (
                        <div className="col-span-full text-center py-20 font-bold text-neutral-400">Loading prescriptions...</div>
                    ) : filteredPrescriptions.length > 0 ? (
                        filteredPrescriptions.map((p) => (
                            <Card key={p.id} className="p-0 overflow-hidden border-neutral-100 hover:border-primary-200 transition-all group flex flex-col">
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all">
                                                <Pill size={28} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-neutral-900 leading-tight">{p.medicationName}</h3>
                                                <p className="text-sm font-bold text-neutral-500 flex items-center gap-2 mt-1">
                                                    <Badge variant="success" size="sm" className="font-bold">{p.dosage}</Badge>
                                                    <span>•</span>
                                                    <span>{p.duration}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" className="h-10 w-10 p-0 border-neutral-200 rounded-xl">
                                            <Download size={18} />
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-neutral-50 p-4 rounded-2xl space-y-3">
                                            <div className="flex items-center justify-between text-xs font-bold">
                                                <span className="text-neutral-400 uppercase tracking-widest">Frequency</span>
                                                <span className="text-neutral-900">{p.frequency}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-bold">
                                                <span className="text-neutral-400 uppercase tracking-widest">Prescribed By</span>
                                                <span className="text-primary-600">Dr. {p.doctor?.user?.firstName} {p.doctor?.user?.lastName}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-bold">
                                                <span className="text-neutral-400 uppercase tracking-widest">Date Issued</span>
                                                <span className="text-neutral-700">{formatDate(p.prescriptionDate)}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 text-indigo-700">
                                            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                            <p className="text-xs font-bold leading-relaxed">{p.instructions || 'Follow as prescribed by the doctor.'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-neutral-50 p-4 border-t border-neutral-100 flex items-center justify-between group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                                    <span className="text-xs font-bold text-neutral-400 uppercase">Pharmacy Refill</span>
                                    <button className="text-primary-600 text-xs font-black flex items-center gap-1 group/btn">
                                        Send to Pharmacy <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-neutral-500 font-bold italic">No prescriptions found.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};
