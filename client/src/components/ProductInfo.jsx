import React, { useState } from 'react';

const ProductInfo = ({ title, brand, rating, reviewsCount, price, originalPrice, discount, offers, onAddToCart, onBuyNow }) => {
    const [pincode, setPincode] = useState('');

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


            {/* CTA Buttons */}
            <div className="flex space-x-4 mt-auto">
                <button
                    onClick={onAddToCart}
                    className="flex-1 bg-white border border-gray-300 text-gray-900 py-4 rounded-md font-bold text-lg hover:shadow-lg transition uppercase"
                >
                    Add to Cart
                </button>
                <button
                    onClick={onBuyNow}
                    className="flex-1 bg-orange-600 text-white py-4 rounded-md font-bold text-lg hover:bg-orange-700 transition shadow-lg uppercase"
                >
                    Buy Now
                </button>
            </div>
        </div>
    );
};

export default ProductInfo;
