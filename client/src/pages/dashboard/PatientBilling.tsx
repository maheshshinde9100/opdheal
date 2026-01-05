import React, { useState, useEffect } from 'react';
import {
    CreditCard,
    Download,
    Search,
    Filter,
    ArrowUpRight,
    Calendar,
    Clock,
    DollarSign,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import type { Bill } from '../../types';

export const PatientBilling: React.FC = () => {
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

    const filteredBills = bills.filter(bill =>
        bill.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPending = bills
        .filter(b => b.paymentStatus === 'PENDING')
        .reduce((sum, b) => sum + b.amount, 0);

    return (
        <DashboardLayout role="PATIENT">
            <div className="space-y-8 animate-fade-in font-inter">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Financial Overview</h1>
                        <p className="text-neutral-500 font-medium">Manage your medical expenses and payment history.</p>
                    </div>
                </div>

                {/* Billing Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white p-8 border-none overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <CreditCard size={120} />
                        </div>
                        <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs mb-2">Total Outstanding</p>
                        <h2 className="text-4xl font-black">${totalPending.toFixed(2)}</h2>
                        <Button className="mt-8 w-full bg-white text-neutral-900 hover:bg-primary-50 font-black h-12 rounded-xl border-none">
                            Pay All Dues
                        </Button>
                    </Card>

                    <div className="md:col-span-2 grid grid-cols-2 gap-6">
                        <Card className="bg-success-50 border-none p-6 flex flex-col justify-between">
                            <div className="w-12 h-12 bg-success-600 rounded-2xl flex items-center justify-center text-white">
                                <CheckCircle2 size={24} />
                            </div>
                            <div className="mt-4">
                                <p className="text-xs font-bold text-success-600 uppercase tracking-widest">Total Paid</p>
                                <p className="text-2xl font-black text-neutral-900">
                                    ${bills.filter(b => b.paymentStatus === 'PAID').reduce((sum, b) => sum + b.amount, 0).toFixed(2)}
                                </p>
                            </div>
                        </Card>
                        <Card className="bg-warning-50 border-none p-6 flex flex-col justify-between">
                            <div className="w-12 h-12 bg-warning-600 rounded-2xl flex items-center justify-center text-white">
                                <Clock size={24} />
                            </div>
                            <div className="mt-4">
                                <p className="text-xs font-bold text-warning-600 uppercase tracking-widest">Pending Bills</p>
                                <p className="text-2xl font-black text-neutral-900">
                                    {bills.filter(b => b.paymentStatus === 'PENDING').length} Invoices
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                        <Input
                            placeholder="Search by invoice description..."
                            className="pl-12 h-12 bg-white border-neutral-100 shadow-soft"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="h-12 border-neutral-200">
                        <Filter size={20} className="mr-2" /> Recent Sort
                    </Button>
                </div>

                {/* Bills Table/List */}
                <Card className="p-0 overflow-hidden border-neutral-100">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50 border-b border-neutral-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Invoice / Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Description</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {isLoading ? (
                                <tr><td colSpan={5} className="text-center py-10">Loading bills...</td></tr>
                            ) : filteredBills.length > 0 ? (
                                filteredBills.map((bill) => (
                                    <tr key={bill.id} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-neutral-900">INV-00{bill.id}</div>
                                            <div className="text-xs font-semibold text-neutral-400 flex items-center gap-1 mt-1">
                                                <Calendar size={12} /> {formatDate(bill.billDate)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-sm font-bold text-neutral-700">{bill.description}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="font-black text-neutral-900">${bill.amount.toFixed(2)}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge variant="auto" status={bill.paymentStatus} className="rounded-lg font-black text-[10px] tracking-widest uppercase">
                                                {bill.paymentStatus}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                {bill.paymentStatus === 'PENDING' && (
                                                    <Button size="sm" className="bg-primary-600 text-white font-bold px-4 h-9 shadow-primary">
                                                        Pay Now
                                                    </Button>
                                                )}
                                                <Button size="sm" variant="outline" className="h-9 w-9 p-0 border-neutral-200">
                                                    <Download size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={5} className="text-center py-20 text-neutral-400 italic font-medium">No billing records found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </Card>
            </div>
        </DashboardLayout>
    );
};
