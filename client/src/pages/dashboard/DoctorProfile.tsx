import React, { useState, useEffect } from 'react';
import {
    Camera,
    Shield,
    Smartphone,
    Stethoscope,
    GraduationCap,
} from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import type { Doctor } from '../../types';

export const DoctorProfile: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState<Partial<Doctor>>({});

    const username = api.getUsername();
    const profileId = api.getProfileId();

    useEffect(() => {
        if (profileId) {
            loadDoctorData();
        }
    }, [profileId]);

    const loadDoctorData = async () => {
        try {
            const data = await api.getDoctorById(profileId!);
            setDoctor(data);
            setFormData(data);
        } catch (error) {
            console.error("Failed to fetch doctor data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!profileId) return;
        try {
            const updated = await api.updateDoctor(profileId, formData as any);
            setDoctor(updated);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update doctor data", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (isLoading && profileId) {
        return (
            <DashboardLayout role="DOCTOR">
                <div className="p-20 text-center text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Loading doctor profile...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="DOCTOR">
            <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-end gap-8 pb-4">
                    <div className="relative group">
                        <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                            {doctor?.firstName?.charAt(0) || username?.charAt(0).toUpperCase()}
                        </div>
                        <button className="absolute bottom-1 right-1 p-2 rounded-xl text-blue-600 hover:scale-110 transition-transform"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                            <Camera size={16} />
                        </button>
                    </div>
                    <div className="flex-1 space-y-1">
                        <h1 className="text-2xl font-bold capitalize" style={{ color: 'var(--text-primary)' }}>
                            Dr. {doctor ? `${doctor.firstName} ${doctor.lastName}` : username}
                        </h1>
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                            <Shield size={13} className="text-emerald-500" /> Verified Medical Professional
                        </p>
                    </div>
                    <Button
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        className={`h-10 px-6 rounded-xl font-semibold transition-all text-sm ${isEditing ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                        {isEditing ? 'Save Changes' : 'Edit Professional Profile'}
                    </Button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Details */}
                        <Card className="border" style={{ borderColor: 'var(--border-default)' }}>
                            <h3 className="text-base font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <Smartphone size={18} className="text-blue-500" /> Identity & Contact
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[['firstName','First Name'],['lastName','Last Name'],['email','Email Address'],['phoneNumber','Phone Number']].map(([name, label]) => (
                                    <div key={name} className="space-y-1.5">
                                        <label className="form-label">{label}</label>
                                        <Input name={name} value={(formData as any)[name] || ''} onChange={handleChange} disabled={!isEditing} />
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Professional Details */}
                        <Card className="border" style={{ borderColor: 'var(--border-default)' }}>
                            <h3 className="text-base font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <Stethoscope size={18} className="text-blue-500" /> Professional Credentials
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[['specialization','Specialization'],['licenseNumber','License Number'],['department','Department']].map(([name, label]) => (
                                    <div key={name} className="space-y-1.5">
                                        <label className="form-label">{label}</label>
                                        <Input name={name} value={(formData as any)[name] || ''} onChange={handleChange} disabled={!isEditing} />
                                    </div>
                                ))}
                                <div className="space-y-1.5">
                                    <label className="form-label">Experience (Years)</label>
                                    <Input type="number" name="experienceYears" value={formData.experienceYears || 0} onChange={handleChange} disabled={!isEditing} />
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {/* Status Card */}
                        <Card className="bg-slate-900 text-white border border-slate-800">
                            <h3 className="text-base font-bold mb-4">Availability Status</h3>
                            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.10)' }}>
                                <span className="font-semibold text-sm">Accepting Patients</span>
                                <div className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors flex items-center ${formData.available ? 'bg-emerald-500 justify-end' : 'bg-white/20 justify-start'}`}>
                                    <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </div>
                            <p className="mt-3 text-xs text-white/50">Toggle to control your booking visibility.</p>
                        </Card>

                        {/* Education */}
                        <Card className="border" style={{ borderColor: 'var(--border-default)' }}>
                            <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <GraduationCap size={16} className="text-blue-500" /> Qualifications
                            </h3>
                            <div className="space-y-2">
                                {doctor?.qualifications?.map((q, i) => (
                                    <div key={i} className="p-3 rounded-lg text-sm font-medium" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}>
                                        {q}
                                    </div>
                                ))}
                                {!doctor?.qualifications?.length && <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>No qualifications listed</p>}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
