import React from 'react';
import Navbar from '../components/Navbar.jsx';
import ProductGallery from '../components/ProductGallery.jsx';
import ProductInfo from '../components/ProductInfo.jsx';
import ProductSpecsAccordion from '../components/ProductSpecsAccordion.jsx';

// Mock images
const images = [
    "https://cdn.pixabay.com/photo/2019/07/28/05/18/gaming-pc-4368146_1280.jpg",
    "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=1000"
];

const ProductDetailsPage = () => {
    return (
        <div className="min-h-screen bg-[#eef2f2] font-sans pb-12">
            <Navbar />

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="bg-white rounded-sm shadow-sm flex flex-col lg:flex-row p-4 lg:p-6 mb-4">
                    {/* Left Column: Gallery (40% roughly) */}
                    <div className="lg:w-[40%] flex-shrink-0">
                        <ProductGallery images={images} />
                    </div>

                    {/* Right Column: Info (60% roughly) */}
                    <div className="lg:w-[60%] mt-6 lg:mt-0">
                        <ProductInfo
                            title="zebpc MZB0_I7_2000_16GB_512SSD_4GB I7 2600 (16 GB RAM/Nvidia Graphics/512 GB SSD Capacity/Windows 11 Home (64-bit)/4 GB Graphics Memory) Mid Tower with MS Office"
                            brand="zebpc"
                            rating={4.3}
                            reviewsCount={1240}
                            price="₹22,999"
                            originalPrice="₹49,999"
                            discount={52}
                            offers={[
                                { title: "Bank Offer", desc: "5% Cashback on Flipkart Axis Bank Card" },
                                { title: "Bank Offer", desc: "10% off on ICICI Bank Credit Card Transactions" },
                                { title: "Partner Offer", desc: "Purchase now & get a surprise cashback coupon" },
                            ]}
                        />
                    </div>
                </div>

                {/* Highlights & Seller Info Section */}
                <div className="bg-white rounded-sm shadow-sm p-6 mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Product Highlights</h3>
                    <div className="flex flex-col md:flex-row gap-8">
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 flex-1">
                            <li>Processor: Intel Core i7 2600 (3.4 GHz base, up to 3.8 GHz)</li>
                            <li>RAM: 16 GB DDR3</li>
                            <li>Graphics: 4 GB Dedicated NVIDIA Graphics</li>
                            <li>Storage: 512 GB SSD</li>
                            <li>OS: Windows 11 Home (64-bit)</li>
                            <li>Warranty: 1 Year Manufacturer Warranty</li>
                        </ul>

                        <div className="md:w-1/3 border-l border-gray-100 pl-8">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-gray-500 text-sm">Seller</span>
                                <span className="font-bold text-blue-600">SuperComNet</span>
                                <span className="bg-blue-600 text-white text-xs px-1.5 rounded-sm">4.9 ★</span>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-gray-300 mr-2"></span>7 Days Replacement Policy</li>
                                <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-gray-300 mr-2"></span>GST invoice available</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Specs Accordion */}
                <ProductSpecsAccordion />

                {/* Frequently Bought Together */}
                <div className="bg-white rounded-sm shadow-sm p-6 mt-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Bought Together</h2>
                    <div className="flex flex-col md:flex-row items-center gap-6 overflow-x-auto pb-4">
                        {[
                            { img: "https://m.media-amazon.com/images/I/61p-lC+qXkL.jpg", title: "Gaming Keyboard", price: "₹1,299" },
                            { img: "https://m.media-amazon.com/images/I/71t-9E8cWzL._AC_SS450_.jpg", title: "1080p Webcam", price: "₹1,999" },
                            { img: "https://m.media-amazon.com/images/I/61UxfWpw+AL._AC_UF1000,1000_QL80_.jpg", title: "WiFi Adapter", price: "₹499" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 min-w-[200px]">
                                {i > 0 && <span className="text-gray-400 text-2xl font-light">+</span>}
                                <div className="border border-gray-200 rounded p-2 text-center w-full hover:shadow-lg transition">
                                    <img src={item.img} alt="" className="h-24 mx-auto object-contain mb-2" />
                                    <p className="text-xs text-gray-900 font-medium truncate">{item.title}</p>
                                    <p className="text-sm font-bold text-gray-900">{item.price}</p>
                                </div>
                            </div>
                        ))}
                        <div className="ml-auto flex flex-col items-center">
                            <span className="text-gray-500 text-sm mb-2">Total Price:</span>
                            <span className="text-2xl font-bold text-gray-900">₹26,796</span>
                            <button className="mt-2 bg-gray-800 text-white px-6 py-2 rounded font-bold text-sm uppercase">Add 3 items</button>
                        </div>
                    </div>
                </div>

                {/* Ratings & Reviews */}
                <div className="bg-white rounded-sm shadow-sm p-6 mt-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Ratings & Reviews</h2>
                        <button className="border border-gray-300 px-4 py-2 rounded text-sm font-bold shadow-sm hover:shadow-md">Rate Product</button>
                    </div>
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="text-center md:text-left">
                            <div className="text-5xl font-bold text-gray-900">4.3 <span className="text-3xl text-gray-400">★</span></div>
                            <p className="text-gray-500 text-sm mt-1">1,240 Ratings &<br />345 Reviews</p>
                        </div>
                        <div className="flex-1 space-y-2 max-w-sm">
                            {[5, 4, 3, 2, 1].map(stars => (
                                <div key={stars} className="flex items-center text-sm">
                                    <span className="w-4 font-bold">{stars}★</span>
                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full mx-3 overflow-hidden">
                                        <div className={`h-full rounded-full ${stars >= 4 ? 'bg-green-500' : stars === 3 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${Math.random() * 100}%` }}></div>
                                    </div>
                                    <span className="text-gray-400 text-xs w-8">{Math.floor(Math.random() * 500)}</span>
                                </div>
                            ))}
                        </div>
                        {/* Review Cards */}
                        <div className="flex-1 space-y-4">
                            <div className="border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded font-bold">5 ★</span>
                                    <span className="font-bold text-gray-900 text-sm">Excellent PC for the price!</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">I am running GTA 5, Valorant and CS2 smoothly. Boot time is less than 10 seconds thanks to SSD.</p>
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Rahul Verma</span>
                                    <span>2 months ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommended Products / You Might Be Interested In */}
                <div className="bg-white rounded-sm shadow-sm p-6 mt-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">You might be interested in</h2>
                    <div className="flex space-x-6 overflow-x-auto pb-4 hide-scrollbar">
                        {[
                            { title: "Gaming Monitor 27 inch", price: "₹15,999", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000", discount: "40% off" },
                            { title: "Wireless Gaming Mouse", price: "₹2,499", img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=1000", discount: "15% off" },
                            { title: "Mechanical Keyboard RGB", price: "₹3,999", img: "https://images.unsplash.com/photo-1587829741301-dc798b91add1?auto=format&fit=crop&q=80&w=1000", discount: "25% off" },
                            { title: "Gaming Headset 7.1", price: "₹1,999", img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000", discount: "50% off" },
                            { title: "Webcam 1080p 60fps", price: "₹4,500", img: "https://images.unsplash.com/photo-1587202372634-32705e3bf42c?auto=format&fit=crop&q=80&w=1000", discount: "10% off" },
                        ].map((item, index) => (
                            <div key={index} className="flex-shrink-0 w-48 border border-gray-200 rounded-lg hover:shadow-lg transition cursor-pointer p-4 group">
                                <div className="relative h-40 mb-3 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                                    <img src={item.img} alt={item.title} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300" />
                                    <div className="absolute top-2 right-2 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {item.discount}
                                    </div>
                                </div>
                                <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 min-h-[40px]">{item.title}</h3>
                                <div className="flex items-center space-x-2">
                                    <span className="font-bold text-gray-900">{item.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
