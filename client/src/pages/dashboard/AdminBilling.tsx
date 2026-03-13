import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    CheckCircle2,
    Clock,
    Search,
    Download,
    RefreshCw,
    Calendar,
    AlertCircle,
    DollarSign
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import type { Bill } from '../../types';

export const AdminBilling: React.FC = () => {
    const [bills, setBills] = useState<Bill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [downloading, setDownloading] = useState<string | null>(null);

    useEffect(() => {
        loadBills();
    }, []);

    const loadBills = async () => {
        setIsLoading(true);
        try {
            const data = await api.getAllBills();
            setBills(data);
        } catch (error) {
            console.error('Failed to load bills', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredBills = bills.filter(b => {
        const matchSearch =
            b.patient?.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.patient?.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(b.id).includes(searchTerm) ||
            b.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === 'ALL' || b.paymentStatus === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalRevenue = bills.reduce((sum, b) => sum + b.amount, 0);
    const totalPaid = bills.filter(b => b.paymentStatus === 'PAID').reduce((sum, b) => sum + b.amount, 0);
    const totalPending = bills.filter(b => b.paymentStatus === 'PENDING').reduce((sum, b) => sum + b.amount, 0);
    const pendingCount = bills.filter(b => b.paymentStatus === 'PENDING').length;

    const handleDownloadPDF = async (bill: Bill) => {
        setDownloading(String(bill.id));
        try {
            const { default: jsPDF } = await import('jspdf');
            const doc = new jsPDF('p', 'mm', 'a4');
            const pw = doc.internal.pageSize.getWidth();

            doc.setFillColor(37, 99, 235);
            doc.rect(0, 0, 210, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text('OPDHeal Admin', 15, 18);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text('Invoice / Receipt', 15, 26);
            doc.text(`INV-${String(bill.id).padStart(4, '0')}`, pw - 15, 18, { align: 'right' });
            doc.text(`Date: ${formatDate(bill.billDate)}`, pw - 15, 26, { align: 'right' });

            doc.setTextColor(30, 30, 30);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(10, 48, pw - 20, 25, 3, 3, 'F');
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(100, 116, 139);
            doc.text('BILLED TO', 16, 57);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(30, 30, 30);
            doc.text(`${bill.patient?.user?.firstName || 'Patient'} ${bill.patient?.user?.lastName || ''}`, 16, 65);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 116, 139);
            doc.text(bill.patient?.user?.email || '', 16, 70);

            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.4);
            doc.line(10, 80, pw - 10, 80);

            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(100, 116, 139);
            doc.text('DESCRIPTION', 15, 92);
            doc.text('AMOUNT', 150, 92);

            doc.setFillColor(248, 250, 252);
            doc.rect(10, 96, pw - 20, 14, 'F');
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(30, 30, 30);
            doc.text(bill.description || 'Medical Consultation', 16, 105);
            doc.setFont('helvetica', 'bold');
            doc.text(`₹${bill.amount.toFixed(2)}`, 150, 105);

            doc.line(10, 118, pw - 10, 118);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('TOTAL', 120, 130);
            doc.setFontSize(16);
            doc.setTextColor(37, 99, 235);
            doc.text(`₹${bill.amount.toFixed(2)}`, 150, 130);

            doc.setFillColor(37, 99, 235);
            doc.rect(0, 275, 210, 22, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.text('OPDHeal Administration | For queries: admin@opdheal.com', pw / 2, 287, { align: 'center' });

            doc.save(`Invoice_${bill.id}.pdf`);
        } catch (err) {
            console.error('PDF error', err);
        } finally {
            setDownloading(null);
        }
    };

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-8 animate-fade-in font-inter">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Financial Treasury</h1>
                        <p className="text-neutral-500 font-medium mt-1">Revenue monitoring and invoice management across the portal.</p>
                    </div>
                    <Button onClick={loadBills} className="bg-white border border-neutral-200 text-neutral-700 h-11 shadow-sm">
                        <RefreshCw size={16} className="mr-2" /> Refresh
                    </Button>
                </div>

                {/* Revenue Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-gradient-to-br from-primary-600 to-indigo-700 text-white rounded-2xl p-7 relative overflow-hidden">
                        <div className="absolute top-4 right-4 opacity-10">
                            <TrendingUp size={80} />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2.5 bg-white/20 rounded-xl">
                                <DollarSign size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                                All Time
                            </span>
                        </div>
                        <p className="text-primary-200 text-xs font-bold uppercase tracking-widest mb-2">Total Revenue</p>
                        <h2 className="text-4xl font-black">₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
                        <p className="text-primary-200 text-sm mt-2">{bills.length} total invoices</p>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-7 flex flex-col justify-between">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                                <CheckCircle2 size={22} />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Total Collected</p>
                            <h2 className="text-3xl font-black text-neutral-900 mt-1">
                                ₹{totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </h2>
                            <p className="text-sm text-emerald-600 font-semibold mt-1">
                                {bills.filter(b => b.paymentStatus === 'PAID').length} invoices paid
                            </p>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-7 flex flex-col justify-between">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white">
                                <Clock size={22} />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Outstanding Balance</p>
                            <h2 className="text-3xl font-black text-neutral-900 mt-1">
                                ₹{totalPending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </h2>
                            <p className="text-sm text-amber-700 font-semibold mt-1 flex items-center gap-1">
                                {pendingCount > 0
                                    ? <><AlertCircle size={13} /> {pendingCount} pending invoices</>
                                    : '✓ All cleared!'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                        <input
                            placeholder="Search by patient name, invoice ID..."
                            className="w-full pl-12 h-12 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {['ALL', 'PENDING', 'PAID', 'CANCELLED'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-5 h-12 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${statusFilter === s
                                    ? 'bg-primary-600 text-white border-primary-600'
                                    : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                                }`}
                        >
                            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                {/* Invoice Table */}
                <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
                    {isLoading ? (
                        <div className="flex flex-col items-center py-16 gap-4">
                            <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-neutral-400 font-medium">Loading financial data...</p>
                        </div>
                    ) : filteredBills.length > 0 ? (
                        <>
                            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-neutral-50 border-b border-neutral-100">
                                <div className="col-span-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Invoice</div>
                                <div className="col-span-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Patient</div>
                                <div className="col-span-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Date</div>
                                <div className="col-span-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Amount</div>
                                <div className="col-span-1 text-[10px] font-black text-neutral-400 uppercase tracking-widest">Status</div>
                                <div className="col-span-1 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right">PDF</div>
                            </div>

                            {filteredBills.map((bill) => (
                                <div key={bill.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors items-center">
                                    <div className="col-span-2">
                                        <span className="font-black text-primary-600 text-sm">#{String(bill.id).padStart(4, '0')}</span>
                                    </div>
                                    <div className="col-span-4">
                                        <div className="font-bold text-neutral-900 text-sm">{bill.patient?.user?.firstName} {bill.patient?.user?.lastName}</div>
                                        <div className="text-xs text-neutral-400 font-medium">{bill.patient?.user?.email}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-sm font-semibold text-neutral-500 flex items-center gap-1">
                                            <Calendar size={12} /> {formatDate(bill.billDate)}
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="font-black text-neutral-900">₹{bill.amount.toFixed(2)}</span>
                                    </div>
                                    <div className="col-span-1">
                                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${bill.paymentStatus === 'PAID'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : bill.paymentStatus === 'PENDING'
                                                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                    : 'bg-red-50 text-red-700 border-red-100'
                                            }`}>
                                            {bill.paymentStatus}
                                        </span>
                                    </div>
                                    <div className="col-span-1 flex justify-end">
                                        <button
                                            onClick={() => handleDownloadPDF(bill)}
                                            disabled={downloading === String(bill.id)}
                                            className="w-8 h-8 border border-neutral-200 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors"
                                        >
                                            {downloading === String(bill.id) ? (
                                                <RefreshCw size={13} className="animate-spin" />
                                            ) : (
                                                <Download size={13} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-neutral-400 font-bold">No billing records found.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};
