import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#0a0f14] text-white pt-20 pb-10 border-t border-gray-800/50">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link to="/" className="text-3xl font-black tracking-tighter cursor-pointer flex items-center">
                            PC<span className="text-orange-600">STORE</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Premium hardware for elite performance. From high-end GPUs to custom pre-builts, we provide the gear that powers your passion.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Icons with Hover Effects */}
                            {['Twitter', 'Instagram', 'YouTube', 'Facebook'].map((platform) => (
                                <a key={platform} href="#" className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center hover:bg-orange-600 hover:border-orange-600 transition-all duration-300 group">
                                    <span className="sr-only">{platform}</span>
                                    {/* Placeholder icons using simplified SVG shapes */}
                                    <div className="w-4 h-4 bg-gray-400 group-hover:bg-white transition-colors rounded-sm"></div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Products Column */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-100">Products</h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'CPUs & Processors', to: '/category/cat_cpu' },
                                { name: 'Graphics Cards', to: '/category/cat_graphic_card' },
                                { name: 'Memory (RAM)', to: '/category/cat_ram' },
                                { name: 'Storage SSD/HDD', to: '/category/cat_storage_ssd' },
                                { name: 'Pre-Built PCs', to: '/readymade-pcs' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link to={link.to} className="text-gray-400 hover:text-orange-500 transition-colors text-sm font-medium">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Column */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-100">Support</h3>
                        <ul className="space-y-4">
                            {[
                                { name: 'Track Your Order', to: '#' },
                                { name: 'Shipping Information', to: '#' },
                                { name: 'Returns & Refunds', to: '#' },
                                { name: 'Help Center & FAQ', to: '#' },
                                { name: 'Contact Support', to: '#' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link to={link.to} className="text-gray-400 hover:text-orange-500 transition-colors text-sm font-medium">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-100">Stay Updated</h3>
                        <p className="text-gray-400 text-sm">
                            Join our newsletter for exclusive deals, hardware news, and system optimization tips.
                        </p>
                        <form className="relative group">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-gray-900/50 border border-gray-800 rounded-lg py-3 px-4 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-600 focus:border-orange-600 transition-all"
                            />
                            <button className="absolute right-2 top-2 px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded font-bold text-xs transition-colors">
                                JOIN
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} PC STORE ENGINE ROOM. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-[11px] font-bold text-gray-600 tracking-tighter uppercase uppercase">
                        <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-gray-300 transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
