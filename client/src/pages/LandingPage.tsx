import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    Shield,
    Clock,
    Users,
    Star,
    Video,
    Calendar,
    ArrowRight,
    Stethoscope,
    Database,
    HeartPulse,
    ShieldPlus,
    Building2,
    CheckCircle
} from 'lucide-react';
import { Button } from '../components/Button';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/Card';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            {/* Hero Section - Professional Medical Design */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-teal-50 text-teal-700 font-semibold text-sm border border-teal-200">
                            <Activity size={16} />
                            <span>Trusted Healthcare Network</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                            Advanced Clinical <br />
                            <span className="text-teal-600">Care & Management</span>
                        </h1>

                        <p className="text-xl text-gray-600 font-normal max-w-xl leading-relaxed">
                            A comprehensive platform dedicated to connecting patients with specialized medical professionals. Experience secure records, streamlined appointments, and superior care coordination.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                onClick={() => navigate('/register')}
                                className="bg-teal-600 hover:bg-teal-700 text-white h-14 px-8 text-base font-semibold rounded-lg shadow-sm"
                            >
                                Access Patient Portal <ArrowRight size={20} className="ml-2" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate('/login')}
                                className="h-14 px-8 text-base rounded-lg border-gray-300 font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Provider Login
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 pt-6 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <CheckCircle size={18} className="text-emerald-600" />
                                <span>HIPAA Compliant</span>
                            </div>
                            <div className="flex items-center gap-1.5 border-l border-gray-300 pl-4">
                                <CheckCircle size={18} className="text-emerald-600" />
                                <span>24/7 Support</span>
                            </div>
                            <div className="flex items-center gap-1.5 border-l border-gray-300 pl-4">
                                <CheckCircle size={18} className="text-emerald-600" />
                                <span>Certified Specialists</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative group lg:block hidden">
                        <div className="relative z-10 grid grid-cols-2 gap-4">
                            <div className="space-y-4 pt-8">
                                <div className="p-6 bg-teal-50 rounded-2xl border border-teal-200">
                                    <Stethoscope className="w-10 h-10 text-teal-600 mb-4" />
                                    <h4 className="text-lg font-semibold mb-1">Expert Specialists</h4>
                                    <p className="text-sm text-gray-600">Consult with highly qualified medical professionals.</p>
                                </div>
                                <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                                    <Calendar className="w-10 h-10 text-gray-700 mb-4" />
                                    <h4 className="text-lg font-semibold mb-1">Streamlined Booking</h4>
                                    <p className="text-sm text-gray-600">Efficient scheduling for minimal wait times.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                                    <ShieldPlus className="w-10 h-10 text-emerald-600 mb-4" />
                                    <h4 className="text-lg font-semibold mb-1">Secure Records</h4>
                                    <p className="text-sm text-gray-600">Encrypted and private electronic medical records.</p>
                                </div>
                                <div className="p-6 bg-teal-900 rounded-2xl border border-teal-800 shadow-md transform translate-y-2">
                                    <HeartPulse className="w-10 h-10 text-rose-500 mb-4" />
                                    <h4 className="text-lg font-semibold mb-1 text-white">Emergency Care</h4>
                                    <p className="text-sm text-gray-300">Priority triage and critical response capabilities.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section - Clean and Clinical */}
            <section className="py-16 bg-teal-600">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
                    <div className="space-y-1">
                        <h3 className="text-4xl font-bold">50+</h3>
                        <p className="text-teal-100 font-medium text-sm">Clinical Departments</p>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-4xl font-bold">200+</h3>
                        <p className="text-teal-100 font-medium text-sm">Certified Specialists</p>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-4xl font-bold">100k+</h3>
                        <p className="text-teal-100 font-medium text-sm">Patients Recovered</p>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-4xl font-bold">99.9%</h3>
                        <p className="text-teal-100 font-medium text-sm">System Reliability</p>
                    </div>
                </div>
            </section>

            {/* Services / Core Values */}
            <section className="py-24 px-6 bg-gray-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-4 mb-16 max-w-3xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Setting the Standard in Healthcare</h2>
                        <p className="text-lg text-gray-600 font-normal">Our infrastructure is designed to provide seamless healthcare delivery, prioritizing patient outcomes and operational efficiency.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Clock size={28} />,
                                title: "Optimized Wait Times",
                                desc: "Advanced scheduling algorithms effectively manage patient flow, minimizing wait times and improving satisfaction.",
                                color: "text-teal-600 bg-teal-50"
                            },
                            {
                                icon: <Building2 size={28} />,
                                title: "Integrated Network",
                                desc: "A unified system linking pharmacology, diagnostics, and patient care into one cohesive medical workflow.",
                                color: "text-emerald-600 bg-emerald-50"
                            },
                            {
                                icon: <Shield size={28} />,
                                title: "Data Security",
                                desc: "Rigorous compliance with healthcare data protection standards ensures every patient record remains strictly confidential.",
                                color: "text-gray-700 bg-gray-100"
                            }
                        ].map((feat, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm">
                                <div className={`w-14 h-14 ${feat.color} rounded-lg flex items-center justify-center mb-6`}>
                                    {feat.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{feat.title}</h3>
                                <p className="text-gray-600 font-normal leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
                    <div className="col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white">
                                <Activity size={24} />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">OPDHeal</span>
                        </div>
                        <p className="text-gray-600 font-normal max-w-sm">
                            Advancing healthcare delivery through robust, secure, and professional patient management systems.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-6 uppercase text-sm tracking-wider">Institution</h4>
                        <ul className="space-y-4 text-sm font-medium text-gray-600">
                            <li><a href="#" className="hover:text-teal-600">About the Hospital</a></li>
                            <li><a href="#" className="hover:text-teal-600">Departments</a></li>
                            <li><a href="#" className="hover:text-teal-600">Careers</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-6 uppercase text-sm tracking-wider">Patient Resources</h4>
                        <ul className="space-y-4 text-sm font-medium text-gray-600">
                            <li><a href="#" className="hover:text-teal-600">Patient Portal</a></li>
                            <li><a href="#" className="hover:text-teal-600">Insurance & Billing</a></li>
                            <li><a href="#" className="hover:text-teal-600">Contact Us</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-200 text-center">
                    <p className="text-gray-500 text-sm font-medium">© {new Date().getFullYear()} OPDHeal Clinical Management System. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};
