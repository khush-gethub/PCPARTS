import React, { useState } from 'react';
import UniversalCard from './UniversalCard.jsx';

const PartSelectionModal = ({ isOpen, onClose, componentType, onSelect, products = [] }) => {
    if (!isOpen) return null;

    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('price_low');

    // Filter products
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        return 0;
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Select {componentType}</h2>
                        <p className="text-sm text-gray-500 mt-1">Choose a component for your build</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="p-4 border-b border-gray-100 flex gap-4 bg-white items-center">
                    <div className="relative flex-1">
                        <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder={`Search ${componentType}...`}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                    </select>
                </div>

                {/* Product List Grid */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <UniversalCard
                                key={product.id}
                                image={product.image}
                                title={product.name}
                                specs={Object.entries(product.specs).map(([key, value]) => `${key}: ${value}`)}
                                price={`₹${product.price ? product.price.toLocaleString() : '0'}`}
                                stockStatus={product.stockStatus}
                                primaryAction={{
                                    label: "Select",
                                    onClick: () => { onSelect(product); onClose(); }
                                }}
                            />
                        ))}
                    </div>
                    {filteredProducts.length === 0 && (
                        <div className="text-center py-20 text-gray-400">
                            <p className="text-lg">No products found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PartSelectionModal;
