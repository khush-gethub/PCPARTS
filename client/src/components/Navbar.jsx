import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../api.js';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const navigate = useNavigate();
    const { cartCount } = useCart();

    React.useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem('token'));
        };
        window.addEventListener('storage', handleStorageChange);
        // Also check every time the component renders as storage event doesn't fire in the same tab
        handleStorageChange();
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const [couponCount, setCouponCount] = useState(0);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setCouponCount(0);
        navigate('/login');
    };

    useEffect(() => {
        const fetchCouponCount = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.id) {
                try {
                    const coupons = await api.getUserCoupons(user.id);
                    setCouponCount(coupons.filter(c => c.user_status === 'eligible').length);
                } catch (err) {
                    console.error("Error fetching coupon count:", err);
                }
            }
        };

        if (isLoggedIn) {
            fetchCouponCount();
        } else {
            setCouponCount(0);
        }
    }, [isLoggedIn]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsOpen(false);
        }
    };

    return (
        <nav className="bg-white sticky top-0 z-50 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-12">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-4xl font-black text-black tracking-tighter cursor-pointer">H</Link>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl mx-10 hidden md:block">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-4 pr-10 py-2 border border-gray-200 rounded-md leading-5 bg-[#f5f7f7] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                placeholder="Search products, brands, or categories..."
                            />
                            <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    {/* Right Actions */}
                    {/* ... rest of actions ... */}
                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex items-center space-x-4">
                            {isLoggedIn ? (
                                <button
                                    onClick={handleLogout}
                                    className="bg-[#f06437] text-white px-6 py-2 rounded-md font-bold hover:bg-orange-700 transition duration-150 text-sm"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link to="/login" className="bg-[#f06437] text-white px-6 py-2 rounded-md font-bold hover:bg-orange-700 transition duration-150 text-sm">
                                    Login Register
                                </Link>
                            )}

                            {/* Profile Icon */}
                            <Link to="/profile" className="text-gray-700 hover:text-black transition-colors relative group">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {couponCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full group-hover:scale-110 transition-transform shadow-sm ring-2 ring-white">
                                        {couponCount}
                                    </span>
                                )}
                            </Link>

                            <Link to="/cart" className="p-2 text-gray-700 hover:text-black relative group">
                                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="absolute -top-1 -right-1 bg-[#f06437] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full group-hover:scale-110 transition-transform shadow-sm">{cartCount}</span>
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600 hover:text-black">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-3 space-y-1">
                    <form onSubmit={handleSearch} className="mb-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-3 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-[#f5f7f7] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            placeholder="Search..."
                        />
                    </form>
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="w-full block text-center bg-[#f06437] text-white px-6 py-2 rounded-md font-bold hover:bg-orange-700 mt-2"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="w-full block text-center bg-[#f06437] text-white px-6 py-2 rounded-md font-bold hover:bg-orange-700 mt-2">
                            Login Register
                        </Link>
                    )}
                    <Link to="/cart" className="flex items-center space-x-2 w-full px-3 py-3 text-gray-700 font-bold hover:bg-gray-50 rounded-lg">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>My Cart ({cartCount})</span>
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

