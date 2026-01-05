import React from 'react';
import {
    Stethoscope,
    Smartphone,
    Lock,
    Bell,
    ShieldCheck,
    ChevronRight,
    Clock,
    FileText
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export const DoctorSettings: React.FC = () => {
    return (
        <DashboardLayout role="DOCTOR">
            <div className="space-y-10 animate-fade-in font-poppins">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-neutral-900 dark:text-white leading-tight">Clinical Preferences</h1>
                    <p className="text-neutral-500 font-bold">Customize your digital practice environment and security parameters.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                    {/* Practice Management */}
                    <Card className="p-10 border-none shadow-soft rounded-[40px]">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600">
                                <Stethoscope size={24} />
                            </div>
                            <h3 className="text-2xl font-black dark:text-white">Practice Settings</h3>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div>
                                    <p className="font-black text-neutral-800 dark:text-neutral-200">Consultation Fee</p>
                                    <p className="text-sm font-bold text-neutral-400">Manage your base and follow-up rates</p>
                                </div>
                                <div className="text-primary-600 font-black text-lg">₹ 500</div>
                            </div>

                            <div className="flex items-center justify-between group cursor-pointer">
                                <div>
                                    <p className="font-black text-neutral-800 dark:text-neutral-200">E-Signature</p>
                                    <p className="text-sm font-bold text-neutral-400">Verify prescriptions with digital signature</p>
                                </div>
                                <div className="flex items-center gap-2 text-success-600 font-bold">
                                    <ShieldCheck size={18} />
                                    <span>Active</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between group cursor-pointer">
                                <div>
                                    <p className="font-black text-neutral-800 dark:text-neutral-200">Prescription Template</p>
                                    <p className="text-sm font-bold text-neutral-400">Customize header/footer of digital slips</p>
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
                            <h3 className="text-2xl font-black dark:text-white">Clinical Notifications</h3>
                        </div>

                        <div className="space-y-8">
                            {[
                                { title: 'Emergency Alerts', desc: 'Critical priority patient requests', active: true },
                                { title: 'Slot Updates', desc: 'Real-time booking and cancellations', active: true },
                                { title: 'Patient Inquiries', desc: 'Direct messages from follow-ups', active: false }
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

                    {/* Operational Settings */}
                    <Card className="p-10 border-none shadow-soft rounded-[40px]">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600">
                                <Clock size={24} />
                            </div>
                            <h3 className="text-2xl font-black dark:text-white">Workflow</h3>
                        </div>

                        <div className="space-y-6">
                            <Button variant="outline" className="w-full h-16 justify-between px-6 border-neutral-100 dark:border-neutral-800 rounded-[24px] group">
                                <div className="flex items-center gap-4">
                                    <Lock size={20} className="text-primary-500" />
                                    <span className="font-black">Security Passcode</span>
                                </div>
                                <ChevronRight size={20} className="text-neutral-300 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            <Button variant="outline" className="w-full h-16 justify-between px-6 border-neutral-100 dark:border-neutral-800 rounded-[24px] group">
                                <div className="flex items-center gap-4">
                                    <FileText size={20} className="text-primary-500" />
                                    <span className="font-black">Auto-Archive Delay</span>
                                </div>
                                <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">30 Days</span>
                            </Button>
                        </div>
                    </Card>

                    {/* System Maintenance */}
                    <Card className="p-10 border-none bg-neutral-50 dark:bg-neutral-800/50 rounded-[40px] border border-neutral-100 dark:border-neutral-800/50">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-neutral-500">
                                <Smartphone size={24} />
                            </div>
                            <h3 className="text-2xl font-black dark:text-white">Sync Status</h3>
                        </div>
                        <div className="space-y-6 mb-10">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-neutral-400">Last Database Sync</span>
                                <span className="text-neutral-700 dark:text-neutral-300">Today, 10:45 AM</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-neutral-400">App Version</span>
                                <span className="text-neutral-700 dark:text-neutral-300">v2.4.0-hospital-edition</span>
                            </div>
                        </div>
                        <Button className="w-full h-16 btn-primary rounded-2xl">
                            Force System Refresh
                        </Button>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};
