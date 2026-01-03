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
    // "Fixed card height" - We use a fixed minimum height and consistent padding
    // "Fixed image aspect ratio" - aspect-square

    const isOutOfStock = stockStatus === 'Out of Stock';

    return (
        <div
            className={`
                group bg-white rounded-xl border border-gray-200 overflow-hidden 
                h-[480px] flex flex-col w-full relative
                hover:shadow-lg hover:border-orange-200 transition-all duration-300
                ${isDisabled ? 'opacity-75 grayscale' : ''}
            `}
            onClick={onClick}
        >
            {/* 1. Top Section: Image */}
            <div className="relative aspect-square bg-gray-50 border-b border-gray-50 overflow-hidden p-6">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {badges.map((badge, index) => (
                        <span key={index} className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-white/90 text-gray-700 shadow-sm border border-gray-100 backdrop-blur-sm">
                            {badge}
                        </span>
                    ))}
                </div>

                {/* Status Overlay */}
                {stockStatus && (
                    <div className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm backdrop-blur-md
                        ${isOutOfStock
                            ? 'bg-gray-100/90 text-gray-500'
                            : stockStatus === 'Low Stock'
                                ? 'bg-red-50/90 text-red-600 border border-red-100'
                                : 'bg-green-50/90 text-green-700 border border-green-100'
                        }`}>
                        {stockStatus}
                    </div>
                )}
            </div>

            {/* 2. Middle Section: Content */}
            <div className="p-5 flex flex-col flex-1">
                {/* Meta: Brand & Rating */}
                <div className="flex justify-between items-center mb-2">
                    {brand && (
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{brand}</span>
                    )}
                    {rating && (
                        <div className="flex items-center text-[10px] font-bold text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
                            <span className="text-orange-500 mr-1">★</span> {rating}
                        </div>
                    )}
                </div>

                {/* Title (Max 2 lines) */}
                <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-3 h-10 group-hover:text-orange-600 transition-colors">
                    {title}
                </h3>

                {/* Specs (Max 3 lines equivalent space) */}
                {specs.length > 0 && (
                    <div className="space-y-1 mb-4 max-h-[4.5rem] overflow-hidden">
                        {specs.slice(0, 3).map((spec, i) => (
                            <div key={i} className="text-xs text-gray-500 truncate flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-200 mr-2 flex-shrink-0"></span>
                                {spec}
                            </div>
                        ))}
                    </div>
                )}

                {/* 3. Bottom Section: Locked Price & CTA */}
                <div className="mt-auto pt-4 border-t border-gray-50">
                    <div className="flex flex-col gap-3">
                        {/* Price Area */}
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black text-gray-900 tracking-tight">{price}</span>
                            {originalPrice && (
                                <span className="text-xs text-gray-400 line-through font-medium">{originalPrice}</span>
                            )}
                        </div>

                        {/* CTA Row */}
                        <div className="grid grid-cols-2 gap-2">
                            {secondaryAction && (
                                secondaryAction.to ? (
                                    <Link
                                        to={secondaryAction.to}
                                        className="flex items-center justify-center py-2.5 rounded-lg text-xs font-bold uppercase text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 border border-gray-100 transition-all"
                                    >
                                        {secondaryAction.label}
                                    </Link>
                                ) : (
                                    <button
                                        onClick={secondaryAction.onClick}
                                        className="flex items-center justify-center py-2.5 rounded-lg text-xs font-bold uppercase text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 border border-gray-100 transition-all"
                                    >
                                        {secondaryAction.label}
                                    </button>
                                )
                            )}

                            {primaryAction && (
                                <button
                                    onClick={primaryAction.onClick}
                                    disabled={isDisabled || isOutOfStock}
                                    className={`
                                        flex items-center justify-center py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all shadow-sm
                                        ${isDisabled || isOutOfStock
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-orange-600 text-white hover:bg-orange-700 hover:shadow-orange-200 hover:scale-[1.02] active:scale-95'
                                        }
                                        ${!secondaryAction ? 'col-span-2' : ''}
                                    `}
                                >
                                    {isOutOfStock ? 'No Stock' : primaryAction.label}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UniversalCard;
