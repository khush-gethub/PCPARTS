import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api';

const AdminHeader = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    useEffect(() => {
        // Get user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Fetch products for low stock alert
        const fetchLowStock = async () => {
            try {
                const products = await api.getProducts();
                // Threshold < 10 for low stock
                const low = products.filter(p => p.stock < 10);
                setLowStockProducts(low);
            } catch (err) {
                console.error("Failed to fetch products for notifications", err);
            }
        };

        fetchLowStock();
        // Refresh every 5 minutes
        const interval = setInterval(fetchLowStock, 5 * 60 * 1000);

        // Click outside listener for dropdown
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            clearInterval(interval);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleRestock = (productId) => {
        setShowNotifications(false);
        navigate('/admin/products', { state: { editProductId: productId } });
    };

    const getInitials = (name) => {
        if (!name) return 'A';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        return parts[0][0].toUpperCase();
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8 sticky top-0 z-30">



            {/* Right Side Actions */}
            <div className="flex items-center space-x-6">
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`relative p-2 transition-colors ${showNotifications ? 'text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {lowStockProducts.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                                {lowStockProducts.length}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-slideIn">
                            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Alerts</h3>
                                <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full uppercase">
                                    {lowStockProducts.length} New
                                </span>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {lowStockProducts.length > 0 ? (
                                    lowStockProducts.map(product => (
                                        <div key={product._id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 border border-orange-100">
                                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-gray-900 truncate">{product.name}</p>
                                                <p className="text-[10px] text-red-500 font-bold">Only {product.stock} left in stock</p>
                                                <button
                                                    onClick={() => handleRestock(product._id)}
                                                    className="mt-2 text-[10px] font-black text-white bg-orange-600 px-3 py-1 rounded-md uppercase tracking-widest hover:bg-orange-700 transition-colors shadow-sm"
                                                >
                                                    Restock Now
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center">
                                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900 border-none">All good!</p>
                                        <p className="text-xs text-gray-400 mt-1">No low stock alerts found.</p>
                                    </div>
                                )}
                            </div>
                            {lowStockProducts.length > 0 && (
                                <Link
                                    to="/admin/products"
                                    onClick={() => setShowNotifications(false)}
                                    className="block p-3 text-center text-[10px] font-black text-gray-400 hover:text-orange-600 uppercase tracking-widest transition-colors bg-gray-50/30"
                                >
                                    View All Products
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {/* Profile  */}
                <div className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-black text-sm border-2 border-white shadow-sm group-hover:bg-orange-200 transition-colors">
                        {getInitials(user?.name)}
                    </div>
                    <div className="text-sm">
                        <p className="font-bold text-gray-900 leading-none group-hover:text-orange-600 transition-colors">{user?.name || 'Administrator'}</p>
                        <p className="font-medium text-gray-400 text-[10px] uppercase tracking-wide mt-1">{user?.email || 'admin@pcparts.com'}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
