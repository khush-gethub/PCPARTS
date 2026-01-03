import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const ForgotPasswordPage = () => {
    return (
        <div className="min-h-screen bg-[#eef2f2] flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100 transition-all hover:shadow-xl">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Reset Password
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Enter your email to receive a reset link
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" action="#" method="POST">
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
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm transition-all"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                SEND RESET LINK
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-4">
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
