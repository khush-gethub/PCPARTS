import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import SubNavbar from '../components/SubNavbar.jsx';
import Footer from '../components/Footer.jsx';

const PaymentPage = () => {
    const navigate = useNavigate();
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            // Navigate after showing success message for a bit
            setTimeout(() => {
                navigate('/checkout/confirmation');
            }, 2000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#eef2f2] flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900">
            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }
                @keyframes scaleUp {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scaleUp {
                    animation: scaleUp 0.4s ease-out forwards;
                }
            `}</style>
            <Navbar />
            <SubNavbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="max-w-3xl mx-auto animate-scaleUp">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Secure <span className="text-orange-600">Payment</span></h1>
                        <p className="text-gray-500 font-bold">Please choose your preferred payment method</p>
                    </div>

                    <div className="glass-card p-10 rounded-3xl shadow-xl space-y-10">
                        {/* Payment Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className={`relative flex flex-col items-center p-6 rounded-2xl border-2 cursor-pointer transition-all group ${selectedMethod === 'card' ? 'border-orange-500 bg-orange-50/10' : 'border-orange-500/10 bg-white/50 hover:bg-white'}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    className="sr-only"
                                    checked={selectedMethod === 'card'}
                                    onChange={() => setSelectedMethod('card')}
                                />
                                <div className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${selectedMethod === 'card' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <p className="font-black text-gray-900 text-sm">Card</p>
                                <p className="text-[10px] text-gray-400 font-bold">Visa/Mastercard</p>
                            </label>

                            <label className={`relative flex flex-col items-center p-6 rounded-2xl border-2 cursor-pointer transition-all group ${selectedMethod === 'paypal' ? 'border-blue-500 bg-blue-50/10' : 'border-orange-500/10 bg-white/50 hover:bg-white'}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    className="sr-only"
                                    checked={selectedMethod === 'paypal'}
                                    onChange={() => setSelectedMethod('paypal')}
                                />
                                <div className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${selectedMethod === 'paypal' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.067 8.178c-.644 2.133-2.503 4.457-5.489 4.457H10.19l-1.043 5.333h-3.32l2.364-12h5.727c2.408 0 4.145.444 5.061 1.488.463.53.64 1.144.503 1.722zm-7.79 3.01c.01-.05.023-.102.037-.152 2.368 0 3.784-1.282 4.102-3.13.064-.374.053-.679-.082-.9-.452-.733-1.61-.954-2.818-.954H10.38l-1.574 8h1.235l.238-1.218h1.258l.758-1.646z" />
                                    </svg>
                                </div>
                                <p className="font-black text-gray-900 text-sm">PayPal</p>
                                <p className="text-[10px] text-gray-400 font-bold">Instant checkout</p>
                            </label>

                            <label className={`relative flex flex-col items-center p-6 rounded-2xl border-2 cursor-pointer transition-all group ${selectedMethod === 'cod' ? 'border-green-500 bg-green-50/10' : 'border-orange-500/10 bg-white/50 hover:bg-white'}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    className="sr-only"
                                    checked={selectedMethod === 'cod'}
                                    onChange={() => setSelectedMethod('cod')}
                                />
                                <div className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${selectedMethod === 'cod' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <p className="font-black text-gray-900 text-sm">Cash on Del.</p>
                                <p className="text-[10px] text-gray-400 font-bold">Pay at doorstep</p>
                            </label>
                        </div>

                        {/* Dynamic Content */}
                        <div className="pt-6 border-t border-gray-100 min-h-[200px] flex flex-col justify-center">
                            {selectedMethod === 'card' && (
                                <div className="space-y-4 animate-scaleUp">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Cardholder Name</label>
                                        <input type="text" placeholder="JOHN DOE" className="w-full px-5 py-4 bg-white/50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-900 shadow-sm" />
                                    </div>
                                    <div className="space-y-2 relative">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Card Number</label>
                                        <input type="text" placeholder="•••• •••• •••• ••••" className="w-full px-5 py-4 bg-white/50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-900 shadow-sm" />
                                        <div className="absolute right-5 bottom-4">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MC" className="h-6" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Expiry Date</label>
                                            <input type="text" placeholder="MM / YY" className="w-full px-5 py-4 bg-white/50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-900 shadow-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">CVV</label>
                                            <input type="password" placeholder="•••" className="w-full px-5 py-4 bg-white/50 border border-transparent rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-900 shadow-sm" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedMethod === 'paypal' && (
                                <div className="text-center space-y-4 animate-scaleUp">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto">
                                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.067 8.178c-.644 2.133-2.503 4.457-5.489 4.457H10.19l-1.043 5.333h-3.32l2.364-12h5.727c2.408 0 4.145.444 5.061 1.488.463.53.64 1.144.503 1.722zm-7.79 3.01c.01-.05.023-.102.037-.152 2.368 0 3.784-1.282 4.102-3.13.064-.374.053-.679-.082-.9-.452-.733-1.61-.954-2.818-.954H10.38l-1.574 8h1.235l.238-1.218h1.258l.758-1.646z" />
                                        </svg>
                                    </div>
                                    <p className="font-bold text-gray-900">You will be redirected to PayPal to complete your purchase safely.</p>
                                    <p className="text-sm text-gray-500">Fast, secure and easy payment method.</p>
                                </div>
                            )}

                            {selectedMethod === 'cod' && (
                                <div className="text-center space-y-4 animate-scaleUp">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <p className="font-bold text-gray-900">Cash on Delivery selected.</p>
                                    <p className="text-sm text-gray-500">Pay with cash when your hardware arrives at your doorstep.</p>
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            {!isSuccess ? (
                                <button
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                    className={`w-full py-5 text-white text-sm font-black rounded-2xl transition-all shadow-lg transform active:scale-[0.98] tracking-widest uppercase flex items-center justify-center gap-2 ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 hover:shadow-2xl'
                                        }`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2001/XMLSchema-instance" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            {selectedMethod === 'cod' ? 'Confirm Order' : 'Pay & Place Order'}
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            ) : (
                                <div className="w-full py-5 bg-green-500 text-white text-sm font-black rounded-2xl shadow-lg flex items-center justify-center gap-3 animate-scaleUp">
                                    <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Order Successfully Placed!
                                </div>
                            )}
                            <p className="text-center text-xs text-gray-400 font-bold mt-4 flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                256-bit SSL Encrypted Secure Payment
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/checkout/shipping')}
                        className="mt-8 text-gray-500 font-black text-sm uppercase tracking-widest hover:text-gray-900 transition-colors flex items-center justify-center w-full"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Shipping
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PaymentPage;
