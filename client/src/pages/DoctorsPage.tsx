import React, { useState, useEffect } from 'react';
import { Search, Star, GraduationCap, Clock, Filter, Activity } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/Button';
import api from '../services/api';
import type { Doctor } from '../types';

export const DoctorsPage: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await api.getAllDoctors();
                setDoctors(data);
            } catch (error) {
                console.error("Failed to fetch doctors", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const filteredDoctors = doctors.filter(doc => 
        doc.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 font-inter pb-20">
            <Navbar />
            
            {/* Header */}
            <div className="bg-slate-900 pt-32 pb-20 px-6 border-b border-slate-800">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="max-w-3xl space-y-4">
                        <h1 className="text-4xl font-bold text-white tracking-tight">Clinical Specialists Directory</h1>
                        <p className="text-lg text-slate-300 font-normal">Connect with board-certified medical professionals across various clinical departments.</p>
                    </div>

                    <div className="relative max-w-2xl group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by physician name, specialty, or condition..."
                            className="w-full h-14 bg-slate-800 border border-slate-700 rounded-lg pl-12 pr-4 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {isLoading ? 'Loading Providers...' : `${filteredDoctors.length} Providers Available`}
                    </h2>
                    <Button variant="outline" className="rounded-lg border-slate-200 dark:border-slate-700 font-semibold text-sm h-10 px-4 text-slate-700 dark:text-slate-300">
                        <Filter size={16} className="mr-2" /> Filter Departments
                    </Button>
                </div>

                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                            <div key={num} className="h-[400px] bg-white dark:bg-neutral-800 rounded-[40px] animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDoctors.map((doc) => (
                            <div key={doc.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                                <div className="p-6 pb-4 flex flex-start items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 text-xl font-bold shrink-0 border border-blue-100 dark:border-blue-800">
                                        {doc.firstName?.charAt(0) || 'D'}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize leading-tight">Dr. {doc.firstName} {doc.lastName}</h3>
                                        <p className="text-blue-600 font-semibold text-sm mt-1">{doc.specialization}</p>
                                    </div>
                                </div>

                                <div className="px-6 py-4 border-y border-slate-100 dark:border-slate-700/50 grid grid-cols-2 gap-4 bg-slate-50/50 dark:bg-slate-800/50">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                        <Star className="text-amber-500" size={16} fill="currentColor" />
                                        <span className="font-semibold">{doc.rating?.toFixed(1) || '4.8'}</span>
                                        <span className="text-slate-400 font-normal">(120+ reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                        <Clock className="text-slate-400" size={16} />
                                        <span className="font-medium">{doc.experienceYears || '10+' } Yrs Exp</span>
                                    </div>
                                </div>

                                <div className="p-6 mt-auto space-y-5">
                                    <div className="flex items-start gap-2 text-slate-500 dark:text-slate-400 text-sm">
                                        <GraduationCap className="text-slate-400 shrink-0 mt-0.5" size={16} />
                                        <span className="line-clamp-2 leading-snug">{doc.qualification || 'Board Certified Medical Specialist'}</span>
                                    </div>
                                    <Button className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm font-semibold text-sm transition-colors">
                                        Schedule Appointment
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && filteredDoctors.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <Activity size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Physicians Found</h3>
                        <p className="text-slate-500 text-sm mt-1">Try adjusting your search criteria or filter options.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
