import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Pill,
    Calendar,
    Download,
    RefreshCw,
    X,
    User,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/Button';
import api from '../../services/api';
import { formatDate } from '../../utils/helpers';
import type { Prescription, Patient } from '../../types';

export const DoctorPrescriptions: React.FC = () => {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [downloading, setDownloading] = useState<string | null>(null);
    const profileId = api.getProfileId();
    const [form, setForm] = useState({
        patientId: '',
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [rxData, patientData] = await Promise.all([
                profileId ? api.getPrescriptionsByDoctor(profileId) : api.getAllPrescriptions(),
                profileId ? api.getPatientsByDoctor(profileId) : api.getAllPatients(),
            ]);
            setPrescriptions(rxData);
            setPatients(patientData);
        } catch (error) {
            console.error('Failed to load prescriptions', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleIssue = async () => {
        if (!form.patientId || !form.medicationName || !form.dosage) return;
        setIsSubmitting(true);
        try {
            await api.createPrescription({
                patientId: form.patientId,
                doctorId: profileId,
                medicationName: form.medicationName,
                dosage: form.dosage,
                frequency: form.frequency,
                duration: form.duration,
                instructions: form.instructions,
                prescriptionDate: new Date().toISOString().split('T')[0],
            } as any);
            setSuccessMsg('Prescription issued successfully!');
            setShowModal(false);
            setForm({ patientId: '', medicationName: '', dosage: '', frequency: '', duration: '', instructions: '' });
            await loadData();
            setTimeout(() => setSuccessMsg(''), 4000);
        } catch (err) {
            console.error('Failed to issue prescription', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownloadPDF = async (p: Prescription) => {
        setDownloading(String(p.id));
        try {
            const { default: jsPDF } = await import('jspdf');
            const doc = new jsPDF('p', 'mm', 'a4');
            const pw = doc.internal.pageSize.getWidth();

            doc.setFillColor(13, 148, 136); // Teal-600
            doc.rect(0, 0, 210, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text('OPDHeal', 15, 18);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text('Digital Prescription', 15, 26);
            doc.text(`Ref: #RX-${p.id}`, 15, 33);
            doc.text(`Date: ${formatDate(p.prescriptionDate)}`, pw - 15, 26, { align: 'right' });

            doc.setTextColor(30, 30, 30);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(10, 48, pw - 20, 30, 3, 3, 'F');
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(100, 116, 139);
            doc.text('PATIENT', 16, 57);
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(30, 30, 30);
            doc.text(`${p.patient?.firstName || 'Patient'} ${p.patient?.lastName || ''}`, 16, 65);

            doc.setFillColor(13, 148, 136);
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.roundedRect(10, 87, pw - 20, 12, 2, 2, 'F');
            doc.text(p.medicationName || '', pw / 2, 95, { align: 'center' });

            doc.setTextColor(30, 30, 30);
            const details = [
                { label: 'DOSAGE', value: p.dosage || '—' },
                { label: 'FREQUENCY', value: p.frequency || '—' },
                { label: 'DURATION', value: p.duration || '—' },
            ];

            details.forEach((item, i) => {
                const x = 16 + i * 62;
                doc.setFillColor(236, 253, 245);
                doc.roundedRect(x - 2, 108, 58, 20, 2, 2, 'F');
                doc.setFontSize(8);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(100, 116, 139);
                doc.text(item.label, x, 115);
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(30, 30, 30);
                doc.text(item.value, x, 123);
            });

            if (p.instructions) {
                doc.setFillColor(255, 251, 235);
                doc.roundedRect(10, 140, pw - 20, 30, 3, 3, 'F');
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(146, 64, 14);
                doc.text('⚠ INSTRUCTIONS', 16, 150);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(92, 60, 0);
                const lines = doc.splitTextToSize(p.instructions, pw - 40);
                doc.text(lines, 16, 158);
            }

            doc.setFillColor(13, 148, 136);
            doc.rect(0, 275, 210, 22, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.text('Digitally issued by OPDHeal portal. Contact your doctor for queries.', pw / 2, 287, { align: 'center' });

            doc.save(`Rx_${p.medicationName}_${p.id}.pdf`);
        } catch (err) {
            console.error('PDF error', err);
        } finally {
            setDownloading(null);
        }
    };

    const filtered = prescriptions.filter(p =>
        p.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.medicationName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="DOCTOR">
            <div className="space-y-8 animate-fade-in">
                {successMsg && (
                    <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
                        <CheckCircle size={20} />
                        <span className="font-semibold">{successMsg}</span>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Prescriptions</h1>
                        <p className="text-slate-500 font-medium mt-1">Issue and manage digital prescriptions for your patients.</p>
                    </div>
                    <Button
                        onClick={() => setShowModal(true)}
                        className="bg-teal-600 hover:bg-teal-700 text-white h-12 px-6 rounded-xl"
                    >
                        <Plus size={18} className="mr-2" /> Issue Prescription
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 text-center">
                        <p className="text-3xl font-bold text-teal-600">{prescriptions.length}</p>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Total Issued</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center">
                        <p className="text-3xl font-bold text-emerald-600">{patients.length}</p>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Patients Treated</p>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-center">
                        <p className="text-3xl font-bold text-indigo-600">
                            {prescriptions.filter(p => {
                                const d = new Date(p.prescriptionDate);
                                const now = new Date();
                                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                            }).length}
                        </p>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">This Month</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400" />
                    <input
                        placeholder="Search by patient name or medication..."
                        className="w-full pl-12 h-12 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Prescriptions Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-slate-400 font-semibold">Loading prescriptions...</p>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map((p) => (
                            <div
                                key={p.id}
                                className="bg-white rounded-2xl border border-slate-200 hover:border-teal-200 hover:shadow-lg transition-all group overflow-hidden"
                            >
                                <div className="h-1.5 bg-gradient-to-r from-teal-400 via-teal-600 to-teal-700" />
                                <div className="p-6 space-y-4">
                                    {/* Patient */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 font-bold text-base flex items-center justify-center">
                                                {p.patient?.firstName?.charAt(0) || <User size={18} />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 text-sm leading-tight">
                                                    {p.patient?.firstName} {p.patient?.lastName}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                                                    <Calendar size={10} /> {formatDate(p.prescriptionDate)}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDownloadPDF(p)}
                                            disabled={downloading === String(p.id)}
                                            className="w-8 h-8 border border-teal-200 bg-teal-50 rounded-xl text-teal-600 flex items-center justify-center hover:bg-teal-100 transition-colors"
                                        >
                                            {downloading === String(p.id) ? <RefreshCw size={12} className="animate-spin" /> : <Download size={12} />}
                                        </button>
                                    </div>

                                    {/* Medication */}
                                    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-4">
                                        <div className="flex items-center gap-3">
                                            <Pill size={20} className="text-teal-600" />
                                            <div>
                                                <p className="font-bold text-slate-900">{p.medicationName}</p>
                                                <p className="text-xs text-slate-500 font-semibold">{p.dosage} • {p.frequency}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-slate-50 rounded-xl p-3">
                                            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Duration</p>
                                            <p className="text-xs font-semibold text-slate-800 mt-0.5">{p.duration || '—'}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-3">
                                            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Status</p>
                                            <p className="text-xs font-semibold text-emerald-600 mt-0.5">Active</p>
                                        </div>
                                    </div>

                                    {p.instructions && (
                                        <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
                                            <AlertCircle size={13} className="text-amber-600 mt-0.5 flex-shrink-0" />
                                            <p className="text-[11px] text-amber-800 font-medium leading-relaxed line-clamp-2">{p.instructions}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Pill size={36} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No Prescriptions Yet</h3>
                        <p className="text-slate-400 font-medium mb-6">You haven't issued any prescriptions.</p>
                        <Button onClick={() => setShowModal(true)} className="bg-teal-600 hover:bg-teal-700 text-white">
                            Issue First Prescription
                        </Button>
                    </div>
                )}
            </div>

            {/* Issue Prescription Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">Issue Prescription</h2>
                                    <p className="text-teal-200 text-sm mt-1">Create a digital prescription for your patient</p>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Patient *</label>
                                <select
                                    value={form.patientId}
                                    onChange={(e) => setForm(f => ({ ...f, patientId: e.target.value }))}
                                    className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-300 appearance-none"
                                >
                                    <option value="">Select patient...</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.firstName} {p.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Medication Name *</label>
                                <input
                                    value={form.medicationName}
                                    onChange={(e) => setForm(f => ({ ...f, medicationName: e.target.value }))}
                                    placeholder="e.g., Amoxicillin"
                                    className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Dosage *</label>
                                    <input
                                        value={form.dosage}
                                        onChange={(e) => setForm(f => ({ ...f, dosage: e.target.value }))}
                                        placeholder="500mg"
                                        className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-300"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Frequency</label>
                                    <input
                                        value={form.frequency}
                                        onChange={(e) => setForm(f => ({ ...f, frequency: e.target.value }))}
                                        placeholder="3x daily"
                                        className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-300"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Duration</label>
                                    <input
                                        value={form.duration}
                                        onChange={(e) => setForm(f => ({ ...f, duration: e.target.value }))}
                                        placeholder="7 days"
                                        className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Instructions</label>
                                <textarea
                                    value={form.instructions}
                                    onChange={(e) => setForm(f => ({ ...f, instructions: e.target.value }))}
                                    placeholder="Take after meals, avoid alcohol..."
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button variant="outline" className="flex-1 h-12 border-slate-200" onClick={() => setShowModal(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 h-12 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700"
                                    onClick={handleIssue}
                                    disabled={isSubmitting || !form.patientId || !form.medicationName || !form.dosage}
                                >
                                    {isSubmitting ? <RefreshCw size={16} className="animate-spin mr-2" /> : <Pill size={16} className="mr-2" />}
                                    {isSubmitting ? 'Issuing...' : 'Issue Prescription'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};
