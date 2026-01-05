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
    Database
} from 'lucide-react';
import { Button } from '../components/Button';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/Card';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-500 overflow-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                {/* Background Accents */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-50/50 dark:from-primary-950/20 to-transparent -z-10 blur-3xl opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-tr from-accent-500/10 dark:from-accent-500/5 to-transparent -z-10 blur-3xl opacity-40"></div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-10 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-black text-xs uppercase tracking-widest shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                            Empowering Healthcare with AI
                        </div>

                        <h1 className="text-6xl lg:text-8xl font-black text-neutral-900 dark:text-white leading-[1.05] tracking-tighter">
                            Next-Gen <br />
                            <span className="text-primary-600 italic">OPD Management</span> <br />
                            For Smart Hospitals
                        </h1>

                        <p className="text-xl text-neutral-500 dark:text-neutral-400 font-medium max-w-xl leading-relaxed">
                            OPDHeal bridges the gap between patients and specialized care. Experience seamless booking, digital prescriptions, and secure records in one integrated platform.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5">
                            <Button
                                onClick={() => navigate('/register')}
                                className="btn-primary h-16 px-10 text-lg shadow-2xl shadow-primary/40"
                            >
                                Start Free Trial <ArrowRight size={22} className="ml-2" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-16 px-10 text-lg rounded-2xl border-neutral-200 dark:border-neutral-700 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                                Watch Demo <Video size={22} className="ml-2" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-neutral-900 bg-neutral-200 overflow-hidden shadow-md">
                                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm">
                                <div className="flex items-center gap-1 text-warning-500 mb-0.5">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <p className="font-bold text-neutral-700 dark:text-neutral-300">Loved by 2k+ Doctors and Patients</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative group lg:block hidden">
                        <div className="absolute inset-0 bg-primary-600 rounded-[60px] blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative z-10 grid grid-cols-2 gap-6">
                            <div className="space-y-6 pt-12">
                                <Card className="p-8 border-none bg-white font-poppins dark:bg-neutral-800 shadow-2xl rounded-[40px] animate-float">
                                    <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 mb-6 font-poppins">
                                        <Calendar size={28} />
                                    </div>
                                    <h4 className="text-xl font-black mb-2 dark:text-white">Smart Booking</h4>
                                    <p className="text-sm text-neutral-400 dark:text-neutral-500 font-bold">AI-powered slot management for doctors.</p>
                                </Card>
                                <Card className="p-8 border-none bg-white dark:bg-neutral-800 shadow-2xl rounded-[40px] animate-float [animation-delay:0.5s]">
                                    <div className="w-14 h-14 bg-success-50 dark:bg-success-900/10 rounded-2xl flex items-center justify-center text-success-600 mb-6">
                                        <Database size={28} />
                                    </div>
                                    <h4 className="text-xl font-black mb-2 dark:text-white">Secure EMR</h4>
                                    <p className="text-sm text-neutral-400 dark:text-neutral-500 font-bold">Encrypted medical records accessible globally.</p>
                                </Card>
                            </div>
                            <div className="space-y-6">
                                <Card className="p-8 border-none bg-white dark:bg-neutral-800 shadow-2xl rounded-[40px] animate-float [animation-delay:0.2s]">
                                    <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                                        <Stethoscope size={28} />
                                    </div>
                                    <h4 className="text-xl font-black mb-2 dark:text-white">Top Specialists</h4>
                                    <p className="text-sm text-neutral-400 dark:text-neutral-500 font-bold">Connect with verified medical experts.</p>
                                </Card>
                                <Card className="p-8 border-none bg-primary-600 text-white shadow-2xl rounded-[40px] animate-float [animation-delay:0.7s]">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6">
                                        <Shield size={28} />
                                    </div>
                                    <h4 className="text-xl font-black mb-2">HIPAA Ready</h4>
                                    <p className="text-sm text-primary-100 font-bold">Industry standard security for patient privacy.</p>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-primary-600">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center text-white">
                    <div className="space-y-2">
                        <h3 className="text-5xl font-black">99.9%</h3>
                        <p className="text-primary-100 font-bold uppercase tracking-widest text-xs">Uptime</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-5xl font-black">50k+</h3>
                        <p className="text-primary-100 font-bold uppercase tracking-widest text-xs">Patients</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-5xl font-black">1.2k+</h3>
                        <p className="text-primary-100 font-bold uppercase tracking-widest text-xs">Hospitals</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-5xl font-black">10M+</h3>
                        <p className="text-primary-100 font-bold uppercase tracking-widest text-xs">Appointments</p>
                    </div>
                </div>
            </section>

            {/* Features Detail */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-4 mb-20 max-w-3xl mx-auto">
                        <div className="text-primary-600 font-black text-sm uppercase tracking-[0.3em]">Core Values</div>
                        <h2 className="text-5xl lg:text-6xl font-black text-neutral-900 dark:text-white leading-tight">Better Healthcare, Faster Service.</h2>
                        <p className="text-lg text-neutral-500 dark:text-neutral-400 font-medium">We've reimagined every touchpoint of the patient experience to be intuitive, fast, and secure.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: <Clock size={32} />,
                                title: "Zero Wait Time",
                                desc: "Reduce hospital overcrowding with precise slot booking and virtual queuing system.",
                                color: "bg-blue-50 text-blue-600"
                            },
                            {
                                icon: <Users size={32} />,
                                title: "Staff Optimization",
                                desc: "Automatic assignment and workload balancing for nurses and administrative staff.",
                                color: "bg-success-50 text-success-600"
                            },
                            {
                                icon: <Activity size={32} />,
                                title: "Health Analytics",
                                desc: "Real-time dashboards for hospital management to track performance and patient health trends.",
                                color: "bg-warning-50 text-warning-600"
                            }
                        ].map((feat, i) => (
                            <div key={i} className="p-10 rounded-[48px] bg-white dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 hover:shadow-2xl transition-all group">
                                <div className={`w-20 h-20 ${feat.color} rounded-[32px] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform`}>
                                    {feat.icon}
                                </div>
                                <h3 className="text-2xl font-black mb-4 dark:text-white">{feat.title}</h3>
                                <p className="text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-neutral-100 dark:border-neutral-800">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
                    <div className="col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white">
                                <Activity size={24} />
                            </div>
                            <span className="text-2xl font-black text-neutral-900 dark:text-white">OPDHeal</span>
                        </div>
                        <p className="text-neutral-500 dark:text-neutral-400 font-medium max-w-sm">
                            Innovating healthcare management systems one hospital at a time. Secure, scalable, and patient-centric.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-black text-neutral-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Company</h4>
                        <ul className="space-y-4 text-sm font-bold text-neutral-500 dark:text-neutral-400">
                            <li><a href="#" className="hover:text-primary-600">About Us</a></li>
                            <li><a href="#" className="hover:text-primary-600">Careers</a></li>
                            <li><a href="#" className="hover:text-primary-600">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black text-neutral-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Connect</h4>
                        <ul className="space-y-4 text-sm font-bold text-neutral-500 dark:text-neutral-400">
                            <li><a href="#" className="hover:text-primary-600">Twitter</a></li>
                            <li><a href="#" className="hover:text-primary-600">LinkedIn</a></li>
                            <li><a href="#" className="hover:text-primary-600">Contact Support</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-neutral-100 dark:border-neutral-800 text-center">
                    <p className="text-neutral-400 text-sm font-bold">© {new Date().getFullYear()} OPDHeal Management System. Built for Advanced Healthcare.</p>
                </div>
            </footer>
        </div>
    );
};
