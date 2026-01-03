import React, { useState } from 'react';

const ProductFilters = () => {
    const [priceRange, setPriceRange] = useState([0, 5000]);

    return (
        <div className="space-y-8">
            {/* Price Filter */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Price Range</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="5000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                </div>
            </div>

            {/* Brand Filter */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Brand</h3>
                <div className="space-y-2">
                    {['NVIDIA', 'AMD', 'Intel', 'ASUS', 'MSI', 'Gigabyte'].map((brand) => (
                        <label key={brand} className="flex items-center space-x-3 cursor-pointer group">
                            <input type="checkbox" className="form-checkbox h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500 transition duration-150 ease-in-out" />
                            <span className="text-gray-600 group-hover:text-black transition-colors text-sm">{brand}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Availability Filter */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Availability</h3>
                <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                        <input type="checkbox" defaultChecked className="form-checkbox h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500" />
                        <span className="text-gray-600 group-hover:text-black transition-colors text-sm">In Stock</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer group">
                        <input type="checkbox" className="form-checkbox h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500" />
                        <span className="text-gray-600 group-hover:text-black transition-colors text-sm">On Sale</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ProductFilters;
