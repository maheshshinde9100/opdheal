import React from 'react';
import { 
    Clock, 
    ShieldCheck, 
    Smartphone, 
    Database, 
    Bell, 
    CreditCard 
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';

export const FeaturesPage: React.FC = () => {
    const features = [
        {
            icon: <Clock className="text-primary-600" size={32} />,
            title: "Smart Appointment Scheduling",
            description: "Advanced slot management system that reduces wait times and optimizes doctor schedules with AI-driven insights."
        },
        {
            icon: <ShieldCheck className="text-success-600" size={32} />,
            title: "Secure Health Records",
            description: "HIPAA-compliant digital storage for all your medical history, prescriptions, and lab reports."
        },
        {
            icon: <Smartphone className="text-indigo-600" size={32} />,
            title: "Mobile-First Patient Portal",
            description: "Access your healthcare dashboard from anywhere. Book appointments and view prescriptions on the go."
        },
        {
            icon: <Database className="text-warning-600" size={32} />,
            title: "Unified EMR System",
            description: "A single source of truth for patient data, accessible across different hospital departments securely."
        },
        {
            icon: <Bell className="text-error-600" size={32} />,
            title: "Real-time Notifications",
            description: "Automatic SMS and email reminders for upcoming appointments, medication schedules, and report availability."
        },
        {
            icon: <CreditCard className="text-purple-600" size={32} />,
            title: "Integrated Billing",
            description: "Seamless payment tracking and digital invoicing for consultations and treatments."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-inter">
            <Navbar />
            
            {/* Header */}
            <div className="bg-slate-900 pt-32 pb-20 px-6 border-b border-slate-800">
                <div className="max-w-7xl mx-auto space-y-8 text-center">
                    <div className="max-w-3xl mx-auto space-y-4">
                        <h1 className="text-4xl font-bold text-white tracking-tight">Clinical Infrastructure Features</h1>
                        <p className="text-lg text-slate-300 font-normal leading-relaxed">A comprehensively designed suite of tools to elevate patient care and streamline daily hospital operations.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-900/50 rounded-lg flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-700/50">
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{f.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-normal leading-relaxed">{f.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
