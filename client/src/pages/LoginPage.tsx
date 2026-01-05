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
        <div className="min-h-screen flex bg-white font-inter">
            {/* Left Side: Visual/Branding */}
            <div className="hidden lg:flex w-1/2 bg-primary-600 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-indigo-900 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

                {/* Decorative Blobs */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary-400 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 opacity-30"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 opacity-30"></div>

                <div className="relative z-10 p-16 text-white max-w-xl">
                    <Link to="/" className="flex items-center gap-3 mb-12 group">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-xl">
                            <Activity className="w-8 h-8 text-primary-600" />
                        </div>
                        <span className="text-4xl font-extrabold tracking-tight">OPDHeal</span>
                    </Link>

                    <h1 className="text-5xl font-bold mb-8 leading-tight">
                        Secure Access to <br />
                        <span className="text-primary-200">Modern Healthcare</span>
                    </h1>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-md border border-white/20">
                                <ShieldCheck className="text-primary-200" />
                            </div>
                            <p className="text-lg text-primary-50 leading-snug">
                                End-to-end encrypted medical records and communication.
                            </p>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-md border border-white/20">
                                <UserCheck className="text-primary-200" />
                            </div>
                            <p className="text-lg text-primary-50 leading-snug">
                                Multi-factor authentication to keep your health data private.
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
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md space-y-10 animate-fade-in">
                    <div className="space-y-4">
                        <div className="lg:hidden flex justify-center mb-8">
                            <Activity className="w-12 h-12 text-primary-600" />
                        </div>
                        <h2 className="text-4xl font-extrabold text-neutral-900 tracking-tight">Welcome Back</h2>
                        <p className="text-lg text-neutral-500">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-error-50 border border-error-100 rounded-xl animate-shake">
                            <p className="text-error-600 font-medium text-sm flex items-center gap-2">
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

                            <div className="space-y-2">
                                <Input
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="h-14 border-neutral-200 focus:border-primary-500 rounded-xl"
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
                            className="w-full h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-lg font-bold shadow-primary transition-all active:scale-[0.98]"
                            isLoading={isLoading}
                        >
                            Sign In To Account
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-neutral-100"></div>
                            </div>
                            <div className="relative flex justify-center text-sm uppercase">
                                <span className="bg-white px-4 text-neutral-400 font-bold">New to OPDHeal?</span>
                            </div>
                        </div>

                        <Link to="/register" className="block text-center">
                            <Button variant="outline" className="w-full h-14 border-2 border-neutral-200 hover:border-primary-500 rounded-xl text-lg font-bold text-neutral-700 hover:text-primary-600 transition-all">
                                Create an Account
                            </Button>
                        </Link>
                    </form>

                    <div className="pt-10 text-center">
                        <p className="text-neutral-400 text-sm">
                            By signing in, you agree to our <br />
                            <a href="#" className="underline font-bold hover:text-neutral-900">Terms of Service</a> and <a href="#" className="underline font-bold hover:text-neutral-900">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
