import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Activity, ArrowRight, UserCircle, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { validateEmail, validatePassword } from '../utils/helpers';
import api from '../services/api';
import type { RegisterRequest } from '../types';

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterRequest>({
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
        role: 'PATIENT',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        setErrors(prev => ({
            ...prev,
            [e.target.name]: '',
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.username || formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.firstName) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName) {
            newErrors.lastName = 'Last name is required';
        }

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.valid) {
            newErrors.password = passwordValidation.errors[0];
        }

        if (formData.password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await api.register(formData);
            navigate('/login', {
                state: { message: 'Registration successful! Please log in.' },
            });
        } catch (err: any) {
            setErrors({
                submit: err.message || 'Registration failed. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Left Side: Visual/Branding */}
            <div className="hidden lg:flex w-5/12 bg-teal-900 relative overflow-hidden items-center justify-center sticky top-0 h-screen">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-800 to-teal-950 opacity-95"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

                <div className="relative z-10 p-12 text-white max-w-lg">
                    <Link to="/" className="flex items-center gap-3 mb-12 group">
                        <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center shadow-md">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">OPDHeal Clinical</span>
                    </Link>

                    <h1 className="text-3xl font-bold mb-6 leading-tight">
                        Register for <span className="text-teal-400">Patient Portal</span>
                    </h1>

                    <p className="text-base text-teal-100 mb-10 leading-relaxed">
                        Create a secure account to access your medical records, book appointments, and connect with healthcare professionals.
                    </p>

                    <div className="space-y-6">
                        {[
                            { icon: <CheckCircle2 className="text-emerald-400" />, title: 'Digital Health Records', desc: 'Securely store and access your medical history anywhere.' },
                            { icon: <ShieldCheck className="text-emerald-400" />, title: 'Privacy Guaranteed', desc: 'Your data is strictly encrypted in compliance with healthcare standards.' },
                            { icon: <Heart className="text-emerald-400" />, title: 'Unified Care', desc: 'Connect with expert doctors across multiple clinical departments.' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-teal-800/50 border border-teal-700">
                                <div className="mt-1">{item.icon}</div>
                                <div>
                                    <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                                    <p className="text-sm text-teal-200 mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side: Registration Form */}
            <div className="w-full lg:w-7/12 flex flex-col items-center justify-start p-6 lg:p-12 overflow-y-auto bg-white">
                <div className="w-full max-w-xl space-y-8 py-8">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Profile Registration</h2>
                        <p className="text-gray-500 font-medium">Please provide accurate information for your record.</p>
                    </div>

                    {errors.submit && (
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
                            <p className="text-rose-600 font-bold text-sm">{errors.submit}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Role Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-900 uppercase tracking-widest pl-1">Register As</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'role', value: 'PATIENT' } } as any)}
                                    className={`relative p-4 rounded-xl border transition-colors flex flex-col items-center gap-2 group ${formData.role === 'PATIENT'
                                        ? 'border-teal-600 bg-teal-50/50'
                                        : 'border-gray-200 hover:border-teal-300'
                                        }`}
                                >
                                    <UserCircle size={28} className={formData.role === 'PATIENT' ? 'text-teal-600' : 'text-gray-400'} />
                                    <span className={`text-sm font-semibold ${formData.role === 'PATIENT' ? 'text-teal-700' : 'text-gray-500'}`}>Patient</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'role', value: 'DOCTOR' } } as any)}
                                    className={`relative p-4 rounded-xl border transition-colors flex flex-col items-center gap-2 group ${formData.role === 'DOCTOR'
                                        ? 'border-teal-600 bg-teal-50/50'
                                        : 'border-gray-200 hover:border-teal-300'
                                        }`}
                                >
                                    <Activity size={28} className={formData.role === 'DOCTOR' ? 'text-teal-600' : 'text-gray-400'} />
                                    <span className={`text-sm font-semibold ${formData.role === 'DOCTOR' ? 'text-teal-700' : 'text-gray-500'}`}>Medical Provider</span>
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <Input
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="e.g. Mahesh"
                                className="h-12 border-gray-200 focus:border-teal-500 rounded-lg"
                                error={errors.firstName}
                                required
                            />
                            <Input
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="e.g. Shinde"
                                className="h-12 border-gray-200 focus:border-teal-500 rounded-lg"
                                error={errors.lastName}
                                required
                            />
                        </div>

                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="mahesh@example.com"
                            className="h-12 border-gray-200 focus:border-teal-500 rounded-lg"
                            error={errors.email}
                            leftIcon={<Mail size={18} className="text-gray-400" />}
                            required
                        />

                        <Input
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="maheshshinde123"
                            className="h-12 border-gray-200 focus:border-teal-500 rounded-lg"
                            error={errors.username}
                            leftIcon={<User size={18} className="text-gray-400" />}
                            required
                        />

                        <div className="grid md:grid-cols-2 gap-5">
                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="h-12 border-gray-200 focus:border-teal-500 rounded-lg"
                                error={errors.password}
                                leftIcon={<Lock size={18} className="text-gray-400" />}
                                required
                            />
                            <Input
                                label="Confirm Password"
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="h-12 border-gray-200 focus:border-teal-500 rounded-lg"
                                error={errors.confirmPassword}
                                leftIcon={<Lock size={18} className="text-gray-400" />}
                                required
                            />
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-500 border border-gray-200">
                            By registering, you acknowledge and agree to the <a href="#" className="text-teal-600 font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-teal-600 font-semibold hover:underline">Privacy Policy</a> governing the use of clinical data.
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-base font-semibold shadow-sm transition-colors"
                            isLoading={isLoading}
                        >
                            Register Profile
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>

                        <p className="text-center text-gray-500 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-teal-600 font-bold hover:text-teal-700 underline-offset-4 hover:underline">
                                Log in instead
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};
