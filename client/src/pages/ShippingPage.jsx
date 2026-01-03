import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import SubNavbar from '../components/SubNavbar.jsx';
import Footer from '../components/Footer.jsx';

const ShippingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#eef2f2] flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900">
            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }
                @keyframes slideRight {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-slideRight {
                    animation: slideRight 0.5s ease-out forwards;
                }
            `}</style>
            <Navbar />
            <SubNavbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="flex flex-col lg:flex-row gap-8 animate-slideRight">
                    {/* Shipping Form */}
                    <div className="lg:w-2/3 space-y-6">
                        <div className="flex items-center gap-4 mb-4">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Shipping <span className="text-orange-600">Details</span></h1>
                        </div>

                        <div className="glass-card p-10 rounded-3xl shadow-xl space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                                    <input type="text" placeholder="John" className="w-full px-5 py-4 bg-white/50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-900 shadow-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                                    <input type="text" placeholder="Doe" className="w-full px-5 py-4 bg-white/50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-900 shadow-sm" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Address</label>
                                    <input type="text" placeholder="123 Gaming Street" className="w-full px-5 py-4 bg-white/50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-900 shadow-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                                    <input type="text" placeholder="Silicon Valley" className="w-full px-5 py-4 bg-white/50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-900 shadow-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">State</label>
                                        <input type="text" placeholder="CA" className="w-full px-5 py-4 bg-white/50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-900 shadow-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">ZIP Code</label>
                                        <input type="text" placeholder="94025" className="w-full px-5 py-4 bg-white/50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-900 shadow-sm" />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input type="tel" placeholder="+1 (555) 000-0000" className="w-full px-5 py-4 bg-white/50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-900 shadow-sm" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest ml-1">Shipping Method</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label className="relative flex p-6 rounded-2xl border-2 border-orange-500/10 cursor-pointer bg-white/50 hover:bg-white transition-all peer-checked:border-orange-500 has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50/10">
                                        <input type="radio" name="shipping" className="sr-only" defaultChecked />
                                        <div className="flex-grow">
                                            <p className="font-black text-gray-900">Standard Delivery</p>
                                            <p className="text-xs text-gray-500 font-bold">3-5 business days</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-orange-600">Free</p>
                                        </div>
                                    </label>
                                    <label className="relative flex p-6 rounded-2xl border-2 border-orange-500/10 cursor-pointer bg-white/50 hover:bg-white transition-all has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50/10">
                                        <input type="radio" name="shipping" className="sr-only" />
                                        <div className="flex-grow">
                                            <p className="font-black text-gray-900">Priority Express</p>
                                            <p className="text-xs text-gray-500 font-bold">Overnight</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-orange-600">$24.99</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Side Summary */}
                    <div className="lg:w-1/3">
                        <div className="glass-card p-8 rounded-3xl shadow-xl sticky top-8 space-y-6">
                            <h2 className="text-2xl font-black text-gray-900">Summary</h2>

                            <div className="space-y-4 py-4 border-y border-gray-100">
                                <div className="flex justify-between text-gray-600 font-bold italic">
                                    <span>3 Items in Cart</span>
                                    <button onClick={() => navigate('/cart')} className="text-orange-600 text-xs uppercase tracking-tighter">Edit Cart</button>
                                </div>
                                <div className="flex justify-between text-gray-600 font-bold">
                                    <span>Shipping Cost</span>
                                    <span className="text-gray-900">$0.00</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout/payment')}
                                className="w-full py-5 bg-orange-600 text-white text-sm font-black rounded-2xl hover:bg-orange-700 hover:shadow-2xl shadow-lg transition-all transform active:scale-[0.98] tracking-widest uppercase flex items-center justify-center gap-2"
                            >
                                Continue to Payment
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>

                            <p className="text-center text-xs text-gray-400 font-bold">Secure Checkout Powered by <span className="text-gray-600 italic">AuthCloud</span></p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ShippingPage;
