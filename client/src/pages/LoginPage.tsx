import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import api from '../services/api';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.login(formData);
            switch (response.role) {
                case 'ADMIN': navigate('/admin/dashboard'); break;
                case 'DOCTOR': navigate('/doctor/dashboard'); break;
                case 'PATIENT': navigate('/patient/dashboard'); break;
                default: navigate('/');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-inter" style={{ background: 'var(--bg-main)' }}>
            {/* Left Side: Visual/Branding */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

                <div className="relative z-10 p-16 text-white max-w-xl">
                    <Link to="/" className="flex items-center gap-3 mb-12 group">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-3xl font-bold tracking-tight">OPDHeal Clinical</span>
                    </Link>

                    <h1 className="text-4xl font-bold mb-6 leading-tight">
                        Secure Access to <br />
                        <span className="text-blue-400">Patient Management</span>
                    </h1>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-slate-800 rounded-md flex items-center justify-center flex-shrink-0 border border-slate-700">
                                <ShieldCheck className="text-blue-400" />
                            </div>
                            <p className="text-lg text-slate-300 leading-snug">
                                End-to-end encrypted medical records and communication.
                            </p>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-slate-800 rounded-md flex items-center justify-center flex-shrink-0 border border-slate-700">
                                <UserCheck className="text-blue-400" />
                            </div>
                            <p className="text-lg text-slate-300 leading-snug">
                                Strict access controls to keep health data private and HIPAA compliant.
                            </p>
                        </div>
                    </div>

                    <div className="mt-20 pt-16 border-t border-white/10">
                        <p className="text-white/60 italic">
                            "The transition to OPDHeal has reduced our administrative overhead by 40% and improved patient satisfaction significantly."
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-neutral-200"></div>
                            <div>
                                <div className="font-bold">Dr. James Wilson</div>
                                <div className="text-sm text-white/60">Chief Medical Officer</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16" style={{ background: 'var(--bg-card)' }}>
                <div className="w-full max-w-md space-y-8">
                    <div className="space-y-2">
                        <div className="lg:hidden flex justify-center mb-6">
                            <Activity className="w-10 h-10 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>System Login</h2>
                        <p className="text-base font-medium" style={{ color: 'var(--text-secondary)' }}>Please enter your credentials to authenticate.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl dark:bg-rose-900/10 dark:border-rose-900/20">
                            <p className="text-rose-600 font-medium text-sm flex items-center gap-2">
                                <Activity className="w-4 h-4" /> {error}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            <Input
                                label="Username"
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                className="h-14 border-neutral-200 focus:border-primary-500 rounded-xl"
                                required
                            />

                            <div className="space-y-3">
                                <Input
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="h-12 border-slate-300 focus:border-blue-600 rounded-lg"
                                    required
                                />
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" className="w-5 h-5 rounded-md border-neutral-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer" />
                                        <span className="text-sm text-neutral-600 group-hover:text-neutral-900 font-medium">Remember for 30 days</span>
                                    </label>
                                    <a href="#" className="text-sm font-bold text-primary-600 hover:text-primary-700">Forgot password?</a>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base font-semibold shadow-sm transition-colors"
                            isLoading={isLoading}
                        >
                            Authenticate
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t" style={{ borderColor: 'var(--border-default)' }}></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="px-4 font-semibold tracking-wider" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>New Patient?</span>
                            </div>
                        </div>

                        <Link to="/register" className="block text-center">
                            <Button variant="outline" className="w-full h-12 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-lg text-base font-semibold text-slate-700 transition-colors">
                                Register Patient Profile
                            </Button>
                        </Link>
                    </form>

                    <div className="pt-10 text-center">
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            By signing in, you agree to our <br />
                            <a href="#" className="underline font-semibold hover:text-blue-600">Terms of Service</a> and <a href="#" className="underline font-semibold hover:text-blue-600">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
