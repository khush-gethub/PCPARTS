import React from 'react';

const BuilderRow = ({ label, icon, part, onAdd, onRemove, onEdit }) => {
    const hasSelection = !!part;

    return (
        <tr className={`group border-b border-gray-100 transition-colors ${hasSelection ? 'bg-white hover:bg-gray-50' : 'bg-white hover:bg-gray-50'}`}>
            {/* Component Label */}
            <td className="py-6 px-4 pl-6 align-top w-[15%]">
                <div className="flex items-center gap-3">
                    <span className="text-xl opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>
                    <span className="font-bold text-gray-700 text-sm uppercase tracking-wide">{label}</span>
                </div>
            </td>

            {/* Selection Area */}
            <td className="py-4 px-4 align-middle w-[55%]">
                {hasSelection ? (
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-white border border-gray-200 rounded-lg p-2 flex-shrink-0 shadow-sm">
                            <img src={part.image} alt={part.name} className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-gray-900 text-base leading-tight hover:text-orange-600 cursor-pointer transition-colors">
                                    {part.name}
                                </h3>
                            </div>

                            {/* Key Specs Preview - Horizontal List */}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 mb-3">
                                {Object.entries(part.specs || {}).slice(0, 4).map(([key, value]) => (
                                    <div key={key} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded flex items-center">
                                        <span className="font-semibold text-gray-400 mr-1.5">{key}:</span>
                                        <span className="text-gray-700 font-medium">{value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <button className="text-xs font-bold text-gray-400 hover:text-orange-600 uppercase tracking-wider flex items-center gap-1 transition-colors" onClick={onEdit}>
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                    Change
                                </button>
                                <span className="text-gray-300">|</span>
                                <button className="text-xs font-bold text-gray-400 hover:text-red-600 uppercase tracking-wider flex items-center gap-1 transition-colors" onClick={onRemove}>
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={onAdd}
                        className="w-full h-14 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-start px-6 gap-3 text-gray-400 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50/30 transition-all group/btn"
                    >
                        <div className="w-6 h-6 rounded-full bg-gray-100 group-hover/btn:bg-orange-100 text-gray-400 group-hover/btn:text-orange-600 flex items-center justify-center transition-colors font-bold text-sm">
                            +
                        </div>
                        <span className="font-bold text-sm">Choose {label}</span>
                    </button>
                )}
            </td>

            {/* Price */}
            <td className="py-6 px-4 align-top w-[15%] text-right">
                {hasSelection ? (
                    <div className="font-mono font-bold text-gray-900 text-lg">
                        ₹{part.price.toLocaleString()}
                    </div>
                ) : (
                    <span className="text-gray-300 font-mono">-</span>
                )}
            </td>

            {/* Stock / Where */}
            <td className="py-6 px-4 align-top w-[15%] text-right pr-6">
                {hasSelection ? (
                    <div>
                        <span className="block text-xs font-bold text-gray-900 mb-1">Buy Online</span>
                        {part.stockStatus === 'In Stock' ? (
                            <span className="text-[10px] font-black uppercase text-green-600 bg-green-50 px-2 py-1 rounded inline-block tracking-wide">In Stock</span>
                        ) : (
                            <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-2 py-1 rounded inline-block tracking-wide">No Stock</span>
                        )}
                    </div>
                ) : (
                    <span className="text-gray-300 font-mono">-</span>
                )}
            </td>
        </tr>
    );
};

export default BuilderRow;
