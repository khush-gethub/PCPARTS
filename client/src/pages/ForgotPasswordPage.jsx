import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import Navbar from '../components/Navbar.jsx';
import SubNavbar from '../components/SubNavbar.jsx';
import Footer from '../components/Footer.jsx';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const res = await api.requestPasswordReset(email);
            setSuccess(res.message);
            setStep(2);
        } catch (err) {
            setError(err.message || 'Failed to send OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const res = await api.verifyResetOtp(email, otp);
            setSuccess(res.message);
            setStep(3);
        } catch (err) {
            setError(err.message || 'Invalid or expired OTP.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
            const res = await api.resetPassword(email, otp, newPassword);
            setSuccess(res.message);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Failed to reset password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#eef2f2] flex flex-col font-sans">
            <Navbar />
            <SubNavbar />

            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100 transition-all hover:shadow-xl">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Reset Password
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            {step === 1 && "Enter your email to receive a reset OTP"}
                            {step === 2 && `An OTP has been sent to ${email}`}
                            {step === 3 && "Create a new strong password"}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                            <p className="text-sm text-green-700 font-medium">{success}</p>
                        </div>
                    )}

                    {step === 1 && (
                        <form className="mt-8 space-y-6" onSubmit={handleRequestOtp}>
                            <div>
                                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                                >
                                    {isLoading ? 'SENDING...' : 'SEND OTP'}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                                    6-Digit OTP
                                </label>
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-all text-center tracking-widest font-bold"
                                    placeholder="------"
                                    maxLength="6"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                                >
                                    {isLoading ? 'VERIFYING...' : 'VERIFY OTP'}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password
                                    </label>
                                    <input
                                        id="new-password"
                                        name="newPassword"
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-all"
                                        placeholder="••••••••"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Must be 8+ chars, with mix of cases, numbers, and symbols (*#@!$%&).</p>
                                </div>
                                <div>
                                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirm-password"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                                >
                                    {isLoading ? 'SAVING...' : 'RESET PASSWORD'}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="text-center mt-4 flex flex-col space-y-2">
                        {step !== 1 && (
                            <button onClick={() => setStep(1)} className="text-sm font-medium text-gray-500 hover:text-gray-700">
                                Start over
                            </button>
                        )}
                        <Link to="/login" className="text-sm font-medium text-orange-600 hover:text-orange-500">
                            Back to login
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ForgotPasswordPage;
