import React from 'react';
import { Link } from 'react-router-dom';

const SubNavbar = () => {
    const navItems = [
        { name: 'Categories', path: '/category/all' },
        { name: 'Brands', path: '#' },
        { name: 'PC Builder', path: '/configurator' },
        { name: 'Pre Buillt PCs', path: '/ready-made-pcs' },
        { name: 'Benchmarks', path: '/benchmarks' },
        { name: 'Saved Builds', path: '/saved-builds' },
        { name: 'Support', path: '#' }
    ];

    return (
        <div className="bg-[#f2f4f4] border-b border-gray-200 hidden md:block">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center space-x-12 py-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className="text-gray-700 hover:text-black font-medium text-sm transition-colors duration-150 uppercase tracking-wide"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubNavbar;
