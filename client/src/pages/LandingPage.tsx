import React from 'react';
import { Link } from 'react-router-dom';
import {
    Activity,
    Calendar,
    Users,
    FileText,
    Shield,
    Clock,
    Star,
    ArrowRight,
    Heart,
    Stethoscope,
    Pill,
    Wallet
} from 'lucide-react';
import { Button } from '../components/Button';

export const LandingPage: React.FC = () => {
    const features = [
        {
            icon: <Calendar className="w-8 h-8" />,
            title: 'Easy Appointment Booking',
            description: 'Schedule appointments with your preferred doctors in just a few clicks',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: <FileText className="w-8 h-8" />,
            title: 'Digital Medical Records',
            description: 'Access your complete medical history anytime, anywhere',
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: <Pill className="w-8 h-8" />,
            title: 'E-Prescriptions',
            description: 'Get digital prescriptions and medication reminders',
            color: 'from-green-500 to-emerald-500',
        },
        {
            icon: <Wallet className="w-8 h-8" />,
            title: 'Online Billing',
            description: 'Pay bills online and track your medical expenses',
            color: 'from-orange-500 to-red-500',
        },
    ];

    const benefits = [
        { icon: <Clock />, text: 'Save Time with Quick Bookings' },
        { icon: <Shield />, text: 'Secure & Private Platform' },
        { icon: <Users />, text: 'Expert Doctors Available' },
        { icon: <Star />, text: 'Trusted by Thousands' },
    ];

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-10"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="animate-slide-left">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                                <Heart className="w-4 h-4 text-red-300 fill-red-300" />
                                <span className="text-sm font-medium">Your Health, Our Priority</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                                Modern Healthcare
                                <span className="block bg-gradient-to-r from-cyan-300 to-blue-200 text-transparent bg-clip-text">
                                    Management System
                                </span>
                            </h1>
                            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                                Experience seamless healthcare with our comprehensive OPD management platform.
                                Book appointments, access medical records, and manage your health all in one place.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/register">
                                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl">
                                        Get Started
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                                        Sign In
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="relative animate-slide-right">
                            <div className="relative z-10">
                                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl animate-float">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                                            <Activity className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-blue-100 text-sm">Health Dashboard</p>
                                            <p className="text-white font-bold">Quick Access</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {['Appointments', 'Medical Records', 'Prescriptions', 'Billing'].map((item, i) => (
                                            <div key={i} className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
                                                <span className="text-white font-medium">{item}</span>
                                                <ArrowRight className="w-4 h-4 text-blue-200" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-6 -right-6 w-72 h-72 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-30"></div>
                            <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full blur-3xl opacity-30"></div>
                        </div>
                    </div>
                </div>

                {/* Wave SVG */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#fafafa" />
                    </svg>
                </div>
            </section>

            {/* Benefits Bar */}
            <section className="py-12 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    {React.cloneElement(benefit.icon, { className: 'w-5 h-5 text-white' })}
                                </div>
                                <p className="font-medium text-neutral-700 text-sm">{benefit.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 animate-slide-up">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                                Powerful Features
                            </span>
                        </h2>
                        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                            Everything you need to manage your healthcare journey efficiently
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-neutral-100 animate-slide-up hover:-translate-y-2"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    {React.cloneElement(feature.icon, { className: 'w-8 h-8 text-white' })}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-neutral-900">{feature.title}</h3>
                                <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Stethoscope className="w-16 h-16 mx-auto mb-6 animate-float" />
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Transform Your Healthcare Experience?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of patients who trust our platform for their health management
                    </p>
                    <Link to="/register">
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl">
                            Create Free Account
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-neutral-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Activity className="w-8 h-8 text-blue-400" />
                                <span className="text-2xl font-bold">OPD Heal</span>
                            </div>
                            <p className="text-neutral-400">
                                Modern healthcare management at your fingertips
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-neutral-400">
                                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Doctors</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Support</h4>
                            <ul className="space-y-2 text-neutral-400">
                                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Contact</h4>
                            <p className="text-neutral-400">
                                Email: support@opdheal.com<br />
                                Phone: +91 1234567890
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-neutral-800 pt-8 text-center text-neutral-400">
                        <p>&copy; 2025 OPD Heal. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
