import React, { useState } from 'react';
import { Camera, Shield, Lock, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import api from '../../services/api';
import type { Patient } from '../../types';

export const PatientProfile: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState<Partial<Patient>>({});

    const username = api.getUsername();
    const profileId = api.getProfileId();

    React.useEffect(() => {
        if (profileId) {
            loadPatientData();
        }
    }, [profileId]);

    const loadPatientData = async () => {
        try {
            const data = await api.getPatientById(profileId!);
            setPatient(data);
            setFormData(data);
        } catch (error) {
            console.error("Failed to fetch patient data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!profileId) return;
        try {
            const updated = await api.updatePatient(profileId, formData);
            setPatient(updated);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update patient data", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (isLoading && profileId) {
        return (
            <DashboardLayout role="PATIENT">
                <div className="p-20 text-center text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Loading profile...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="PATIENT">
            <div className="space-y-8 animate-fade-in font-poppins">
                <div className="flex flex-col md:flex-row md:items-end gap-8 pb-4">
                    <div className="relative group">
                        <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                            {patient?.firstName?.charAt(0) || username?.charAt(0).toUpperCase()}
                        </div>
                        <button className="absolute bottom-1 right-1 p-2 rounded-xl text-blue-600 hover:scale-110 transition-transform"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                            <Camera size={16} />
                        </button>
                    </div>
                    <div className="flex-1 space-y-1">
                        <h1 className="text-2xl font-bold capitalize" style={{ color: 'var(--text-primary)' }}>
                            {patient ? `${patient.firstName} ${patient.lastName}` : username}
                        </h1>
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                            <Shield size={13} className="text-emerald-500" /> Verified Patient Profile
                        </p>
                    </div>
                    <Button
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        className={`h-10 px-6 rounded-xl font-semibold transition-all text-sm ${isEditing ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </Button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border" style={{ borderColor: 'var(--border-default)' }}>
                            <h3 className="text-base font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Personal Information</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[['firstName','First Name'],['lastName','Last Name'],['email','Email Address'],['phoneNumber','Phone Number'],['dateOfBirth','Date of Birth','date'],['gender','Gender']].map(([name, label, type]) => (
                                    <div key={name} className="space-y-1.5">
                                        <label className="form-label">{label}</label>
                                        <Input name={name} type={type || 'text'} value={(formData as any)[name] || ''} onChange={handleChange} disabled={!isEditing} />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 space-y-1.5">
                                <label className="form-label">Home Address</label>
                                <Input name="address" value={formData.address || ''} onChange={handleChange} disabled={!isEditing} />
                            </div>
                        </Card>

                        <Card className="border" style={{ borderColor: 'var(--border-default)' }}>
                            <h3 className="text-base font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Medical Information</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                {[['bloodGroup','Blood Group'],['allergies','Known Allergies'],['medicalHistory','Medical History']].map(([name, label]) => (
                                    <div key={name} className={`p-4 rounded-xl border`}
                                        style={{ background: 'var(--bg-input)', borderColor: 'var(--border-default)' }}>
                                        <p className="form-label mb-2" style={{ color: `var(--text-label)` }}>{label}</p>
                                        <Input name={name} value={(formData as any)[name] || ''} onChange={handleChange} disabled={!isEditing}
                                            className="bg-transparent border-none p-0 h-auto text-base font-semibold shadow-none" />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="border" style={{ borderColor: 'var(--border-default)' }}>
                            <h4 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Account Security</h4>
                            <div className="space-y-2">
                                <button className="w-full flex items-center justify-between p-3 rounded-lg transition-colors group"
                                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-input)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                            <Lock size={15} />
                                        </div>
                                        <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Change Password</span>
                                    </div>
                                    <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} className="group-hover:translate-x-0.5 transition-transform" />
                                </button>
                                <button className="w-full flex items-center justify-between p-3 rounded-lg transition-colors group"
                                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-input)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                                            <Shield size={15} />
                                        </div>
                                        <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Two-Factor Auth</span>
                                    </div>
                                    <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} className="group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </Card>

                        <Card className="border" style={{ borderColor: 'var(--border-default)' }}>
                            <h4 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Notifications</h4>
                            <div className="space-y-4">
                                {[['Appointments', true], ['Prescription Alerts', true], ['Marketing', false]].map(([label, active]) => (
                                    <div key={label as string} className="flex items-center justify-between">
                                        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label as string}</span>
                                        <div className={`w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${active ? 'bg-blue-600' : ''}`}
                                            style={!active ? { background: 'var(--border-default)' } : {}}>
                                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
