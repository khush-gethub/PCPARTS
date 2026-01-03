import React, { useState } from 'react';

const ProductInfo = ({ title, brand, rating, reviewsCount, price, originalPrice, discount, offers }) => {
    const [pincode, setPincode] = useState('');
    const [selectedRam, setSelectedRam] = useState('16GB');
    const [selectedStorage, setSelectedStorage] = useState('1TB SSD');

    return (
        <div className="flex flex-col h-full pl-0 lg:pl-8">
            {/* Breadcrumb / Brand */}
            <nav className="text-sm text-gray-400 mb-2">
                Home {'>'} Components {'>'} {brand}
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
                <span className="text-blue-600 text-sm font-semibold cursor-pointer">Assured</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3 mb-4">
                <span className="text-4xl font-bold text-gray-900">{price}</span>
                <span className="text-lg text-gray-500 line-through">{originalPrice}</span>
                <span className="text-lg font-bold text-green-600">{discount}% off</span>
            </div>

            {/* Offers */}
            <div className="mb-6 space-y-2">
                <h4 className="font-bold text-gray-800 text-sm">Available offers</h4>
                {offers.map((offer, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                        <img src="https://rukminim1.flixcart.com/www/36/36/promos/06/09/2016/c22c9fc4-0555-4460-8401-bf5c28d7ba29.png?q=90" alt="" className="w-5 h-5 mt-0.5" />
                        <div>
                            <span className="font-semibold">{offer.title}</span> <span>{offer.desc}</span>
                            <span className="text-blue-600 font-semibold cursor-pointer ml-1">T&C</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delivery */}
            <div className="flex items-center space-x-8 mb-6 text-sm">
                <div className="text-gray-500 w-20 font-medium">Delivery</div>
                <div className="flex-1">
                    <div className="flex border-b-2 border-orange-500 w-64 pb-1 justify-between">
                        <div className="flex items-center text-gray-900 font-medium">
                            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
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
                    <div className="text-xs text-green-600 mt-2 font-medium">
                        Expected Delivery by <b>Tomorrow, 11 PM</b>
                    </div>
                </div>
            </div>

            {/* Variants */}
            <div className="grid grid-cols-[80px_1fr] gap-4 mb-8 text-sm items-center">
                <span className="text-gray-500 font-medium">RAM</span>
                <div className="flex space-x-3">
                    {['16GB', '32GB', '64GB'].map(ram => (
                        <button
                            key={ram}
                            onClick={() => setSelectedRam(ram)}
                            className={`px-4 py-2 border rounded-md font-medium transition-all ${selectedRam === ram
                                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                                    : 'border-gray-300 text-gray-800 hover:border-gray-400'
                                }`}
                        >
                            {ram}
                        </button>
                    ))}
                </div>

                <span className="text-gray-500 font-medium">Storage</span>
                <div className="flex space-x-3">
                    {['512GB SSD', '1TB SSD', '2TB SSD'].map(store => (
                        <button
                            key={store}
                            onClick={() => setSelectedStorage(store)}
                            className={`px-4 py-2 border rounded-md font-medium transition-all ${selectedStorage === store
                                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                                    : 'border-gray-300 text-gray-800 hover:border-gray-400'
                                }`}
                        >
                            {store}
                        </button>
                    ))}
                </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex space-x-4 mt-auto">
                <button className="flex-1 bg-white border border-gray-300 text-gray-900 py-4 rounded-md font-bold text-lg hover:shadow-lg transition uppercase">
                    Add to Cart
                </button>
                <button className="flex-1 bg-orange-600 text-white py-4 rounded-md font-bold text-lg hover:bg-orange-700 transition shadow-lg uppercase">
                    Buy Now
                </button>
            </div>
        </div>
    );
};

export default ProductInfo;
