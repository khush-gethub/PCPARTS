import React from 'react';

const PCFilters = ({ filters, onFilterChange }) => {
    const handleCheckboxChange = (category, value) => {
        const currentValues = filters[category] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(item => item !== value)
            : [...currentValues, value];
        onFilterChange(category, newValues);
    };

    const handleValueChange = (category, value) => {
        onFilterChange(category, value);
    };

    return (
        <aside className="w-full">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                    <button
                        onClick={() => onFilterChange('reset')}
                        className="text-xs text-orange-600 font-bold uppercase hover:text-orange-700"
                    >
                        Reset
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Use Case */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Use Case</h3>
                        <div className="space-y-2">
                            {['Gaming', 'Workstation', 'Content Creation', 'Budget'].map(type => (
                                <label key={type} className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={filters.useCase?.includes(type)}
                                        onChange={() => handleCheckboxChange('useCase', type)}
                                        className="form-checkbox h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-gray-900">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Price Range</h3>
                        <div className="flex justify-between text-xs text-gray-500 mb-2 font-medium">
                            <span>₹30k</span>
                            <span>₹{(filters.priceRange || 500000).toLocaleString()}</span>
                        </div>
                        <input
                            type="range"
                            min="30000"
                            max="500000"
                            step="5000"
                            value={filters.priceRange || 500000}
                            onChange={(e) => handleValueChange('priceRange', parseInt(e.target.value))}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                        />
                    </div>

                    {/* CPU Brand */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">CPU Platform</h3>
                        <div className="flex gap-2">
                            {['Intel', 'AMD'].map(brand => (
                                <button
                                    key={brand}
                                    onClick={() => handleCheckboxChange('cpuBrand', brand)}
                                    className={`flex-1 border rounded-md py-2 text-sm font-medium transition ${filters.cpuBrand?.includes(brand)
                                        ? 'border-orange-500 text-orange-600 bg-orange-50'
                                        : 'border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-600'
                                        }`}
                                >
                                    {brand}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* GPU Brand */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">GPU Platform</h3>
                        <div className="flex gap-2">
                            {['NVIDIA', 'AMD', 'Intel'].map(brand => (
                                <button
                                    key={brand}
                                    onClick={() => handleCheckboxChange('gpuBrand', brand)}
                                    className={`flex-1 border rounded-md py-2 text-sm font-medium transition ${filters.gpuBrand?.includes(brand)
                                        ? 'border-orange-500 text-orange-600 bg-orange-50'
                                        : 'border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-600'
                                        }`}
                                >
                                    {brand}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stock Status */}
                    <div>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input
                                    type="checkbox"
                                    checked={filters.inStockOnly}
                                    onChange={(e) => handleValueChange('inStockOnly', e.target.checked)}
                                    className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 checked:right-0 checked:border-orange-600"
                                />
                                <div className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors ${filters.inStockOnly ? 'bg-orange-600' : 'bg-gray-300'}`}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700">In Stock Only</span>
                        </label>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default PCFilters;
