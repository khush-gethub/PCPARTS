import React from 'react';
import { Link } from 'react-router-dom';

const UniversalCard = ({
    image,
    title,
    brand,
    badges = [],
    specs = [],
    price,
    originalPrice,
    primaryAction,
    secondaryAction,
    stockStatus,
    rating,
    isDisabled = false,
    onClick
}) => {
    const isOutOfStock = stockStatus === 'Out of Stock';

    return (
        <div
            className={`
                group relative bg-white border border-gray-200 rounded-lg overflow-hidden 
                hover:border-orange-500/50 hover:shadow-2xl transition-all duration-300
                flex flex-col w-full
                ${isDisabled ? 'opacity-75 grayscale' : ''}
            `}
            onClick={onClick}
        >
            {/* 1. Badge Overlay */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                {badges.map((badge, index) => {
                    // Check 'Verified Fit' or 'Pro-Assembled' for styling
                    const badgeLower = typeof badge === 'string' ? badge.toLowerCase() : '';
                    const isVerified = badgeLower.includes('verified') || badgeLower.includes('fitted');
                    const isPro = badgeLower.includes('pro-assembled');

                    let colors = 'bg-gray-100 text-gray-700 border-gray-200';
                    let icon = null;

                    if (isVerified) {
                        colors = 'bg-green-50 text-green-700 border-green-100';
                        icon = <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>;
                    } else if (isPro) {
                        colors = 'bg-orange-50 text-orange-700 border-orange-100';
                        icon = <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>;
                    }

                    return (
                        <div key={index} className={`${colors} text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border flex items-center gap-1`}>
                            {icon}
                            {badge}
                        </div>
                    );
                })}
            </div>

            {/* 1. Top Section: Image */}
            <div className="relative aspect-[5/4] bg-gray-50 border-b border-gray-50 overflow-hidden p-6">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                />

                {/* Status Overlay (Top Right) */}
                {stockStatus && (
                    <div className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm backdrop-blur-md z-10
                        ${isOutOfStock
                            ? 'bg-gray-100/90 text-gray-500'
                            : stockStatus === 'Low Stock'
                                ? 'bg-red-50/90 text-red-600 border border-red-100'
                                : 'bg-green-50/90 text-green-700 border border-green-100'
                        }`}>
                        {stockStatus}
                    </div>
                )}

                {/* Quick View / Secondary Action Overlay */}
                {secondaryAction && (
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        {secondaryAction.to ? (
                            <span className="bg-white text-orange-600 font-bold px-6 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                {secondaryAction.label}
                            </span>
                        ) : (
                            <span className="bg-white text-orange-600 font-bold px-6 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                {secondaryAction.label}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* 3. Content Section */}
            <div className="p-5 flex flex-col flex-1">
                {/* Brand & Rating */}
                <div className="flex justify-between items-start mb-2">
                    {brand && (
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{brand}</p>
                    )}

                    <div className="flex text-orange-400 items-center">
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        <span className="text-xs font-bold text-gray-500 ml-1">{rating || '5.0'}</span>
                    </div>
                </div>

                {/* Title (Max 3 lines to fit long names) */}
                <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-3 mb-3 h-[3.25rem] group-hover:text-orange-600 transition-colors">
                    {title}
                </h3>

                {/* Specs Grid */}
                {specs.length > 0 && (
                    <div className="border-t border-b border-gray-100 py-3 mb-4">
                        <div className="grid grid-cols-3 gap-2 text-center divide-x divide-gray-100">
                            {specs.slice(0, 3).map((spec, i) => {
                                const isObj = typeof spec === 'object' && spec !== null;
                                const label = isObj ? spec.label : 'Spec';
                                const val = isObj ? spec.val : spec;

                                return (
                                    <div key={i} className="flex flex-col px-1 overflow-hidden">
                                        <span className="text-[10px] text-gray-400 uppercase font-bold truncate">{label}</span>
                                        <span className="text-xs font-bold text-gray-700 truncate">{val}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Bottom Section: Price & Primary Action */}
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-gray-900">{price}</span>
                        {originalPrice && (
                            <span className="text-xs text-gray-400 line-through font-medium">{originalPrice}</span>
                        )}
                    </div>

                    {primaryAction && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                primaryAction.onClick(e);
                            }}
                            disabled={isDisabled || isOutOfStock}
                            className={`
                                rounded-full transition-all flex items-center justify-center font-bold uppercase text-sm
                                ${primaryAction.label === 'Add to Cart'
                                    ? 'text-orange-600 p-2 hover:bg-orange-50' // Icon only style look
                                    : 'text-orange-600 p-2 hover:bg-orange-50 px-4' // Text button style
                                }
                            `}
                        >
                            {primaryAction.label === 'Add to Cart' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            ) : (
                                primaryAction.label
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UniversalCard;
