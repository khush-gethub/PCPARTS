import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import SubNavbar from '../components/SubNavbar.jsx';
import Footer from '../components/Footer.jsx';
import { useCart } from '../context/CartContext.jsx';

const CartPage = () => {
    const navigate = useNavigate();
    const { cartItems, updateQuantity, removeFromCart } = useCart();

    const removeItem = (id) => {
        removeFromCart(id);
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 15.00;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return (
        <div className="min-h-screen bg-[#eef2f2] flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900">
            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }
                @keyframes dropdown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-dropdown {
                    animation: dropdown 0.4s ease-out forwards;
                }
            `}</style>
            <Navbar />
            <SubNavbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="flex flex-col lg:flex-row gap-8 animate-dropdown">
                    {/* Cart Items List */}
                    <div className="lg:w-2/3 space-y-6">
                        <div className="flex justify-between items-end mb-4">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Shopping <span className="text-orange-600">Cart</span></h1>
                            <p className="text-gray-500 font-bold">{cartItems.length} Items</p>
                        </div>

                        {cartItems.length > 0 ? (
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="glass-card p-6 rounded-3xl shadow-xl flex items-center gap-6 transition-all hover:shadow-2xl hover:scale-[1.01]">
                                        <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-xs font-black text-orange-600 uppercase tracking-widest mb-1">{item.category}</p>
                                                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{item.name}</h3>
                                                </div>
                                                <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="flex justify-between items-center mt-4">
                                                <div className="flex items-center space-x-4 bg-gray-100/50 rounded-xl p-1">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-gray-600 hover:text-orange-600 transition-colors">-</button>
                                                    <span className="font-black text-gray-900 w-4 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-gray-600 hover:text-orange-600 transition-colors">+</button>
                                                </div>
                                                <p className="text-xl font-black text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-12 rounded-3xl text-center">
                                <p className="text-gray-500 text-lg font-medium mb-6">Your cart is empty.</p>
                                <Link to="/configurator" className="inline-block py-4 px-8 bg-orange-600 text-white text-sm font-black rounded-2xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/30">
                                    Continue Shopping
                                </Link>
                            </div>
                        )}

                        <Link to="/configurator" className="inline-flex items-center text-orange-600 font-black text-sm uppercase tracking-widest hover:translate-x-1 transition-transform">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Builder
                        </Link>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:w-1/3">
                        <div className="glass-card p-8 rounded-3xl shadow-xl sticky top-8 space-y-6 border-2 border-orange-500/10">
                            <h2 className="text-2xl font-black text-gray-900">Order Summary</h2>

                            <div className="space-y-4 py-4 border-y border-gray-100">
                                <div className="flex justify-between text-gray-600 font-bold">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-bold">
                                    <span>Estimated Shipping</span>
                                    <span className="text-gray-900">${shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-bold">
                                    <span>Estimated Tax</span>
                                    <span className="text-gray-900">${tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Promo Code</label>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="GAMER20" className="flex-grow px-4 py-3 bg-white/50 border border-transparent rounded-xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-900 shadow-sm" />
                                    <button className="px-6 py-3 bg-gray-900 text-white text-xs font-black rounded-xl hover:bg-black transition-all">Apply</button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <div className="flex justify-between items-end mb-6">
                                    <span className="text-gray-600 font-black uppercase tracking-widest text-sm">Total</span>
                                    <span className="text-3xl font-black text-gray-900">${total.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={() => navigate('/checkout/shipping')}
                                    className="w-full py-5 bg-orange-600 text-white text-sm font-black rounded-2xl hover:bg-orange-700 hover:shadow-2xl hover:shadow-orange-500/40 transition-all transform active:scale-[0.98] tracking-widest uppercase flex items-center justify-center gap-2"
                                >
                                    Proceed to Checkout
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-4 pt-4 grayscale opacity-50">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CartPage;
