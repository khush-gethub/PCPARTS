import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import SubNavbar from '../components/SubNavbar.jsx';
import Footer from '../components/Footer.jsx';
import { api } from '../api';

const ShippingPage = () => {
    const navigate = useNavigate();
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [showNewAddressForm, setShowNewAddressForm] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        shippingMethod: 'standard'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (userId) {
            loadSavedAddresses();
        }
    }, [userId]);

    const loadSavedAddresses = async () => {
        try {
            const addresses = await api.getAddressesByUserId(userId);
            setSavedAddresses(addresses);
            if (addresses.length > 0) {
                setShowNewAddressForm(false);
            }
        } catch (error) {
            console.error('Error loading addresses:', error);
        }
    };

    const handleAddressSelect = (addr) => {
        setSelectedAddressId(addr._id);
        setFormData({
            ...formData,
            firstName: addr.firstName || '',
            lastName: addr.lastName || '',
            address: addr.line1 || '',
            city: addr.city || '',
            state: addr.state || '',
            zip: addr.pincode || '',
            phone: addr.phone || '',
        });
        setShowNewAddressForm(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zip.trim()) newErrors.zip = 'ZIP Code is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone Number is required';
        else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Invalid phone number (10 digits)';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            // If it's a new address and user is logged in, save it
            if (showNewAddressForm && userId) {
                const addressData = {
                    user_id: userId,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    line1: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.zip,
                    country: 'India', // Default or add field
                    phone: formData.phone
                };
                await api.addAddress(addressData);
            }
            navigate('/checkout/payment', { state: { shippingData: formData } });
        } catch (error) {
            console.error('Error saving address:', error);
            // Even if save fails, we can proceed to payment for now
            navigate('/checkout/payment', { state: { shippingData: formData } });
        } finally {
            setIsLoading(false);
        }
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
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Shipping <span className="text-orange-600">Details</span></h1>
                            {savedAddresses.length > 0 && (
                                <button
                                    onClick={() => {
                                        setShowNewAddressForm(!showNewAddressForm);
                                        if (!showNewAddressForm) setSelectedAddressId(null);
                                    }}
                                    className="text-orange-600 font-black text-sm uppercase tracking-widest hover:underline"
                                >
                                    {showNewAddressForm ? "Select Saved Address" : "Add New Address"}
                                </button>
                            )}
                        </div>

                        {/* Saved Addresses List */}
                        {!showNewAddressForm && savedAddresses.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {savedAddresses.map((addr) => (
                                    <div
                                        key={addr._id}
                                        onClick={() => handleAddressSelect(addr)}
                                        className={`glass-card p-6 rounded-3xl cursor-pointer border-2 transition-all ${selectedAddressId === addr._id ? 'border-orange-500 shadow-xl' : 'border-transparent hover:border-orange-200'}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <p className="font-black text-gray-900 border-b-2 border-orange-500 pb-1 mb-3">{addr.firstName} {addr.lastName}</p>
                                            {selectedAddressId === addr._id && (
                                                <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">Selected</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 font-bold mb-1">{addr.line1}</p>
                                        <p className="text-sm text-gray-600 font-bold">{addr.city}, {addr.state} {addr.pincode}</p>
                                        <p className="text-xs text-gray-400 font-bold mt-3">{addr.phone}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* New/Edit Address Form */}
                        {(showNewAddressForm || savedAddresses.length === 0) && (
                            <div className="glass-card p-10 rounded-3xl shadow-xl space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="John"
                                            className={`w-full px-5 py-4 bg-white/50 border ${errors.firstName ? 'border-red-500' : 'border-transparent'} rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-900 shadow-sm`}
                                        />
                                        {errors.firstName && <p className="text-red-500 text-xs font-bold ml-1">{errors.firstName}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="Doe"
                                            className={`w-full px-5 py-4 bg-white/50 border ${errors.lastName ? 'border-red-500' : 'border-transparent'} rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-900 shadow-sm`}
                                        />
                                        {errors.lastName && <p className="text-red-500 text-xs font-bold ml-1">{errors.lastName}</p>}
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="123 Gaming Street"
                                            className={`w-full px-5 py-4 bg-white/50 border ${errors.address ? 'border-red-500' : 'border-transparent'} rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-900 shadow-sm`}
                                        />
                                        {errors.address && <p className="text-red-500 text-xs font-bold ml-1">{errors.address}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="Silicon Valley"
                                            className={`w-full px-5 py-4 bg-white/50 border ${errors.city ? 'border-red-500' : 'border-transparent'} rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-900 shadow-sm`}
                                        />
                                        {errors.city && <p className="text-red-500 text-xs font-bold ml-1">{errors.city}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                placeholder="CA"
                                                className={`w-full px-5 py-4 bg-white/50 border ${errors.state ? 'border-red-500' : 'border-transparent'} rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-900 shadow-sm`}
                                            />
                                            {errors.state && <p className="text-red-500 text-xs font-bold ml-1">{errors.state}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">ZIP Code</label>
                                            <input
                                                type="text"
                                                name="zip"
                                                value={formData.zip}
                                                onChange={handleInputChange}
                                                placeholder="94025"
                                                className={`w-full px-5 py-4 bg-white/50 border ${errors.zip ? 'border-red-500' : 'border-transparent'} rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-900 shadow-sm`}
                                            />
                                            {errors.zip && <p className="text-red-500 text-xs font-bold ml-1">{errors.zip}</p>}
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+1 (555) 000-0000"
                                            className={`w-full px-5 py-4 bg-white/50 border ${errors.phone ? 'border-red-500' : 'border-transparent'} rounded-2xl focus:bg-white focus:border-orange-500 outline-none transition-all font-bold text-gray-900 shadow-sm`}
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs font-bold ml-1">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="glass-card p-10 rounded-3xl shadow-xl space-y-8 mt-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest ml-1">Shipping Method</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label className={`relative flex p-6 rounded-2xl border-2 cursor-pointer transition-all ${formData.shippingMethod === 'standard' ? 'border-orange-500 bg-orange-50/10' : 'border-orange-500/10 bg-white/50 hover:bg-white'}`}>
                                        <input
                                            type="radio"
                                            name="shippingMethod"
                                            value="standard"
                                            checked={formData.shippingMethod === 'standard'}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <div className="flex-grow">
                                            <p className="font-black text-gray-900">Standard Delivery</p>
                                            <p className="text-xs text-gray-500 font-bold">3-5 business days</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-orange-600">Free</p>
                                        </div>
                                    </label>
                                    <label className={`relative flex p-6 rounded-2xl border-2 cursor-pointer transition-all ${formData.shippingMethod === 'express' ? 'border-orange-500 bg-orange-50/10' : 'border-orange-500/10 bg-white/50 hover:bg-white'}`}>
                                        <input
                                            type="radio"
                                            name="shippingMethod"
                                            value="express"
                                            checked={formData.shippingMethod === 'express'}
                                            onChange={handleInputChange}
                                            className="sr-only"
                                        />
                                        <div className="flex-grow">
                                            <p className="font-black text-gray-900">Priority Express</p>
                                            <p className="text-xs text-gray-500 font-bold">Overnight</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-orange-600">₹500</p>
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
                                    <span>Items in Cart</span>
                                    <button onClick={() => navigate('/cart')} className="text-orange-600 text-xs uppercase tracking-tighter">Edit Cart</button>
                                </div>
                                <div className="flex justify-between text-gray-600 font-bold">
                                    <span>Shipping Cost</span>
                                    <span className="text-gray-900">{formData.shippingMethod === 'express' ? '₹500.00' : '₹0.00'}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className={`w-full py-5 bg-orange-600 text-white text-sm font-black rounded-2xl hover:bg-orange-700 hover:shadow-2xl shadow-lg transition-all transform active:scale-[0.98] tracking-widest uppercase flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Processing...' : 'Continue to Payment'}
                                {!isLoading && (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                )}
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
