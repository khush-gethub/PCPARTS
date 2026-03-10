import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import SubNavbar from '../components/SubNavbar.jsx';
import Footer from '../components/Footer.jsx';
import { api } from '../api.js';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [user, setUser] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [userOrders, setUserOrders] = useState([]);
    const [userCoupons, setUserCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [profileData, setProfileData] = useState({ name: '', phone: '' });
    const [newAddress, setNewAddress] = useState({
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();

    const stateCityData = {
        "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
        "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro", "Pasighat"],
        "Assam": ["Guwahati", "Dibrugarh", "Silchar", "Jorhat"],
        "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
        "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba"],
        "Goa": ["Panaji", "Margao", "Vasco da Gama"],
        "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
        "Haryana": ["Faridabad", "Gurgaon", "Panipat", "Ambala"],
        "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala"],
        "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
        "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
        "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
        "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior"],
        "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad"],
        "Manipur": ["Imphal"],
        "Meghalaya": ["Shillong"],
        "Mizoram": ["Aizawl"],
        "Nagaland": ["Kohima", "Dimapur"],
        "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela"],
        "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
        "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer"],
        "Sikkim": ["Gangtok"],
        "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
        "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
        "Tripura": ["Agartala"],
        "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut"],
        "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee"],
        "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri"],
        "Delhi": ["New Delhi", "North Delhi", "South Delhi"]
    };

    const indianStates = Object.keys(stateCityData).sort();

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (!loggedInUser) {
            navigate('/login');
            return;
        }
        const userData = JSON.parse(loggedInUser);
        setUser(userData);
        setProfileData({ name: userData.name || '', phone: userData.phone || '' });
        fetchUserData(userData.id);
    }, [navigate]);

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        alert('Coupon code copied to clipboard!');
    };

    const fetchUserData = async (userId) => {
        try {
            setLoading(true);
            const [addrData, orderData, couponData] = await Promise.all([
                api.getAddressesByUserId(userId),
                api.getOrdersByUserId(userId),
                api.getUserCoupons(userId)
            ]);
            setAddresses(addrData);
            setUserOrders(orderData);
            setUserCoupons(couponData);
        } catch (err) {
            console.error("Error fetching profile data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await api.updateUser(user.id, profileData);
            setUser(res.user);
            localStorage.setItem('user', JSON.stringify(res.user));
            alert('Profile updated successfully!');
        } catch (err) {
            alert('Failed to update profile: ' + err.message);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();

        if (newAddress.pincode.length !== 6) {
            alert('Pincode must be exactly 6 digits');
            return;
        }

        try {
            if (editingAddressId) {
                await api.updateAddress(editingAddressId, newAddress);
                alert('Address updated successfully!');
            } else {
                await api.addAddress({ ...newAddress, user_id: user.id });
                alert('Address added successfully!');
            }

            setShowAddressForm(false);
            setEditingAddressId(null);
            setNewAddress({
                line1: '',
                line2: '',
                city: '',
                state: '',
                pincode: '',
                country: 'India'
            });
            fetchUserData(user.id);
        } catch (err) {
            alert('Operation failed: ' + err.message);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return setPasswordMessage({ type: 'error', text: 'Confirm password is different from new password' });
        }

        try {
            const res = await api.changePassword(user.id, passwordData.oldPassword, passwordData.newPassword);
            setPasswordMessage({ type: 'success', text: 'Password updated successfully' });
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            if (err.message.toLowerCase().includes('incorrect old password') || err.message.toLowerCase().includes('401')) {
                setPasswordMessage({ type: 'error', text: 'Wrong old password' });
            } else {
                setPasswordMessage({ type: 'error', text: err.message || 'Failed to update password' });
            }
        }
    };

    const handleEditAddress = (addr) => {
        setNewAddress({
            line1: addr.line1,
            line2: addr.line2 || '',
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            country: addr.country || 'India'
        });
        setEditingAddressId(addr._id);
        setShowAddressForm(true);
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;
        try {
            await api.deleteAddress(id);
            alert('Address deleted successfully!');
            fetchUserData(user.id);
        } catch (err) {
            alert('Failed to delete address: ' + err.message);
        }
    };

    const wishlist = [
        {
            id: 1,
            name: 'AMD Ryzen 9 7950X',
            price: '₹549.00',
            image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=200',
            inStock: true
        },
        {
            id: 2,
            name: 'ASUS ROG Swift 27"',
            price: '₹699.00',
            image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=200',
            inStock: false
        }
    ];

    const renderContent = () => {
        if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div>;

        switch (activeTab) {
            case 'profile':
                return (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                        <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    defaultValue={user?.email}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    maxLength="10"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <button type="submit" className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                                    Save Changes
                                </button>
                            </div>
                        </form>

                        <div className="mt-12 border-t pt-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Change Password</h3>
                            <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.oldPassword}
                                        onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.newPassword}
                                        onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.confirmPassword}
                                        onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                    />
                                </div>
                                {passwordMessage.text && (
                                    <div className={`md:col-span-2 p-4 rounded-lg font-bold text-sm ${passwordMessage.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                                        {passwordMessage.text}
                                    </div>
                                )}
                                <div className="md:col-span-2">
                                    <button type="submit" className="bg-gray-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-black transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                );
            case 'addresses':
                return (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                            <button
                                onClick={() => {
                                    setShowAddressForm(!showAddressForm);
                                    if (!showAddressForm) {
                                        setEditingAddressId(null);
                                        setNewAddress({
                                            line1: '', line2: '', city: '', state: '', pincode: '', country: 'India'
                                        });
                                    }
                                }}
                                className="text-orange-600 font-bold hover:text-orange-700 text-sm"
                            >
                                {showAddressForm ? 'Cancel' : '+ Add New Address'}
                            </button>
                        </div>

                        {showAddressForm && (
                            <form onSubmit={handleAddAddress} className="mb-8 p-6 bg-gray-50 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Address Line 1</label>
                                    <input
                                        type="text" required
                                        className="w-full px-4 py-2 border rounded-lg"
                                        value={newAddress.line1}
                                        onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Address Line 2 (Optional)</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border rounded-lg"
                                        value={newAddress.line2}
                                        onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Country</label>
                                    <select
                                        required
                                        className="w-full px-4 py-2 border rounded-lg bg-white"
                                        value={newAddress.country}
                                        onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                                    >
                                        <option value="India">India</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State</label>
                                    <select
                                        required
                                        className="w-full px-4 py-2 border rounded-lg bg-white"
                                        value={newAddress.state}
                                        onChange={(e) => {
                                            const selectedState = e.target.value;
                                            setNewAddress({
                                                ...newAddress,
                                                state: selectedState,
                                                city: '' // Reset city when state changes
                                            });
                                        }}
                                    >
                                        <option value="">Select State</option>
                                        {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
                                    <select
                                        required
                                        className="w-full px-4 py-2 border rounded-lg bg-white"
                                        value={newAddress.city}
                                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                        disabled={!newAddress.state}
                                    >
                                        <option value="">Select City</option>
                                        {newAddress.state && stateCityData[newAddress.state]?.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pincode (6 digits)</label>
                                    <input
                                        type="text" required
                                        maxLength="6"
                                        pattern="\d{6}"
                                        title="Pincode must be exactly 6 digits"
                                        className="w-full px-4 py-2 border rounded-lg"
                                        value={newAddress.pincode}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                            setNewAddress({ ...newAddress, pincode: val });
                                        }}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700">
                                        {editingAddressId ? 'Update Address' : 'Save Address'}
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {addresses.length === 0 ? (
                                <p className="text-gray-500 col-span-2 text-center py-8">No addresses saved yet.</p>
                            ) : (
                                addresses.map((addr, index) => (
                                    <div key={addr._id} className={`border p-6 rounded-xl relative ${index === 0 ? 'border-orange-200 bg-orange-50' : 'border-gray-100'}`}>
                                        {index === 0 && <span className="absolute top-4 right-4 text-[10px] font-bold bg-orange-600 text-white px-2 py-1 rounded-full uppercase tracking-wider">Default</span>}
                                        <p className="font-bold text-gray-900 mb-1">{addr.city}</p>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {addr.line1}<br />
                                            {addr.line2 && <>{addr.line2}<br /></>}
                                            {addr.city}, {addr.state} {addr.pincode}<br />
                                            {addr.country}
                                        </p>
                                        <div className="mt-4 flex space-x-4 text-sm font-bold">
                                            <button
                                                onClick={() => handleEditAddress(addr)}
                                                className="text-orange-600 hover:text-orange-700"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAddress(addr._id)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );
            case 'orders':
                return (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
                        <div className="space-y-4">
                            {userOrders.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">You haven't placed any orders yet.</p>
                            ) : (
                                userOrders.map((order) => (
                                    <div key={order._id} className="border border-gray-100 rounded-xl p-6 hover:border-orange-200 transition-colors">
                                        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                                            <div>
                                                <p className="text-sm font-bold text-orange-600">ID: {order._id}</p>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString('en-GB')}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.order_status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    order.order_status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                        order.order_status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                            'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {order.order_status}
                                                </span>
                                                <p className="font-black text-gray-900 text-lg">₹{order.total_price}</p>
                                            </div>
                                        </div>
                                        {order.coupon_id && (
                                            <div className="mb-4">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-lg border border-green-100">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path></svg>
                                                    Coupon Applied: {order.coupon_id.code} ({order.coupon_id.name})
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {order.items?.slice(0, 3).map((item, idx) => (
                                                <span key={idx} className="bg-gray-50 px-3 py-1.5 rounded-lg text-[10px] text-gray-500 font-black uppercase tracking-tighter border border-gray-100">
                                                    {item.product_name} x {item.quantity}
                                                </span>
                                            ))}
                                            {order.items?.length > 3 && <span className="text-[10px] text-gray-400 font-bold self-center">+{order.items.length - 3} more</span>}
                                        </div>
                                        <div className="pt-4 border-t border-gray-50 flex justify-end">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-xs font-black text-white bg-orange-600 px-6 py-2.5 rounded-xl hover:bg-orange-700 transition-all uppercase tracking-widest shadow-md shadow-orange-500/20"
                                            >
                                                View Order Details
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Order Detail Modal */}
                        {selectedOrder && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
                                <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col">
                                    <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                        <div>
                                            <h2 className="text-2xl font-black text-gray-900 leading-none mb-2">Order <span className="text-orange-600">Summary</span></h2>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{selectedOrder._id}</p>
                                        </div>
                                        <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex-grow overflow-y-auto p-8 custom-scrollbar space-y-8">
                                        {/* Delivery Info */}
                                        <section className="space-y-4">
                                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Shipping Details</h3>
                                            <div className="flex items-start gap-4 p-5 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm flex-shrink-0">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-black text-gray-900 leading-tight">
                                                        {selectedOrder.address_id?.firstName} {selectedOrder.address_id?.lastName}
                                                    </p>
                                                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                                        {selectedOrder.address_id?.line1}, {selectedOrder.address_id?.city}<br />
                                                        {selectedOrder.address_id?.state} - {selectedOrder.address_id?.pincode}<br />
                                                        Phone: {selectedOrder.address_id?.phone}
                                                    </p>
                                                </div>
                                            </div>
                                        </section>

                                        {/* Items List */}
                                        <section className="space-y-4">
                                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Order Items</h3>
                                            <div className="space-y-3">
                                                {selectedOrder.items?.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                                                        <div className="flex-grow">
                                                            <p className="font-bold text-gray-900 leading-tight">{item.product_name}</p>
                                                            <p className="text-xs text-gray-400 font-bold uppercase mt-1">
                                                                Qty: {item.quantity} × ₹{item.price}
                                                            </p>
                                                        </div>
                                                        <div className="text-right ml-4">
                                                            <p className="font-black text-gray-900">₹{Number(item.price) * item.quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        {/* Totals */}
                                        <section className="pt-6 border-t border-gray-100 space-y-3">
                                            <div className="flex justify-between items-center text-sm font-medium text-gray-500 uppercase tracking-widest">
                                                <span>Payment Method</span>
                                                <span className="text-gray-900 font-black">{selectedOrder.payment_method?.toUpperCase()}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm font-medium text-gray-500 uppercase tracking-widest">
                                                <span>Subtotal</span>
                                                <span className="text-gray-900 font-black">₹{selectedOrder.subtotal || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm font-medium text-gray-500 uppercase tracking-widest">
                                                <span>Tax (8%)</span>
                                                <span className="text-gray-900 font-black">₹{selectedOrder.tax || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm font-medium text-gray-500 uppercase tracking-widest">
                                                <span>Shipping</span>
                                                <span className="text-gray-900 font-black">₹{selectedOrder.shipping_cost || 0}</span>
                                            </div>
                                            {selectedOrder.coupon_id && (
                                                <div className="flex justify-between items-center text-sm font-medium text-green-600 uppercase tracking-widest">
                                                    <span>Coupon Applied</span>
                                                    <span className="font-black">{selectedOrder.coupon_id.code}</span>
                                                </div>
                                            )}
                                            {selectedOrder.discount > 0 && (
                                                <div className="flex justify-between items-center text-sm font-medium text-gray-500 uppercase tracking-widest">
                                                    <span>Discount</span>
                                                    <span className="text-green-600 font-black">-₹{selectedOrder.discount}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-900 font-black uppercase tracking-widest text-sm">Grand Total</span>
                                                <span className="text-3xl font-black text-orange-600">₹{selectedOrder.total_price}</span>
                                            </div>
                                        </section>
                                    </div>

                                    <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex gap-4">
                                        <button
                                            onClick={() => {
                                                import('jspdf').then(({ default: jsPDF }) => {
                                                    import('jspdf-autotable').then(() => {
                                                        const doc = new jsPDF();
                                                        doc.setFontSize(22);
                                                        doc.setTextColor(234, 88, 12);
                                                        doc.text('PC Parts Invoice', 14, 20);
                                                        doc.setFontSize(10);
                                                        doc.setTextColor(100);
                                                        doc.text(`Order ID: ${selectedOrder._id}`, 14, 30);
                                                        doc.text(`Date: ${new Date(selectedOrder.created_at).toLocaleDateString('en-GB')}`, 14, 35);

                                                        doc.setTextColor(0);
                                                        doc.setFontSize(12);
                                                        doc.text('Billed To:', 14, 45);
                                                        doc.setFontSize(10);
                                                        doc.text(`${selectedOrder.address_id?.firstName || ''} ${selectedOrder.address_id?.lastName || ''}`, 14, 52);
                                                        doc.text(`${selectedOrder.address_id?.line1 || ''}`, 14, 57);
                                                        doc.text(`${selectedOrder.address_id?.city || ''}, ${selectedOrder.address_id?.state || ''} ${selectedOrder.address_id?.pincode || ''}`, 14, 62);

                                                        const tableColumn = ["Item", "Quantity", "Price", "Total"];
                                                        const tableRows = [];
                                                        selectedOrder.items?.forEach(item => {
                                                            tableRows.push([
                                                                item.product_name,
                                                                item.quantity,
                                                                `Rs. ${item.price}`,
                                                                `Rs. ${Number(item.price) * item.quantity}`
                                                            ]);
                                                        });
                                                        doc.autoTable({
                                                            startY: 70,
                                                            head: [tableColumn],
                                                            body: tableRows,
                                                            theme: 'striped',
                                                            headStyles: { fillColor: [234, 88, 12] }
                                                        });

                                                        const finalY = doc.lastAutoTable.finalY || 70;
                                                        doc.text(`Subtotal: Rs. ${selectedOrder.subtotal || 0}`, 140, finalY + 10);
                                                        doc.text(`Tax: Rs. ${selectedOrder.tax || 0}`, 140, finalY + 17);
                                                        doc.text(`Shipping: Rs. ${selectedOrder.shipping_cost || 0}`, 140, finalY + 24);
                                                        if (selectedOrder.discount > 0) {
                                                            doc.text(`Discount: -Rs. ${selectedOrder.discount}`, 140, finalY + 31);
                                                        }
                                                        doc.setFontSize(12);
                                                        doc.setTextColor(234, 88, 12);
                                                        doc.text(`Total: Rs. ${selectedOrder.total_price}`, 140, selectedOrder.discount > 0 ? finalY + 40 : finalY + 33);

                                                        doc.save(`invoice_${selectedOrder._id}.pdf`);
                                                    });
                                                });
                                            }}
                                            className="w-1/2 py-4 bg-orange-600 text-white text-xs font-black rounded-2xl hover:bg-orange-700 transition-all uppercase tracking-[0.2em] shadow-lg shadow-orange-200"
                                        >
                                            Download Invoice
                                        </button>
                                        <button
                                            onClick={() => setSelectedOrder(null)}
                                            className="w-1/2 py-4 bg-gray-900 text-white text-xs font-black rounded-2xl hover:bg-black transition-all uppercase tracking-[0.2em] shadow-lg shadow-gray-200"
                                        >
                                            Close Summary
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'wishlist':
                return (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Wishlist</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {wishlist.map((item) => (
                                <div key={item.id} className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="aspect-video relative overflow-hidden bg-gray-100">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        {!item.inStock && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <span className="bg-white/90 text-black px-4 py-1 rounded-full text-xs font-bold">Out of Stock</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                                        <p className="text-orange-600 font-bold mb-4">{item.price}</p>
                                        <div className="flex gap-2">
                                            <button
                                                disabled={!item.inStock}
                                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${item.inStock
                                                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
                                            >
                                                Add to Cart
                                            </button>
                                            <button className="p-2 border border-gray-100 rounded-lg hover:bg-red-50 hover:border-red-100 transition-colors group/heart">
                                                <svg className="w-4 h-4 text-gray-400 group-hover/heart:text-red-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'coupons':
                return (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Rewards & Coupons</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {userCoupons.length === 0 ? (
                                <p className="text-gray-500 col-span-2 text-center py-8">No coupons available yet. Keep shopping to earn rewards!</p>
                            ) : (
                                userCoupons.map((coupon) => (
                                    <div key={coupon._id} className={`p-6 rounded-2xl border-2 transition-all relative overflow-hidden ${coupon.user_status === 'eligible' ? 'border-orange-500 bg-orange-50/10' : 'border-gray-100 bg-gray-50/50 opacity-60'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-black text-gray-900 leading-tight mb-1">{coupon.name || 'Discount Reward'}</h3>
                                                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest font-mono">{coupon.code}</p>
                                            </div>
                                            <div className="bg-white px-3 py-1 rounded-full shadow-sm border border-gray-50">
                                                <span className="text-xs font-black text-orange-600">
                                                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-500 font-bold mb-4 leading-relaxed">
                                            {coupon.user_status === 'eligible' ? 'Available to use at checkout for your next hardware upgrade.' : `Used on ${new Date(coupon.used_at).toLocaleDateString('en-GB')}`}
                                        </p>

                                        <div className="flex justify-between items-center relative z-10">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${coupon.user_status === 'eligible' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                                    {coupon.user_status}
                                                </span>
                                                {coupon.user_status === 'eligible' && (
                                                    <button
                                                        onClick={() => handleCopyCode(coupon.code)}
                                                        className="text-[10px] bg-orange-600 text-white font-black px-3 py-1 rounded-lg hover:bg-orange-700 transition-all uppercase tracking-widest flex items-center gap-1"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                                        Copy Code
                                                    </button>
                                                )}
                                            </div>
                                            {coupon.expires_at && (
                                                <span className="text-[10px] text-gray-400 font-bold">Expires: {new Date(coupon.expires_at).toLocaleDateString('en-GB')}</span>
                                            )}
                                        </div>
                                        {/* Decorative ticket look */}
                                        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#eef2f2] rounded-full -translate-y-1/2 border-r border-gray-100"></div>
                                        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#eef2f2] rounded-full -translate-y-1/2 border-l border-gray-100"></div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#eef2f2] font-sans flex flex-col">
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleUp {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
                .animate-scaleUp {
                    animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
            `}</style>
            <Navbar />
            <SubNavbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar / Navigation */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                            <div className="p-6 border-b border-gray-100 flex items-center space-x-4">
                                <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center shadow-inner">
                                    <span className="text-orange-600 text-2xl font-bold">
                                        {user?.name?.split(' ').map(n => n[0]).join('') || 'JD'}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{user?.name || 'Loading...'}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{user?.email}</p>
                                </div>
                            </div>
                            <nav className="p-4 space-y-1">
                                {[
                                    { id: 'profile', label: 'My Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                                    { id: 'addresses', label: 'Addresses', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
                                    { id: 'coupons', label: 'My Coupons', icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' },
                                    { id: 'orders', label: 'Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
                                    { id: 'wishlist', label: 'Wishlist', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-bold rounded-lg transition-all duration-200 ${activeTab === tab.id
                                            ? 'bg-orange-600 text-white shadow-md transform scale-[1.02]'
                                            : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                                        </svg>
                                        <span>{tab.label}</span>
                                    </button>
                                ))}
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-all mt-4"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Logout</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {renderContent()}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProfilePage;
