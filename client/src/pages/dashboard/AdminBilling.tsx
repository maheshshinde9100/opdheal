import React, { useState, useEffect } from 'react';
import {
    CreditCard,
    Download,
    TrendingUp,
    CheckCircle2,
    Clock,
    Search as SearchIcon
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import type { Bill } from '../../types';

export const AdminBilling: React.FC = () => {
    const [bills, setBills] = useState<Bill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadBills();
    }, []);

    const loadBills = async () => {
        try {
            const data = await api.getAllBills();
            setBills(data);
        } catch (error) {
            console.error("Failed to load bills", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredBills = bills.filter(b =>
        b.patient?.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-8 animate-fade-in font-poppins">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-neutral-900 dark:text-white leading-tight">Financial Treasury</h1>
                        <p className="text-neutral-500 font-bold">Revenue monitoring and system-wide invoice management.</p>
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="p-8 border-none bg-primary-600 text-white rounded-[40px] shadow-2xl shadow-primary/30 flex flex-col justify-between h-48">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-white/20 rounded-2xl"><TrendingUp size={24} /></div>
                            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">+12.5%</span>
                        </div>
                        <div>
                            <p className="text-primary-100 text-xs font-black uppercase tracking-[0.2em] mb-1">Total Revenue</p>
                            <h2 className="text-4xl font-black">₹ 14,85,200</h2>
                        </div>
                    </Card>
                    <Card className="p-8 border-none bg-white dark:bg-neutral-800 rounded-[40px] shadow-soft flex flex-col justify-between h-48 border border-neutral-100 dark:border-neutral-800">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-success-50 dark:bg-success-900/10 text-success-600 rounded-2xl"><CheckCircle2 size={24} /></div>
                        </div>
                        <div>
                            <p className="text-neutral-400 text-xs font-black uppercase tracking-[0.2em] mb-1">Total Paid</p>
                            <h2 className="text-4xl font-black text-neutral-900 dark:text-white">₹ 12,40,000</h2>
                        </div>
                    </Card>
                    <Card className="p-8 border-none bg-white dark:bg-neutral-800 rounded-[40px] shadow-soft flex flex-col justify-between h-48 border border-neutral-100 dark:border-neutral-800">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-warning-50 dark:bg-warning-900/10 text-warning-600 rounded-2xl"><Clock size={24} /></div>
                        </div>
                        <div>
                            <p className="text-neutral-400 text-xs font-black uppercase tracking-[0.2em] mb-1">Outstanding</p>
                            <h2 className="text-4xl font-black text-neutral-900 dark:text-white">₹ 2,45,200</h2>
                        </div>
                    </Card>
                </div>

                <Card className="p-2 border-none shadow-soft rounded-[24px] flex flex-col md:flex-row gap-2 bg-white dark:bg-neutral-800">
                    <div className="flex-1 relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                        <input
                            placeholder="Search by patient name..."
                            className="w-full pl-12 h-14 bg-transparent border-none focus:ring-0 font-bold text-neutral-700 dark:text-neutral-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </Card>

                {/* Table */}
                <Card className="p-0 overflow-hidden border-neutral-100 dark:border-neutral-800 shadow-soft rounded-[32px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50/50 dark:bg-neutral-800/50 border-b border-neutral-100 dark:border-neutral-800">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Bill ID</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Patient Details</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Date</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Amount</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {isLoading ? (
                                    <tr><td colSpan={6} className="text-center py-20 font-black text-neutral-400">Loading invoice ledger...</td></tr>
                                ) : filteredBills.length > 0 ? (
                                    filteredBills.map((bill) => (
                                        <tr key={bill.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="font-black text-primary-600">#{bill.id}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-neutral-900 dark:text-white">Pt. {bill.patient?.user?.firstName}</div>
                                                <div className="text-xs font-medium text-neutral-400">{bill.patient?.user?.email}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-bold text-neutral-500 dark:text-neutral-400">{formatDate(bill.billDate)}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="font-black text-neutral-900 dark:text-white">₹ {bill.amount}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge status={bill.paymentStatus} className="font-black text-[9px] tracking-widest uppercase py-1 px-3">
                                                    {bill.paymentStatus}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <Button size="sm" variant="outline" className="h-10 w-10 p-0 border-neutral-100 dark:border-neutral-800 rounded-xl">
                                                    <Download size={18} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={6} className="text-center py-20 font-black text-neutral-400 italic">No billing records found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};
