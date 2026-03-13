import React, { useState, useEffect } from 'react';
import {
    Camera,
    Shield,
    Smartphone,
    Mail,
    Stethoscope,
    GraduationCap,
    Building2,
    CalendarDays
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
        return <DashboardLayout role="DOCTOR"><div className="p-20 text-center font-bold text-neutral-400 italic">Synchronizing Doctor Profile...</div></DashboardLayout>;
    }

    return (
        <DashboardLayout role="DOCTOR">
            <div className="space-y-8 animate-fade-in font-poppins">
                <div className="flex flex-col md:flex-row md:items-end gap-8 pb-4">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-[40px] bg-gradient-to-br from-primary-500 to-indigo-600 border-8 border-white dark:border-neutral-800 shadow-2xl flex items-center justify-center text-white text-6xl font-black transition-transform group-hover:scale-105">
                            {doctor?.firstName?.charAt(0) || username?.charAt(0).toUpperCase()}
                        </div>
                        <button className="absolute bottom-2 right-2 p-3 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-700 text-primary-600 hover:scale-110 transition-transform">
                            <Camera size={20} />
                        </button>
                    </div>
                    <div className="flex-1 space-y-2">
                        <h1 className="text-4xl font-black text-neutral-900 dark:text-white capitalize">
                            Dr. {doctor ? `${doctor.firstName} ${doctor.lastName}` : username}
                        </h1>
                        <p className="text-neutral-500 font-bold flex items-center gap-2 tracking-widest uppercase text-xs">
                            <Shield size={14} className="text-success-500" /> Verified Medical Professional
                        </p>
                    </div>
                    <Button
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        className={`h-12 px-8 rounded-2xl font-black transition-all ${isEditing ? 'bg-success-500 text-white' : 'btn-primary'}`}
                    >
                        {isEditing ? 'Save Changes' : 'Edit Professional Profile'}
                    </Button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Personal Details */}
                        <Card className="p-10 border-none shadow-soft rounded-[40px]">
                            <h3 className="text-2xl font-black mb-10 dark:text-white flex items-center gap-3">
                                <Smartphone size={24} className="text-primary-500" /> Identity & Contact
                            </h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-neutral-400 uppercase tracking-widest pl-1">First Name</label>
                                    <Input name="firstName" value={formData.firstName || ''} onChange={handleChange} disabled={!isEditing} className="h-14 font-bold rounded-2xl" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-neutral-400 uppercase tracking-widest pl-1">Last Name</label>
                                    <Input name="lastName" value={formData.lastName || ''} onChange={handleChange} disabled={!isEditing} className="h-14 font-bold rounded-2xl" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-neutral-400 uppercase tracking-widest pl-1 flex items-center gap-1"><Mail size={12}/> Email Address</label>
                                    <Input name="email" value={formData.email || ''} onChange={handleChange} disabled={!isEditing} className="h-14 font-bold rounded-2xl" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-neutral-400 uppercase tracking-widest pl-1 flex items-center gap-1"><Smartphone size={12}/> Primary Phone</label>
                                    <Input name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} disabled={!isEditing} className="h-14 font-bold rounded-2xl" />
                                </div>
                            </div>
                        </Card>

                        {/* Professional Details */}
                        <Card className="p-10 border-none shadow-soft rounded-[40px]">
                            <h3 className="text-2xl font-black mb-10 dark:text-white flex items-center gap-3">
                                <Stethoscope size={24} className="text-primary-500" /> Professional Credentials
                            </h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-neutral-400 uppercase tracking-widest pl-1">Specialization</label>
                                    <Input name="specialization" value={formData.specialization || ''} onChange={handleChange} disabled={!isEditing} className="h-14 font-bold rounded-2xl" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-neutral-400 uppercase tracking-widest pl-1">License Number</label>
                                    <Input name="licenseNumber" value={formData.licenseNumber || ''} onChange={handleChange} disabled={!isEditing} className="h-14 font-bold rounded-2xl" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-neutral-400 uppercase tracking-widest pl-1 flex items-center gap-1"><Building2 size={12}/> Department</label>
                                    <Input name="department" value={formData.department || ''} onChange={handleChange} disabled={!isEditing} className="h-14 font-bold rounded-2xl" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-neutral-400 uppercase tracking-widest pl-1 flex items-center gap-1"><CalendarDays size={12}/> Experience (Years)</label>
                                    <Input type="number" name="experienceYears" value={formData.experienceYears || 0} onChange={handleChange} disabled={!isEditing} className="h-14 font-bold rounded-2xl" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-8">
                        {/* Status Card */}
                        <Card className="p-8 border-none shadow-soft rounded-[40px] bg-primary-900 text-white">
                            <h3 className="text-xl font-bold mb-6">Availability Status</h3>
                            <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10">
                                <span className="font-bold">Accepting Patients</span>
                                <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.available ? 'bg-success-500' : 'bg-white/20'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.available ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                            </div>
                            <p className="mt-4 text-xs font-medium text-white/60">Toggle your visibility for instant bookings.</p>
                        </Card>

                        {/* Education */}
                        <Card className="p-8 border-none shadow-soft rounded-[40px]">
                            <h3 className="text-xl font-black mb-6 dark:text-white flex items-center gap-2">
                                <GraduationCap size={20} className="text-primary-500" /> Qualifications
                            </h3>
                            <div className="space-y-4">
                                {doctor?.qualifications?.map((q, i) => (
                                    <div key={i} className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl font-bold text-sm text-neutral-700 dark:text-neutral-300">
                                        {q}
                                    </div>
                                ))}
                                {!doctor?.qualifications?.length && <p className="text-neutral-400 italic text-sm">No qualifications listed</p>}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
