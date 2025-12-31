import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Activity, ArrowRight, UserCircle } from 'lucide-react';
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
        // Clear error for this field
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
            // Redirect to login after successful registration
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
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-700 to-cyan-600 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-10"></div>

            <div className="w-full max-w-2xl relative animate-scale-in">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 mb-6">
                            <Activity className="w-10 h-10 text-blue-600" />
                            <span className="text-3xl font-bold text-neutral-900">OPD Heal</span>
                        </Link>
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Create Account</h1>
                        <p className="text-neutral-600">Join us to access quality healthcare services</p>
                    </div>

                    {/* Error Alert */}
                    {errors.submit && (
                        <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
                            <p className="text-error-700 text-sm">{errors.submit}</p>
                        </div>
                    )}

                    {/* Register Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                I am a
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'role', value: 'PATIENT' } } as any)}
                                    className={`p-4 rounded-lg border-2 transition-all ${formData.role === 'PATIENT'
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-neutral-200 hover:border-neutral-300'
                                        }`}
                                >
                                    <UserCircle className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                    <p className="font-semibold">Patient</p>
                                    <p className="text-xs text-neutral-500">Book appointments</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'role', value: 'DOCTOR' } } as any)}
                                    className={`p-4 rounded-lg border-2 transition-all ${formData.role === 'DOCTOR'
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-neutral-200 hover:border-neutral-300'
                                        }`}
                                >
                                    <Activity className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                    <p className="font-semibold">Doctor</p>
                                    <p className="text-xs text-neutral-500">Manage patients</p>
                                </button>
                            </div>
                        </div>

                        {/* Name Fields */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="John"
                                leftIcon={<User className="w-5 h-5" />}
                                error={errors.firstName}
                                required
                            />
                            <Input
                                label="Last Name"
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Doe"
                                leftIcon={<User className="w-5 h-5" />}
                                error={errors.lastName}
                                required
                            />
                        </div>

                        {/* Username & Email */}
                        <Input
                            label="Username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="johndoe"
                            leftIcon={<User className="w-5 h-5" />}
                            error={errors.username}
                            helperText="Must be at least 3 characters"
                            required
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            leftIcon={<Mail className="w-5 h-5" />}
                            error={errors.email}
                            required
                        />

                        {/* Password Fields */}
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a strong password"
                            leftIcon={<Lock className="w-5 h-5" />}
                            error={errors.password}
                            helperText="Min. 8 characters, with uppercase, lowercase, and number"
                            required
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setErrors(prev => ({ ...prev, confirmPassword: '' }));
                            }}
                            placeholder="Re-enter your password"
                            leftIcon={<Lock className="w-5 h-5" />}
                            error={errors.confirmPassword}
                            required
                        />

                        {/* Terms */}
                        <label className="flex items-start gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 mt-1 text-blue-600 rounded" required />
                            <span className="text-sm text-neutral-600">
                                I agree to the{' '}
                                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Privacy Policy
                                </a>
                            </span>
                        </label>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            Create Account
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-4">
                        <div className="flex-1 h-px bg-neutral-200"></div>
                        <span className="text-sm text-neutral-500">OR</span>
                        <div className="flex-1 h-px bg-neutral-200"></div>
                    </div>

                    {/* Login Link */}
                    <p className="text-center text-neutral-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Back to Home */}
                <div className="mt-6 text-center">
                    <Link to="/" className="text-white hover:text-blue-100 font-medium inline-flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};
