import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const OrderConfirmationPage = () => {
    // Generate a random order ID for effect
    const orderId = "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div className="min-h-screen bg-[#eef2f2] flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900">
            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }
                @keyframes confetti {
                    0% { transform: translateY(0) rotate(0); opacity: 1; }
                    100% { transform: translateY(500px) rotate(360deg); opacity: 0; }
                }
                .success-check {
                    animation: bounce 0.8s cubic-bezier(0.36, 0, 0.66, -0.56) infinite alternate;
                }
                @keyframes bounce {
                    from { transform: translateY(0); }
                    to { transform: translateY(-10px); }
                }
            `}</style>
            <Navbar />

            <main className="flex-grow flex items-center justify-center p-8 relative overflow-hidden">
                {/* Decorative background blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full filter blur-3xl"></div>
                </div>

                <div className="max-w-2xl w-full relative z-10 animate-scaleUp">
                    <div className="glass-card p-12 rounded-[3rem] shadow-2xl text-center space-y-8">
                        <div className="flex justify-center">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-lg shadow-green-500/20 success-check">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Order <span className="text-green-600">Confirmed!</span></h1>
                            <p className="text-gray-500 font-bold mt-2">Your hardware is on its way to your doorstep.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-8 border-y border-gray-100">
                            <div className="text-left">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Order Number</p>
                                <p className="text-lg font-black text-gray-900">{orderId}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Order Date</p>
                                <p className="text-lg font-black text-gray-900">{date}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50/50 rounded-3xl p-6 text-left space-y-4">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Delivery Summary</h3>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm flex-shrink-0">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 leading-tight">123 Gaming Street, Silicon Valley, CA 94025</p>
                                    <p className="text-xs text-gray-500 font-medium">Standard Delivery (3-5 Business Days)</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                to="/"
                                className="flex-grow py-4 bg-orange-600 text-white text-sm font-black rounded-2xl hover:bg-orange-700 hover:shadow-xl transition-all tracking-widest uppercase text-center"
                            >
                                Back to Home
                            </Link>
                            <Link
                                to="/profile"
                                className="flex-grow py-4 bg-white text-gray-900 text-sm font-black rounded-2xl hover:bg-gray-50 border-2 border-gray-100 transition-all tracking-widest uppercase text-center"
                            >
                                View Order status
                            </Link>
                        </div>

                        <p className="text-xs text-gray-400 font-bold">A confirmation email has been sent to your registered address.</p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default OrderConfirmationPage;
