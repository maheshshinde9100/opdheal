import React from 'react';
import {
    Shield,
    Database,
    Server,
    Key,
    ChevronRight,
    Users,
    Activity,
    Lock
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export const AdminSettings: React.FC = () => {
    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-10 animate-fade-in font-poppins">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-neutral-900 dark:text-white leading-tight">Master Control Panel</h1>
                    <p className="text-neutral-500 font-bold">System-wide configuration, security protocols and database management.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                    {/* System Configuration */}
                    <Card className="p-10 border-none shadow-soft rounded-[40px]">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600">
                                <Server size={24} />
                            </div>
                            <h3 className="text-2xl font-black dark:text-white">System Infrastructure</h3>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center justify-between group cursor-pointer">
                                <div>
                                    <p className="font-black text-neutral-800 dark:text-neutral-200">Maintenance Mode</p>
                                    <p className="text-sm font-bold text-neutral-400">Lock system for scheduled updates</p>
                                </div>
                                <div className="w-14 h-7 bg-neutral-200 dark:bg-neutral-800 rounded-full flex items-center p-1 cursor-pointer">
                                    <div className="w-5 h-5 bg-white rounded-full shadow-md"></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between group cursor-pointer">
                                <div>
                                    <p className="font-black text-neutral-800 dark:text-neutral-200">API Gateway</p>
                                    <p className="text-sm font-bold text-neutral-400">Manage v1/v2 endpoint traffic</p>
                                </div>
                                <div className="flex items-center gap-2 text-success-600 font-bold">
                                    <Activity size={18} />
                                    <span>Stable</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between group cursor-pointer">
                                <div>
                                    <p className="font-black text-neutral-800 dark:text-neutral-200">Storage Cluster</p>
                                    <p className="text-sm font-bold text-neutral-400">84% Capacity utilized (SSD-1)</p>
                                </div>
                                <ChevronRight size={20} className="text-neutral-300 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Card>

                    {/* Security Management */}
                    <Card className="p-10 border-none shadow-soft rounded-[40px]">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-2xl font-black dark:text-white">Global Security</h3>
                        </div>

                        <div className="space-y-6">
                            <Button variant="outline" className="w-full h-16 justify-between px-6 border-neutral-100 dark:border-neutral-800 rounded-[24px] group">
                                <div className="flex items-center gap-4">
                                    <Lock size={20} className="text-primary-500" />
                                    <span className="font-black">IP Whitelisting</span>
                                </div>
                                <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">Active</span>
                            </Button>

                            <Button variant="outline" className="w-full h-16 justify-between px-6 border-neutral-100 dark:border-neutral-800 rounded-[24px] group">
                                <div className="flex items-center gap-4">
                                    <Key size={20} className="text-primary-500" />
                                    <span className="font-black">Secret Keys Rotation</span>
                                </div>
                                <ChevronRight size={20} className="text-neutral-300 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </Card>

                    {/* User Permissions */}
                    <Card className="p-10 border-none shadow-soft rounded-[40px]">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-success-50 dark:bg-success-900/20 rounded-2xl flex items-center justify-center text-success-600">
                                <Users size={24} />
                            </div>
                            <h3 className="text-2xl font-black dark:text-white">Role Hierarchy</h3>
                        </div>
                        <div className="space-y-4 font-bold text-neutral-500 dark:text-neutral-400">
                            {[
                                { role: 'Root Admin', level: 'Level 1', color: 'text-primary-600' },
                                { role: 'Hospital Admin', level: 'Level 2', color: 'text-success-600' },
                                { role: 'Support Agent', level: 'Level 3', color: 'text-warning-600' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl">
                                    <span className="text-neutral-900 dark:text-white">{item.role}</span>
                                    <Badge className={`${item.color} bg-white dark:bg-neutral-800 font-black`}>{item.level}</Badge>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Data Recovery */}
                    <Card className="p-10 border-none bg-neutral-50 dark:bg-neutral-800/50 rounded-[40px] border border-neutral-100 dark:border-neutral-800/50">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-neutral-500">
                                <Database size={24} />
                            </div>
                            <h3 className="text-2xl font-black dark:text-white">Backup Registry</h3>
                        </div>
                        <p className="font-bold text-neutral-400 mb-8 leading-relaxed">
                            Daily automated backups are stored on encrypted AWS S3 clusters. Last successful backup: 2 hours ago.
                        </p>
                        <Button className="w-full h-16 btn-primary rounded-2xl font-black">
                            Initialize Manual Backup
                        </Button>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};
