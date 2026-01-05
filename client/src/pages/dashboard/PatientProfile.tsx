import React, { useState } from 'react';
import { Camera, Shield, Lock, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import api from '../../services/api';

export const PatientProfile: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const username = api.getUsername();

    return (
        <DashboardLayout role="PATIENT">
            <div className="space-y-8 animate-fade-in font-poppins">
                <div className="flex flex-col md:flex-row md:items-end gap-8 pb-4">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-[40px] bg-gradient-to-br from-primary-500 to-indigo-600 border-8 border-white dark:border-neutral-800 shadow-2xl flex items-center justify-center text-white text-6xl font-black transition-transform group-hover:scale-105">
                            {username?.charAt(0).toUpperCase()}
                        </div>
                        <button className="absolute bottom-2 right-2 p-3 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-700 text-primary-600 hover:scale-110 transition-transform">
                            <Camera size={20} />
                        </button>
                    </div>
                    <div className="flex-1 space-y-2">
                        <h1 className="text-4xl font-black text-neutral-900 dark:text-white">{username}</h1>
                        <p className="text-neutral-500 font-bold flex items-center gap-2 tracking-widest uppercase text-xs">
                            <Shield size={14} className="text-success-500" /> Verified Patient Profile
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`h-12 px-8 rounded-2xl font-black transition-all ${isEditing ? 'bg-success-500 text-white' : 'btn-primary'}`}
                    >
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </Button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="p-10 border-none shadow-soft rounded-[40px]">
                            <h3 className="text-2xl font-black mb-10 dark:text-white">Personal Information</h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-neutral-400 uppercase tracking-widest pl-1">Full Name</label>
                                    <Input defaultValue={username || ''} disabled={!isEditing} className="h-14 font-bold rounded-2xl border-neutral-100 dark:border-neutral-800" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-neutral-400 uppercase tracking-widest pl-1">Email Address</label>
                                    <Input defaultValue="mahesh@example.com" disabled={!isEditing} className="h-14 font-bold rounded-2xl border-neutral-100 dark:border-neutral-800" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-neutral-400 uppercase tracking-widest pl-1">Phone Number</label>
                                    <Input defaultValue="+91 9876543210" disabled={!isEditing} className="h-14 font-bold rounded-2xl border-neutral-100 dark:border-neutral-800" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-neutral-400 uppercase tracking-widest pl-1">Date of Birth</label>
                                    <Input type="date" defaultValue="1995-08-15" disabled={!isEditing} className="h-14 font-bold rounded-2xl border-neutral-100 dark:border-neutral-800" />
                                </div>
                            </div>
                            <div className="mt-10 space-y-3">
                                <label className="text-xs font-black text-neutral-400 uppercase tracking-widest pl-1">Address</label>
                                <Input defaultValue="Phase 2, Hinjewadi, Pune, Maharashtra" disabled={!isEditing} className="h-14 font-bold rounded-2xl border-neutral-100 dark:border-neutral-800" />
                            </div>
                        </Card>

                        <Card className="p-10 border-none shadow-soft rounded-[40px]">
                            <h3 className="text-2xl font-black mb-10 dark:text-white">Medical Context</h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="p-5 bg-primary-50 dark:bg-primary-900/10 rounded-3xl border border-primary-100 dark:border-primary-900/20">
                                    <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-1">Blood Group</p>
                                    <p className="text-2xl font-black text-primary-900 dark:text-primary-100">B+</p>
                                </div>
                                <div className="p-5 bg-error-50 dark:bg-error-900/10 rounded-3xl border border-error-100 dark:border-error-900/20">
                                    <p className="text-[10px] font-black text-error-500 uppercase tracking-widest mb-1">Allergies</p>
                                    <p className="text-lg font-black text-error-900 dark:text-error-100">Penicillin, Pollen</p>
                                </div>
                                <div className="p-5 bg-warning-50 dark:bg-warning-900/10 rounded-3xl border border-warning-100 dark:border-warning-900/20">
                                    <p className="text-[10px] font-black text-warning-500 uppercase tracking-widest mb-1">Diabetes</p>
                                    <p className="text-2xl font-black text-warning-900 dark:text-warning-100">Type II</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-8">
                        <Card className="p-8 border-none shadow-soft rounded-[40px]">
                            <h4 className="text-lg font-black mb-6 dark:text-white">Account Security</h4>
                            <div className="space-y-4">
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600">
                                            <Lock size={18} />
                                        </div>
                                        <span className="font-bold text-neutral-700 dark:text-neutral-300">Change Password</span>
                                    </div>
                                    <ChevronRight size={18} className="text-neutral-300 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-success-50 dark:bg-success-900/20 rounded-xl flex items-center justify-center text-success-600">
                                            <Shield size={18} />
                                        </div>
                                        <span className="font-bold text-neutral-700 dark:text-neutral-300">2FA Security</span>
                                    </div>
                                    <ChevronRight size={18} className="text-neutral-300 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </Card>

                        <Card className="p-8 border-none shadow-soft rounded-[40px]">
                            <h4 className="text-lg font-black mb-6 dark:text-white">Notifications</h4>
                            <div className="space-y-4 font-bold text-neutral-500 dark:text-neutral-400">
                                <div className="flex items-center justify-between">
                                    <span>Appointments</span>
                                    <div className="w-12 h-6 bg-primary-600 rounded-full flex items-center justify-end px-1 cursor-pointer">
                                        <div className="w-4 h-4 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Prescription Alerts</span>
                                    <div className="w-12 h-6 bg-primary-600 rounded-full flex items-center justify-end px-1 cursor-pointer">
                                        <div className="w-4 h-4 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Marketing</span>
                                    <div className="w-12 h-6 bg-neutral-200 dark:bg-neutral-800 rounded-full flex items-center px-1 cursor-pointer">
                                        <div className="w-4 h-4 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
