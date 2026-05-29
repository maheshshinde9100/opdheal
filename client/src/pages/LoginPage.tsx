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
        <div className="min-h-screen flex font-sans bg-gray-50">
            {/* Left Side: Visual/Branding */}
            <div className="hidden lg:flex w-1/2 bg-teal-900 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-800 to-teal-950 opacity-90"></div>

                <div className="relative z-10 p-16 text-white max-w-xl">
                    <Link to="/" className="flex items-center gap-3 mb-12 group">
                        <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center shadow-md">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-3xl font-bold tracking-tight">OPDHeal Clinical</span>
                    </Link>

                    <h1 className="text-4xl font-bold mb-6 leading-tight">
                        Secure Access to <br />
                        <span className="text-teal-400">Patient Management</span>
                    </h1>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-teal-800 rounded-md flex items-center justify-center flex-shrink-0 border border-teal-700">
                                <ShieldCheck className="text-teal-400" />
                            </div>
                            <p className="text-lg text-teal-100 leading-snug">
                                End-to-end encrypted medical records and communication.
                            </p>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-teal-800 rounded-md flex items-center justify-center flex-shrink-0 border border-teal-700">
                                <UserCheck className="text-teal-400" />
                            </div>
                            <p className="text-lg text-teal-100 leading-snug">
                                Strict access controls to keep health data private and HIPAA compliant.
                            </p>
                        </div>
                    </div>

                    <div className="mt-20 pt-16 border-t border-white/10">
                        <p className="text-white/60 italic">
                            "The transition to OPDHeal has reduced our administrative overhead by 40% and improved patient satisfaction significantly."
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                            <div>
                                <div className="font-semibold">Dr. James Wilson</div>
                                <div className="text-sm text-white/60">Chief Medical Officer</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="space-y-2">
                        <div className="lg:hidden flex justify-center mb-6">
                            <Activity className="w-10 h-10 text-teal-600" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">System Login</h2>
                        <p className="text-base font-medium text-gray-600">Please enter your credentials to authenticate.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
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
                                className="h-14 border-gray-200 focus:border-teal-500 rounded-lg"
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
                                    className="h-14 border-gray-300 focus:border-teal-600 rounded-lg"
                                    required
                                />
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" className="w-5 h-5 rounded-md border-gray-300 text-teal-600 focus:ring-teal-500 transition-all cursor-pointer" />
                                        <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">Remember for 30 days</span>
                                    </label>
                                    <a href="#" className="text-sm font-semibold text-teal-600 hover:text-teal-700">Forgot password?</a>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-base font-semibold shadow-sm transition-colors"
                            isLoading={isLoading}
                        >
                            Authenticate
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="px-4 font-semibold tracking-wider bg-white text-gray-500">New Patient?</span>
                            </div>
                        </div>

                        <Link to="/register" className="block text-center">
                            <Button variant="outline" className="w-full h-12 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg text-base font-semibold text-gray-700 transition-colors">
                                Register Patient Profile
                            </Button>
                        </Link>
                    </form>

                    <div className="pt-10 text-center">
                        <p className="text-sm text-gray-500">
                            By signing in, you agree to our <br />
                            <a href="#" className="underline font-semibold hover:text-teal-600">Terms of Service</a> and <a href="#" className="underline font-semibold hover:text-teal-600">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
