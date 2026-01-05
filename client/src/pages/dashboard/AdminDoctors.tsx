import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Plus,
    Trash2,
    Settings
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Input } from '../../components/Input';
import api from '../../services/api';
import type { Doctor } from '../../types';

export const AdminDoctors: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadDoctors();
    }, []);

    const loadDoctors = async () => {
        try {
            const data = await api.getAllDoctors();
            setDoctors(data);
        } catch (error) {
            console.error("Failed to load doctors", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredDoctors = doctors.filter(d =>
        d.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-8 animate-fade-in font-inter">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Doctor Management</h1>
                        <p className="text-neutral-500 font-medium italic">Authorize, manage and monitor medical staff performance.</p>
                    </div>
                    <Button className="bg-primary-600 text-white shadow-primary h-12 px-6">
                        <Plus size={20} className="mr-2" /> Add New Doctor
                    </Button>
                </div>

                {/* Search */}
                <Card className="p-2 border-neutral-100 flex flex-col md:flex-row gap-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search doctors by name or specialization..."
                            className="w-full pl-12 h-12 bg-transparent border-none focus:ring-0 font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="border-neutral-100">
                        <Filter size={20} className="mr-2" /> Active Status
                    </Button>
                </Card>

                {/* Table */}
                <Card className="p-0 overflow-hidden border-neutral-100 shadow-soft">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50/50 border-b border-neutral-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Doctor Info</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Specialization</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Experience</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 italic">
                            {isLoading ? (
                                <tr><td colSpan={5} className="text-center py-10 font-bold text-neutral-400">Fetching doctor data...</td></tr>
                            ) : filteredDoctors.length > 0 ? (
                                filteredDoctors.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center font-black">
                                                    {doc.user?.firstName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-extrabold text-neutral-900 not-italic">Dr. {doc.user?.firstName} {doc.user?.lastName}</div>
                                                    <div className="text-xs font-bold text-neutral-400">{doc.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge variant="primary" className="font-black text-[10px] tracking-widest uppercase">{doc.specialization}</Badge>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-neutral-700">{doc.experience} Years</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${doc.available ? 'bg-success-500' : 'bg-neutral-300'}`}></div>
                                                <span className="text-sm font-bold text-neutral-500">{doc.available ? 'Active' : 'Offline'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="outline" className="h-9 w-9 p-0 border-neutral-100 rounded-lg">
                                                    <Settings size={16} />
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-9 w-9 p-0 border-neutral-100 rounded-lg hover:text-error-600 hover:bg-error-50 hover:border-error-100">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={5} className="text-center py-20 font-bold text-neutral-400">No doctors found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </Card>
            </div>
        </DashboardLayout>
    );
};
