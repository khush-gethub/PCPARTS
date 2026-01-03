import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const RegisterPage = () => {
    return (
        <div className="min-h-screen bg-[#eef2f2] flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900">
            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slideIn {
                    animation: slideIn 0.6s ease-out forwards;
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }
            `}</style>
            <Navbar />

            <main className="flex-grow flex items-center justify-center p-8 sm:p-12 relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/3 -right-20 w-96 h-96 bg-orange-500/10 rounded-full filter blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/3 -left-20 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="max-w-md w-full animate-slideIn relative z-10 py-8">
                    <div className="glass-card p-10 rounded-3xl shadow-2xl space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-black text-gray-900 mb-2">Create Account</h2>
                            <p className="text-gray-500 font-medium text-sm">Join our community of PC enthusiasts</p>
                        </div>

                        {/* Social Registration */}
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm text-gray-700 shadow-sm active:scale-95">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.288 1.288-3.312 2.32-6.504 2.32-5.24 0-9.44-4.24-9.44-9.44s4.2-9.44 9.44-9.44c2.84 0 4.944 1.112 6.44 2.52l1.968-1.968C18.224 1.144 15.656 0 12.48 0 6.48 0 1.6 4.88 1.6 10.8s4.88 10.8 10.88 10.8c3.256 0 5.72-1.072 7.648-3.088 2-2 2.656-4.792 2.656-7.144 0-.68-.048-1.32-.144-1.92h-10.16z" fill="#4285F4" />
                                </svg>
                                <span>Google</span>
                            </button>
                            <button className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm text-gray-700 shadow-sm active:scale-95">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                <span>GitHub</span>
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white/50 px-4 text-gray-400 font-bold backdrop-blur-sm">Or register with email</span>
                            </div>
                        </div>

                        <form className="space-y-5" action="#" method="POST">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-5 py-4 bg-white/50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-gray-900 font-medium shadow-sm"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-5 py-4 bg-white/50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-gray-900 font-medium shadow-sm"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-5 py-4 bg-white/50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-gray-900 font-medium shadow-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex items-start ml-1">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 mt-1 text-orange-600 focus:ring-orange-500 border-gray-300 rounded cursor-pointer"
                                />
                                <label htmlFor="terms" className="ml-2 block text-sm text-gray-600 font-medium cursor-pointer leading-tight">
                                    I agree to the <Link to="/terms" className="text-orange-600 hover:underline">Terms</Link> and <Link to="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-orange-600 text-white text-sm font-black rounded-2xl hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-500/30 transition-all transform active:scale-[0.98] tracking-widest uppercase"
                            >
                                Register Account
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-500 font-medium">
                            Already a member?{' '}
                            <Link to="/login" className="text-orange-600 font-black hover:underline underline-offset-4 tracking-tight">
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default RegisterPage;

