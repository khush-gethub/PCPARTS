import React, { useState } from 'react';

const ReadyMadePCInfo = ({ title, useCase, rating, reviewsCount, price, originalPrice, discount, offers, status }) => {
    const [pincode, setPincode] = useState('');

    return (
        <div className="flex flex-col h-full pl-0 lg:pl-8">
            {/* Breadcrumb / Brand */}
            <nav className="text-sm text-gray-400 mb-2">
                Home {'>'} Ready-Made PCs {'>'} {useCase}
            </nav>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {title}
            </h1>

            {/* Ratings */}
            <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center bg-green-600 text-white px-2 py-0.5 rounded text-sm font-bold">
                    {rating} <span className="text-[10px] ml-1">★</span>
                </div>
                <span className="text-gray-500 font-medium text-sm">{reviewsCount} Ratings & {Math.floor(reviewsCount / 3)} Reviews</span>
                {status && (
                    <span className={`text-sm font-bold ml-2 ${status === 'In Stock' ? 'text-green-600' : 'text-orange-600'}`}>
                        {status}
                    </span>
                )}
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3 mb-4">
                <span className="text-4xl font-bold text-gray-900">{price}</span>
                {originalPrice && <span className="text-lg text-gray-500 line-through">{originalPrice}</span>}
                {discount && <span className="text-lg font-bold text-green-600">{discount}% off</span>}
            </div>

            {/* Offers */}
            {offers && (
                <div className="mb-6 space-y-2">
                    <h4 className="font-bold text-gray-800 text-sm">Available offers</h4>
                    {offers.map((offer, index) => (
                        <div key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                            <span className="text-green-600 font-bold">✓</span>
                            <div>
                                <span className="font-semibold">{offer.title}</span> <span>{offer.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delivery */}
            <div className="flex items-center space-x-8 mb-6 text-sm">
                <div className="text-gray-500 w-20 font-medium">Delivery</div>
                <div className="flex-1">
                    <div className="flex border-b-2 border-orange-500 w-64 pb-1 justify-between">
                        <div className="flex items-center text-gray-900 font-medium">
                            <span className="text-gray-400 mr-2">📍</span>
                            <input
                                type="text"
                                placeholder="Enter Delivery Pincode"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                className="outline-none w-full bg-transparent placeholder-gray-400"
                            />
                        </div>
                        <button className="text-orange-600 font-bold uppercase hover:text-orange-700">Check</button>
                    </div>
                </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex space-x-4 mt-auto">
                <button className="flex-1 bg-white border border-gray-300 text-gray-900 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition uppercase">
                    Add to Cart
                </button>
                <button className="flex-1 bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition shadow-lg uppercase">
                    Buy Now
                </button>
            </div>
        </div>
    );
};

export default ReadyMadePCInfo;
