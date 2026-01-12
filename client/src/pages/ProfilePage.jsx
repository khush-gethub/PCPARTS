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
    const [loading, setLoading] = useState(true);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [newAddress, setNewAddress] = useState({
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
    });
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
        fetchUserData(userData.id);
    }, [navigate]);

    const fetchUserData = async (userId) => {
        try {
            setLoading(true);
            const [addrData, orderData] = await Promise.all([
                api.getAddressesByUserId(userId),
                api.getOrdersByUserId(userId)
            ]);
            setAddresses(addrData);
            setUserOrders(orderData);
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
            price: '$549.00',
            image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=200',
            inStock: true
        },
        {
            id: 2,
            name: 'ASUS ROG Swift 27"',
            price: '$699.00',
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
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    defaultValue={user?.name}
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
                                    defaultValue={user?.phone}
                                    maxLength="10"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <button type="button" className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                                    Save Changes
                                </button>
                            </div>
                        </form>
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
                                                <p className="text-sm font-bold text-orange-600">{order._id}</p>
                                                <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.order_status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {order.order_status}
                                                </span>
                                                <p className="font-bold text-gray-900">${order.total_price}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {order.items?.map((item, idx) => (
                                                <span key={idx} className="bg-gray-50 px-3 py-1 rounded-lg text-xs text-gray-600 font-medium">
                                                    {item.product_name} x {item.quantity}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-50">
                                            <button className="text-sm font-bold text-orange-600 hover:text-orange-700">
                                                View Order Details
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
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
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
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
