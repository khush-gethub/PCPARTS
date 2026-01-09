import React, { useState, useEffect } from 'react';

const AdvancedFilters = ({ categoryId, filters, onFilterChange }) => {
    // Local state for collapsed/expanded sections only
    const [expandedSections, setExpandedSections] = useState({
        brand: true,
        price: true,
        availability: true,
        specs: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Helper to handle checkbox changes for arrays (brands, specs)
    const handleCheckboxChange = (category, value) => {
        const currentValues = filters[category] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(item => item !== value)
            : [...currentValues, value];

        onFilterChange(category, newValues);
    };

    // Helper for simple value changes
    const handleChange = (category, value) => {
        onFilterChange(category, value);
    };

    // Spec options (Mock)
    const getSpecFilters = () => {
        if (categoryId === 'processors') {
            return [
                { name: 'Socket Type', key: 'socket', options: ['LGA 1700', 'AM5', 'AM4', 'LGA 1200'] },
                { name: 'Core Count', key: 'cores', options: ['4 Cores', '6 Cores', '8 Cores', '12+ Cores'] },
            ];
        } else if (categoryId === 'graphics-cards') {
            return [
                { name: 'GPU Chipset', key: 'chipset', options: ['NVIDIA RTX 4090', 'NVIDIA RTX 4080', 'AMD RX 7900 XTX'] },
                { name: 'VRAM', key: 'vram', options: ['8GB', '12GB', '16GB', '24GB'] },
            ];
        }
        return [
            { name: 'Manufacturer', key: 'manufacturer', options: ['Asus', 'MSI', 'Gigabyte', 'Corsair'] },
            { name: 'Color', key: 'color', options: ['Black', 'White', 'RGB'] }
        ];
    };

    const specFilters = getSpecFilters();

    return (
        <aside className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="font-bold text-gray-900">Filters</h2>
                <button
                    onClick={() => onFilterChange('reset')}
                    className="text-xs text-orange-600 font-bold hover:underline"
                >
                    Clear All
                </button>
            </div>

            <div className="divide-y divide-gray-100">
                {/* Price Range */}
                <div className="p-4">
                    <button
                        onClick={() => toggleSection('price')}
                        className="flex justify-between items-center w-full mb-2 font-semibold text-sm text-gray-800"
                    >
                        <span>Price Range</span>
                        <span className="text-gray-400">{expandedSections.price ? '−' : '+'}</span>
                    </button>
                    {expandedSections.price && (
                        <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-500 mb-2">
                                <span>₹0</span>
                                <span>₹{filters.priceRange?.toLocaleString()}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="200000"
                                step="1000"
                                value={filters.priceRange || 200000}
                                onChange={(e) => handleChange('priceRange', parseInt(e.target.value))}
                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                            />
                            <div className="flex gap-2 mt-4">
                                <span className="text-xs text-gray-500">Max: ₹{filters.priceRange}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Brands */}
                <div className="p-4">
                    <button
                        onClick={() => toggleSection('brand')}
                        className="flex justify-between items-center w-full mb-2 font-semibold text-sm text-gray-800"
                    >
                        <span>Brand</span>
                        <span className="text-gray-400">{expandedSections.brand ? '−' : '+'}</span>
                    </button>
                    {expandedSections.brand && (
                        <div className="mt-2 space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                            {['Intel', 'AMD', 'NVIDIA', 'ASUS', 'MSI', 'Gigabyte', 'Corsair', 'Samsung'].map(brand => (
                                <label key={brand} className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.brands?.includes(brand)}
                                        onChange={() => handleCheckboxChange('brands', brand)}
                                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    />
                                    <span className="text-sm text-gray-600">{brand}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Availability */}
                <div className="p-4">
                    <button
                        onClick={() => toggleSection('availability')}
                        className="flex justify-between items-center w-full mb-2 font-semibold text-sm text-gray-800"
                    >
                        <span>Availability</span>
                        <span className="text-gray-400">{expandedSections.availability ? '−' : '+'}</span>
                    </button>
                    {expandedSections.availability && (
                        <div className="mt-2 space-y-2">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="stock"
                                    checked={filters.availability === 'in_stock'}
                                    onChange={() => handleChange('availability', 'in_stock')}
                                    className="text-orange-600 focus:ring-orange-500"
                                />
                                <span className="text-sm text-gray-600">In Stock</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="stock"
                                    checked={filters.availability === 'any'}
                                    onChange={() => handleChange('availability', 'any')}
                                    className="text-orange-600 focus:ring-orange-500"
                                />
                                <span className="text-sm text-gray-600">Any</span>
                            </label>
                        </div>
                    )}
                </div>

                {/* Dynamic Specs */}
                {specFilters.map((spec, index) => (
                    <div key={index} className="p-4">
                        <button
                            onClick={() => toggleSection(spec.name)}
                            className="flex justify-between items-center w-full mb-2 font-semibold text-sm text-gray-800"
                        >
                            <span>{spec.name}</span>
                            <span className="text-gray-400">{expandedSections[spec.name] !== false ? '−' : '+'}</span>
                        </button>
                        {expandedSections[spec.name] !== false && (
                            <div className="mt-2 space-y-2">
                                {spec.options.map(option => (
                                    <label key={option} className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.specs?.[spec.key]?.includes(option)}
                                            onChange={() => {
                                                const currentOptions = filters.specs?.[spec.key] || [];
                                                const newOptions = currentOptions.includes(option)
                                                    ? currentOptions.filter(o => o !== option)
                                                    : [...currentOptions, option];
                                                // We need to update nested spec object
                                                const newSpecs = { ...filters.specs, [spec.key]: newOptions };
                                                handleChange('specs', newSpecs);
                                            }}
                                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-gray-600">{option}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default AdvancedFilters;
