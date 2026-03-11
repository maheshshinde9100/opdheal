import React, { useState, useEffect } from 'react';
import {
    CreditCard,
    Download,
    Search,
    CheckCircle2,
    Clock,
    RefreshCw,
    Receipt,
    AlertCircle,
    Calendar
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import type { Bill } from '../../types';

export const PatientBilling: React.FC = () => {
    const [bills, setBills] = useState<Bill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [downloading, setDownloading] = useState<string | null>(null);
    const profileId = api.getProfileId();

    useEffect(() => {
        loadBills();
    }, []);

    const loadBills = async () => {
        setIsLoading(true);
        try {
            const data = profileId
                ? await api.getBillsByPatient(profileId)
                : await api.getAllBills();
            setBills(data);
        } catch (error) {
            console.error('Failed to load bills', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredBills = bills.filter(bill => {
        const matchSearch = bill.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(bill.id).includes(searchTerm);
        const matchStatus = statusFilter === 'ALL' || bill.paymentStatus === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalPending = bills.filter(b => b.paymentStatus === 'PENDING').reduce((sum, b) => sum + b.amount, 0);
    const totalPaid = bills.filter(b => b.paymentStatus === 'PAID').reduce((sum, b) => sum + b.amount, 0);
    const pendingCount = bills.filter(b => b.paymentStatus === 'PENDING').length;

    const handleDownloadPDF = async (bill: Bill) => {
        setDownloading(String(bill.id));
        try {
            const { default: jsPDF } = await import('jspdf');
            const doc = new jsPDF('p', 'mm', 'a4');
            const pw = doc.internal.pageSize.getWidth();

            // Header
            doc.setFillColor(37, 99, 235);
            doc.rect(0, 0, 210, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text('OPDHeal', 15, 18);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text('Medical Invoice', 15, 26);
            doc.text(`Invoice #INV-${String(bill.id).padStart(4, '0')}`, pw - 15, 18, { align: 'right' });
            doc.text(`Date: ${formatDate(bill.billDate ?? '')}`, pw - 15, 26, { align: 'right' });

            // Status Badge
            const statusColor = bill.paymentStatus === 'PAID' ? [22, 163, 74] : [234, 88, 12];
            doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
            doc.roundedRect(pw - 50, 30, 40, 8, 2, 2, 'F');
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text(bill.paymentStatus, pw - 30, 35.5, { align: 'center' });

            // Bill Details
            doc.setTextColor(30, 30, 30);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(100, 116, 139);
            doc.text('BILLED TO', 15, 56);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(30, 30, 30);
            doc.text('Patient Account', 15, 64);

            // Divider
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.5);
            doc.line(10, 74, pw - 10, 74);

            // Line items
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(100, 116, 139);
            ['DESCRIPTION', 'DATE', 'AMOUNT', 'STATUS'].forEach((h, i) => {
                const xPos = i === 0 ? 15 : i === 1 ? 90 : i === 2 ? 140 : 170;
                doc.text(h, xPos, 84);
            });

            doc.setFillColor(248, 250, 252);
            doc.rect(10, 88, pw - 20, 14, 'F');
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(30, 30, 30);
            doc.text(bill.description || 'Medical Consultation', 15, 97);
            doc.text(formatDate(bill.billDate ?? ''), 90, 97);
            doc.setFont('helvetica', 'bold');
            doc.text(`$${bill.amount.toFixed(2)}`, 140, 97);
            doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
            doc.text(bill.paymentStatus, 170, 97);

            // Total
            doc.setDrawColor(226, 232, 240);
            doc.line(10, 110, pw - 10, 110);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(30, 30, 30);
            doc.text('TOTAL', 140, 122);
            doc.setFontSize(16);
            doc.setTextColor(37, 99, 235);
            doc.text(`$${bill.amount.toFixed(2)}`, 170, 122);

            if (bill.paymentMethod) {
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(100, 116, 139);
                doc.text(`Payment Method: ${bill.paymentMethod}`, 15, 122);
            }

            // Footer
            doc.setFillColor(37, 99, 235);
            doc.rect(0, 275, 210, 22, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.text('Thank you for choosing OPDHeal. For billing queries, contact support@opdheal.com', pw / 2, 287, { align: 'center' });

            doc.save(`Invoice_${bill.id}_${formatDate(bill.billDate ?? '')}.pdf`);
        } catch (err) {
            console.error('PDF error', err);
        } finally {
            setDownloading(null);
        }
    };

    return (
        <DashboardLayout role="PATIENT">
            <div className="space-y-8 animate-fade-in font-inter">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Financial Overview</h1>
                        <p className="text-neutral-500 font-medium mt-1">Track your medical invoices and payment history.</p>
                    </div>
                    <Button onClick={loadBills} className="bg-white border border-neutral-200 text-neutral-700 h-11 shadow-sm">
                        <RefreshCw size={16} className="mr-2" /> Refresh
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white rounded-2xl p-7 relative overflow-hidden">
                        <div className="absolute top-0 right-0 opacity-5 p-4">
                            <CreditCard size={120} />
                        </div>
                        <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-2">Total Outstanding</p>
                        <h2 className="text-4xl font-black">${totalPending.toFixed(2)}</h2>
                        <p className="text-neutral-400 text-sm mt-1">{pendingCount} unpaid invoice{pendingCount !== 1 ? 's' : ''}</p>
                        {pendingCount > 0 && (
                            <Button className="mt-6 w-full bg-white text-neutral-900 hover:bg-neutral-100 font-black h-11 rounded-xl border-none">
                                Pay All Dues
                            </Button>
                        )}
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-7 flex flex-col justify-between">
                        <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white mb-4">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Total Paid</p>
                            <p className="text-3xl font-black text-neutral-900 mt-1">${totalPaid.toFixed(2)}</p>
                            <p className="text-sm text-emerald-600 font-semibold mt-1">{bills.filter(b => b.paymentStatus === 'PAID').length} invoices cleared</p>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-7 flex flex-col justify-between">
                        <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white mb-4">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Pending Bills</p>
                            <p className="text-3xl font-black text-neutral-900 mt-1">{pendingCount} Invoices</p>
                            {pendingCount > 0 && (
                                <p className="text-sm text-amber-600 font-semibold mt-1 flex items-center gap-1">
                                    <AlertCircle size={13} /> Action required
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                        <Input
                            placeholder="Search by invoice number or description..."
                            className="pl-12 h-12 bg-white border-neutral-200 rounded-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {['ALL', 'PENDING', 'PAID', 'CANCELLED'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 h-12 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${statusFilter === s
                                ? 'bg-primary-600 text-white border-primary-600'
                                : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                                }`}
                        >
                            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                {/* Bills Table */}
                <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
                    {isLoading ? (
                        <div className="flex flex-col items-center py-16 gap-4">
                            <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-neutral-400 font-medium">Loading invoices...</p>
                        </div>
                    ) : filteredBills.length > 0 ? (
                        <>
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-neutral-50 border-b border-neutral-100">
                                <div className="col-span-3 text-xs font-black text-neutral-400 uppercase tracking-widest">Invoice</div>
                                <div className="col-span-4 text-xs font-black text-neutral-400 uppercase tracking-widest">Description</div>
                                <div className="col-span-2 text-xs font-black text-neutral-400 uppercase tracking-widest">Amount</div>
                                <div className="col-span-2 text-xs font-black text-neutral-400 uppercase tracking-widest">Status</div>
                                <div className="col-span-1 text-xs font-black text-neutral-400 uppercase tracking-widest text-right">PDF</div>
                            </div>

                            {filteredBills.map((bill) => (
                                <div key={bill.id} className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors items-center">
                                    <div className="col-span-3">
                                        <div className="font-bold text-neutral-900 text-sm">INV-{String(bill.id).padStart(4, '0')}</div>
                                        <div className="text-xs text-neutral-400 font-semibold flex items-center gap-1 mt-0.5">
                                            <Calendar size={11} /> {formatDate(bill.billDate)}
                                        </div>
                                    </div>
                                    <div className="col-span-4">
                                        <p className="text-sm font-semibold text-neutral-700 line-clamp-2">
                                            {bill.description || 'Medical Consultation Fee'}
                                        </p>
                                        {bill.paymentMethod && (
                                            <span className="text-[10px] font-bold text-neutral-400 uppercase">{bill.paymentMethod}</span>
                                        )}
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-lg font-black text-neutral-900">${bill.amount.toFixed(2)}</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${bill.paymentStatus === 'PAID'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                            : bill.paymentStatus === 'PENDING'
                                                ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                : 'bg-red-50 text-red-700 border-red-100'
                                            }`}>
                                            {bill.paymentStatus}
                                        </span>
                                    </div>
                                    <div className="col-span-1 flex justify-end gap-2">
                                        {bill.paymentStatus === 'PENDING' && (
                                            <button className="px-3 h-8 bg-primary-600 text-white rounded-lg text-xs font-bold hover:bg-primary-700 transition-colors">
                                                Pay
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDownloadPDF(bill)}
                                            disabled={downloading === String(bill.id)}
                                            className="w-8 h-8 border border-neutral-200 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors disabled:opacity-50"
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
                            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-300">
                                <Receipt size={36} />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-700 mb-2">No invoices found</h3>
                            <p className="text-neutral-400 font-medium">
                                {searchTerm ? `No results for "${searchTerm}"` : 'You have no billing records.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};
