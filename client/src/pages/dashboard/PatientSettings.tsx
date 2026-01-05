import React from 'react';
import {
    Settings as SettingsIcon,
    Bell,
    Shield,
    Smartphone,
    Globe,
    Trash2,
    ChevronRight,
    Lock
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export const PatientSettings: React.FC = () => {
    return (
        <DashboardLayout role="PATIENT">
            <div className="space-y-10 animate-fade-in font-poppins">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-neutral-900 dark:text-white">System Settings</h1>
                    <p className="text-neutral-500 font-bold">Configure your preferences and manage your account security.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                    {/* General Settings */}
                    <Card className="p-10 border-none shadow-soft rounded-[40px]">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600">
                                <SettingsIcon size={24} />
                            </div>
                            <h3 className="text-2xl font-black dark:text-white">Preferences</h3>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div>
                                    <p className="font-black text-neutral-800 dark:text-neutral-200">System Theme</p>
                                    <p className="text-sm font-bold text-neutral-400">Light, Dark or Auto sync with OS</p>
                                </div>
                                <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-xl">
                                    <button className="px-4 py-2 bg-white dark:bg-neutral-700 rounded-lg shadow-sm font-black text-xs">Auto</button>
                                    <button className="px-4 py-2 font-black text-neutral-400 text-xs">Custom</button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between group cursor-pointer">
                                <div>
                                    <p className="font-black text-neutral-800 dark:text-neutral-200">Default Language</p>
                                    <p className="text-sm font-bold text-neutral-400">Used for reports and prescriptions</p>
                                </div>
                                <div className="flex items-center gap-2 text-primary-600 font-bold">
                                    <Globe size={18} />
                                    <span>English (US)</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between group cursor-pointer">
                                <div>
                                    <p className="font-black text-neutral-800 dark:text-neutral-200">Timezone</p>
                                    <p className="text-sm font-bold text-neutral-400">GMT+05:30 (IST)</p>
                                </div>
                                <ChevronRight size={20} className="text-neutral-300 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Card>

                    {/* Notification Settings */}
                    <Card className="p-10 border-none shadow-soft rounded-[40px]">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-warning-50 dark:bg-warning-900/20 rounded-2xl flex items-center justify-center text-warning-600">
                                <Bell size={24} />
                            </div>
                            <h3 className="text-2xl font-black dark:text-white">Alerts & Notifications</h3>
                        </div>

                        <div className="space-y-8">
                            {[
                                { title: 'Email Alerts', desc: 'Critical prescription & billing updates', active: true },
                                { title: 'SMS Notifications', desc: 'Appointment reminders & check-ins', active: true },
                                { title: 'Marketing', desc: 'Newsletter and platform updates', active: false }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-black text-neutral-800 dark:text-neutral-200">{item.title}</p>
                                        <p className="text-sm font-bold text-neutral-400">{item.desc}</p>
                                    </div>
                                    <div className={`w-14 h-7 rounded-full flex items-center p-1 cursor-pointer transition-colors ${item.active ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-800'}`}>
                                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${item.active ? 'translate-x-7' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Security Settings */}
                    <Card className="p-10 border-none shadow-soft rounded-[40px]">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-success-50 dark:bg-success-900/20 rounded-2xl flex items-center justify-center text-success-600">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-2xl font-black dark:text-white">Security & Access</h3>
                        </div>

                        <div className="space-y-6">
                            <Button variant="outline" className="w-full h-16 justify-between px-6 border-neutral-100 dark:border-neutral-800 rounded-[24px] group">
                                <div className="flex items-center gap-4">
                                    <Lock size={20} className="text-primary-500" />
                                    <span className="font-black">Change Security Password</span>
                                </div>
                                <ChevronRight size={20} className="text-neutral-300 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            <Button variant="outline" className="w-full h-16 justify-between px-6 border-neutral-100 dark:border-neutral-800 rounded-[24px] group">
                                <div className="flex items-center gap-4">
                                    <Smartphone size={20} className="text-primary-500" />
                                    <span className="font-black">Manage Devices</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="bg-success-500 w-2 h-2 rounded-full"></span>
                                    <span className="text-xs font-black text-neutral-400">2 Active</span>
                                </div>
                            </Button>
                        </div>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="p-10 border-none bg-error-50/30 dark:bg-error-950/10 rounded-[40px] border border-error-100 dark:border-error-900/20">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-error-100 dark:bg-error-900/30 rounded-2xl flex items-center justify-center text-error-600">
                                <Trash2 size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-error-900 dark:text-error-100">Danger Zone</h3>
                        </div>
                        <p className="font-bold text-error-800 dark:text-error-400/80 mb-10 leading-relaxed">
                            Deleting your account is permanent. All your medical history, prescriptions, and billing data will be wiped from our secure servers.
                        </p>
                        <Button className="w-full h-16 bg-error-600 text-white font-black rounded-2xl hover:bg-error-700 shadow-xl shadow-error-500/20">
                            Purge My Account
                        </Button>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};
