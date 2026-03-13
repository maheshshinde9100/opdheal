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
        <div className="min-h-screen flex bg-white font-inter">
            {/* Left Side: Visual/Branding */}
            <div className="hidden lg:flex w-5/12 bg-primary-600 relative overflow-hidden items-center justify-center sticky top-0 h-screen">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-indigo-900 opacity-95"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

                <div className="relative z-10 p-12 text-white max-w-lg">
                    <Link to="/" className="flex items-center gap-3 mb-12 group">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg">
                            <Activity className="w-6 h-6 text-primary-600" />
                        </div>
                        <span className="text-3xl font-extrabold tracking-tight">OPDHeal</span>
                    </Link>

                    <h1 className="text-4xl font-bold mb-6 leading-tight">
                        Start Your <span className="text-primary-200">Health Journey</span> Today
                    </h1>

                    <p className="text-lg text-primary-100 mb-10 leading-relaxed">
                        Join over 10,000+ patients and doctors using OPDHeal for more efficient and modern healthcare.
                    </p>

                    <div className="space-y-6">
                        {[
                            { icon: <CheckCircle2 className="text-success-400" />, title: 'Digital Health Records', desc: 'Securely store and access your medical history anywhere.' },
                            { icon: <ShieldCheck className="text-success-400" />, title: 'Privacy Guaranteed', desc: 'Your data is encrypted and only accessible by you and your doctor.' },
                            { icon: <Heart className="text-success-400" />, title: 'Unified Care', desc: 'Connect with expert doctors across multiple specializations.' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                                <div className="mt-1">{item.icon}</div>
                                <div>
                                    <h3 className="font-bold text-white text-base">{item.title}</h3>
                                    <p className="text-sm text-primary-100/70">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side: Registration Form */}
            <div className="w-full lg:w-7/12 flex flex-col items-center justify-start p-6 lg:p-12 overflow-y-auto">
                <div className="w-full max-w-xl space-y-8 py-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Create an Account</h2>
                        <p className="text-neutral-500 font-medium italic">Fill in your information to get started.</p>
                    </div>

                    {errors.submit && (
                        <div className="p-4 bg-error-50 border border-error-100 rounded-xl animate-shake">
                            <p className="text-error-600 font-bold text-sm">{errors.submit}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Role Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-neutral-900 uppercase tracking-widest pl-1">Register As</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'role', value: 'PATIENT' } } as any)}
                                    className={`relative p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${formData.role === 'PATIENT'
                                        ? 'border-primary-600 bg-primary-50 ring-4 ring-primary-50'
                                        : 'border-neutral-100 hover:border-primary-200'
                                        }`}
                                >
                                    <UserCircle size={32} className={formData.role === 'PATIENT' ? 'text-primary-600' : 'text-neutral-400 group-hover:text-primary-400'} />
                                    <span className={`font-bold ${formData.role === 'PATIENT' ? 'text-primary-700' : 'text-neutral-500'}`}>Patient</span>
                                    {formData.role === 'PATIENT' && <div className="absolute top-2 right-2 w-2 h-2 bg-primary-600 rounded-full"></div>}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'role', value: 'DOCTOR' } } as any)}
                                    className={`relative p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${formData.role === 'DOCTOR'
                                        ? 'border-primary-600 bg-primary-50 ring-4 ring-primary-50'
                                        : 'border-neutral-100 hover:border-primary-200'
                                        }`}
                                >
                                    <Activity size={32} className={formData.role === 'DOCTOR' ? 'text-primary-600' : 'text-neutral-400 group-hover:text-primary-400'} />
                                    <span className={`font-bold ${formData.role === 'DOCTOR' ? 'text-primary-700' : 'text-neutral-500'}`}>Doctor</span>
                                    {formData.role === 'DOCTOR' && <div className="absolute top-2 right-2 w-2 h-2 bg-primary-600 rounded-full"></div>}
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
                                className="h-12 rounded-xl"
                                error={errors.firstName}
                                required
                            />
                            <Input
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="e.g. Shinde"
                                className="h-12 rounded-xl"
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
                            className="h-12 rounded-xl"
                            error={errors.email}
                            leftIcon={<Mail size={18} className="text-neutral-400" />}
                            required
                        />

                        <Input
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="maheshshinde123"
                            className="h-12 rounded-xl"
                            error={errors.username}
                            leftIcon={<User size={18} className="text-neutral-400" />}
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
                                className="h-12 rounded-xl"
                                error={errors.password}
                                leftIcon={<Lock size={18} className="text-neutral-400" />}
                                required
                            />
                            <Input
                                label="Confirm Password"
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="h-12 rounded-xl"
                                error={errors.confirmPassword}
                                leftIcon={<Lock size={18} className="text-neutral-400" />}
                                required
                            />
                        </div>

                        <div className="bg-neutral-50 p-4 rounded-2xl text-xs text-neutral-500 font-medium">
                            By clicking register, you agree to our <a href="#" className="text-primary-600 font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-primary-600 font-bold hover:underline">Privacy Policy</a>.
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-lg font-bold shadow-primary transition-all active:scale-[0.98]"
                            isLoading={isLoading}
                        >
                            Complete Registration
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>

                        <p className="text-center text-neutral-500 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 underline-offset-4 hover:underline">
                                Log in instead
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};
