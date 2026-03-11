import React, { useState, useEffect } from 'react';
import {
    Pill,
    Search,
    Download,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    RefreshCw,
    FileText,
    Clock,
    User,
    X
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
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
    const [downloading, setDownloading] = useState<string | null>(null);
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
    const profileId = api.getProfileId();

    useEffect(() => {
        loadPrescriptions();
    }, []);

    const loadPrescriptions = async () => {
        setIsLoading(true);
        try {
            let data: Prescription[];
            if (profileId) {
                data = await api.getPrescriptionsByPatient(profileId);
            } else {
                data = await api.getAllPrescriptions();
            }
            setPrescriptions(data);
        } catch (error) {
            console.error('Failed to load prescriptions', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredPrescriptions = prescriptions.filter(p =>
        p.medicationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.doctor?.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.doctor?.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.dosage?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDownloadPDF = async (prescription: Prescription) => {
        setDownloading(String(prescription.id));
        try {
            const { default: jsPDF } = await import('jspdf');
            const doc = new jsPDF('p', 'mm', 'a4');
            const pw = doc.internal.pageSize.getWidth();

            // Header background
            doc.setFillColor(37, 99, 235);
            doc.rect(0, 0, 210, 40, 'F');

            // Title
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text('OPDHeal', 15, 18);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text('Digital Prescription', 15, 26);
            doc.text(`Ref: #RX-${prescription.id}`, 15, 33);

            // Date on right
            doc.text(`Date: ${formatDate(prescription.prescriptionDate)}`, pw - 15, 26, { align: 'right' });

            // Reset text color
            doc.setTextColor(30, 30, 30);

            // Section: Doctor Info
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(10, 48, pw - 20, 30, 3, 3, 'F');
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(100, 116, 139);
            doc.text('PRESCRIBED BY', 16, 57);
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(30, 30, 30);
            doc.text(`Dr. ${prescription.doctor?.user?.firstName || ''} ${prescription.doctor?.user?.lastName || ''}`, 16, 65);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 116, 139);
            doc.text(prescription.doctor?.specialization || '', 16, 72);

            // Divider
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.4);
            doc.line(10, 85, pw - 10, 85);

            // Section: Medication
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(100, 116, 139);
            doc.text('MEDICATION', 16, 95);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(37, 99, 235);
            doc.text(prescription.medicationName || '', 16, 105);

            // Details grid
            const detailsY = 115;
            const details = [
                { label: 'DOSAGE', value: prescription.dosage || '—' },
                { label: 'FREQUENCY', value: prescription.frequency || '—' },
                { label: 'DURATION', value: prescription.duration || '—' },
            ];

            details.forEach((item, i) => {
                const x = 16 + (i * 62);
                doc.setFillColor(239, 246, 255);
                doc.roundedRect(x - 2, detailsY - 6, 58, 20, 2, 2, 'F');
                doc.setFontSize(8);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(100, 116, 139);
                doc.text(item.label, x, detailsY);
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(30, 30, 30);
                doc.text(item.value, x, detailsY + 8);
            });

            // Instructions
            doc.setFillColor(255, 251, 235);
            doc.roundedRect(10, 145, pw - 20, 30, 3, 3, 'F');
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(146, 64, 14);
            doc.text('⚠ INSTRUCTIONS', 16, 155);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(92, 60, 0);
            const instructionLines = doc.splitTextToSize(
                prescription.instructions || 'Take as prescribed. Complete the full course of treatment.',
                pw - 40
            );
            doc.text(instructionLines, 16, 163);

            // Footer
            doc.setFillColor(37, 99, 235);
            doc.rect(0, 275, 210, 22, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text('This is a digitally generated prescription from OPDHeal portal. Contact your doctor for queries.', pw / 2, 287, { align: 'center' });

            doc.save(`Prescription_${prescription.medicationName}_${prescription.id}.pdf`);
        } catch (err) {
            console.error('PDF generation failed', err);
        } finally {
            setDownloading(null);
        }
    };

    const activeCount = prescriptions.length;

    return (
        <DashboardLayout role="PATIENT">
            <div className="space-y-8 animate-fade-in font-inter">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Prescription Hub</h1>
                        <p className="text-neutral-500 font-medium mt-1">Your digital prescriptions — download, review, and track medications.</p>
                    </div>
                    <Button
                        onClick={loadPrescriptions}
                        className="bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50 shadow-sm h-11"
                    >
                        <RefreshCw size={16} className="mr-2" /> Refresh
                    </Button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            icon: <Pill size={22} />,
                            label: 'Total Prescriptions',
                            value: activeCount,
                            color: 'text-primary-600',
                            bg: 'bg-primary-50',
                            border: 'border-primary-100'
                        },
                        {
                            icon: <CheckCircle2 size={22} />,
                            label: 'Active Medications',
                            value: activeCount,
                            color: 'text-success-600',
                            bg: 'bg-success-50',
                            border: 'border-success-100'
                        },
                        {
                            icon: <Clock size={22} />,
                            label: 'Next Review',
                            value: 'In 7 Days',
                            color: 'text-warning-600',
                            bg: 'bg-warning-50',
                            border: 'border-warning-100'
                        },
                        {
                            icon: <AlertCircle size={22} />,
                            label: 'Refills Pending',
                            value: 0,
                            color: 'text-error-600',
                            bg: 'bg-error-50',
                            border: 'border-error-100'
                        },
                    ].map((stat, i) => (
                        <div key={i} className={`flex items-center gap-4 bg-white rounded-2xl p-4 border ${stat.border} shadow-sm`}>
                            <div className={`w-11 h-11 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{stat.label}</p>
                                <p className="text-xl font-black text-neutral-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <Input
                        placeholder="Search by medication, doctor name..."
                        className="pl-12 h-12 bg-white border-neutral-200 shadow-sm rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            onClick={() => setSearchTerm('')}
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Prescriptions List */}
                {isLoading ? (
                    <div className="flex flex-col items-center py-24 gap-4">
                        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-neutral-400 font-semibold">Loading prescriptions...</p>
                    </div>
                ) : filteredPrescriptions.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {filteredPrescriptions.map((p) => (
                            <div
                                key={p.id}
                                id={`rx-card-${p.id}`}
                                className="bg-white rounded-2xl border border-neutral-100 hover:border-primary-200 shadow-sm hover:shadow-lg transition-all group overflow-hidden flex flex-col"
                            >
                                {/* Card Top Bar */}
                                <div className="h-1.5 bg-gradient-to-r from-primary-400 via-primary-600 to-indigo-600 w-full" />

                                <div className="p-6 flex-1 flex flex-col gap-5">
                                    {/* Header Row */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                                                <Pill size={26} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-neutral-900 leading-tight">{p.medicationName}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="success" className="text-[10px] font-bold px-2 py-0.5">{p.dosage}</Badge>
                                                    <span className="text-neutral-300 text-sm">•</span>
                                                    <span className="text-xs font-semibold text-neutral-500">{p.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedPrescription(p)}
                                                className="w-9 h-9 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition-colors"
                                                title="View Details"
                                            >
                                                <FileText size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDownloadPDF(p)}
                                                disabled={downloading === String(p.id)}
                                                className="w-9 h-9 rounded-xl border border-primary-200 bg-primary-50 flex items-center justify-center text-primary-600 hover:bg-primary-100 transition-colors disabled:opacity-50"
                                                title="Download PDF"
                                            >
                                                {downloading === String(p.id) ? (
                                                    <RefreshCw size={15} className="animate-spin" />
                                                ) : (
                                                    <Download size={15} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { label: 'Frequency', value: p.frequency },
                                            { label: 'Duration', value: p.duration },
                                            { label: 'Issued', value: formatDate(p.prescriptionDate) },
                                        ].map((item, i) => (
                                            <div key={i} className="bg-neutral-50 rounded-xl p-3">
                                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                                                <p className="text-xs font-bold text-neutral-800">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Instructions */}
                                    {p.instructions && (
                                        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl p-3">
                                            <AlertCircle size={15} className="text-amber-600 mt-0.5 flex-shrink-0" />
                                            <p className="text-xs font-semibold text-amber-800 leading-relaxed">{p.instructions}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="border-t border-neutral-100 px-6 py-3 flex items-center justify-between bg-neutral-50/50">
                                    <div className="flex items-center gap-2 text-neutral-500">
                                        <User size={13} />
                                        <span className="text-xs font-bold">Dr. {p.doctor?.user?.firstName} {p.doctor?.user?.lastName}</span>
                                        {p.doctor?.specialization && (
                                            <span className="text-[10px] text-neutral-400">• {p.doctor.specialization}</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDownloadPDF(p)}
                                        className="text-primary-600 text-xs font-black flex items-center gap-1 hover:gap-2 transition-all"
                                    >
                                        Download <ArrowRight size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-neutral-200">
                        <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-300">
                            <Pill size={44} />
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 mb-2">No Prescriptions Found</h3>
                        <p className="text-neutral-400 font-medium max-w-xs mx-auto">
                            {searchTerm
                                ? `No prescriptions match "${searchTerm}". Try a different search.`
                                : 'Your doctor has not issued any prescriptions yet.'}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="mt-6 text-primary-600 font-bold text-sm hover:underline"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                )}

                {/* Detail Modal */}
                {selectedPrescription && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
                            <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-primary-200 text-xs font-bold uppercase tracking-wider mb-1">Digital Prescription</p>
                                        <h2 className="text-2xl font-black">{selectedPrescription.medicationName}</h2>
                                    </div>
                                    <button
                                        onClick={() => setSelectedPrescription(null)}
                                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Dosage', value: selectedPrescription.dosage },
                                        { label: 'Frequency', value: selectedPrescription.frequency },
                                        { label: 'Duration', value: selectedPrescription.duration },
                                        { label: 'Date Issued', value: formatDate(selectedPrescription.prescriptionDate) },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-neutral-50 rounded-xl p-4">
                                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">{item.label}</p>
                                            <p className="text-sm font-bold text-neutral-900">{item.value}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-neutral-50 rounded-xl p-4">
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Prescribed By</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-black">
                                            {selectedPrescription.doctor?.user?.firstName?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-neutral-900">Dr. {selectedPrescription.doctor?.user?.firstName} {selectedPrescription.doctor?.user?.lastName}</p>
                                            <p className="text-xs text-neutral-500">{selectedPrescription.doctor?.specialization}</p>
                                        </div>
                                    </div>
                                </div>

                                {selectedPrescription.instructions && (
                                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                            <AlertCircle size={12} /> Instructions
                                        </p>
                                        <p className="text-sm text-amber-800 font-medium leading-relaxed">{selectedPrescription.instructions}</p>
                                    </div>
                                )}

                                <Button
                                    className="w-full bg-primary-600 text-white h-12 rounded-xl font-bold"
                                    onClick={() => {
                                        handleDownloadPDF(selectedPrescription);
                                        setSelectedPrescription(null);
                                    }}
                                >
                                    <Download size={18} className="mr-2" /> Download PDF
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};
