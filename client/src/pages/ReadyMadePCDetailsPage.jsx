import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import ProductGallery from '../components/ProductGallery.jsx';
import ReadyMadePCInfo from '../components/ReadyMadePCInfo.jsx';
import ProductSpecsAccordion from '../components/ProductSpecsAccordion.jsx';
import ProductBenchmarks from '../components/ProductBenchmarks.jsx';

const ReadyMadePCDetailsPage = () => {
    const { id } = useParams();

    // Mock Data
    const pcData = {
        name: "Hyperion X1 - Ultimate Gaming Rig",
        price: "₹3,45,999",
        originalPrice: "₹4,10,000",
        discount: 15,
        useCase: "Gaming",
        status: "In Stock",
        rating: 4.8,
        reviewsCount: 42,
        images: [
            "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1000",
            "https://cdn.pixabay.com/photo/2019/07/28/05/18/gaming-pc-4368146_1280.jpg",
            "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1000"
        ],
        offers: [
            { title: "Bank Offer", desc: "Flat ₹5000 off on HDFC Credit Cards" },
            { title: "No Cost EMI", desc: "Available for up to 12 months" }
        ],
        highlights: [
            "Intel Core i9-13900K (24 Cores, 32 Threads)",
            "NVIDIA GeForce RTX 4090 24GB GDDR6X",
            "64GB DDR5 6000MHz RGB Memory",
            "2TB Samsung 990 Pro NVMe SSD",
            "Liquid Cooled (360mm AIO)",
            "Windows 11 Pro Pre-installed"
        ],
        specs: [
            {
                category: "Core Components",
                items: [
                    { label: "Processor", value: "Intel Core i9-13900K" },
                    { label: "Motherboard", value: "ASUS ROG Maximus Z790 Hero" },
                    { label: "Graphics Card", value: "NVIDIA GeForce RTX 4090 24GB" },
                    { label: "RAM", value: "64GB DDR5 6000MHz" }
                ]
            },
            {
                category: "Storage & Power",
                items: [
                    { label: "Primary Storage", value: "2TB Samsung 990 Pro Gen4 SSD" },
                    { label: "Power Supply", value: "1200W Platinum Fully Modular" },
                    { label: "Cooling", value: "NZXT Kraken Z73 360mm AIO" }
                ]
            },
            {
                category: "Chassis & OS",
                items: [
                    { label: "Cabinet", value: "Lian Li O11 Dynamic Evo" },
                    { label: "Operating System", value: "Windows 11 Pro (Activated)" },
                    { label: "Extras", value: "Custom Sleeved Cables" }
                ]
            }
        ]
    };

    return (
        <div className="min-h-screen bg-[#eef2f2] font-sans pb-12">
            <Navbar />

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="bg-white rounded-sm shadow-sm flex flex-col lg:flex-row p-4 lg:p-6 mb-4">
                    {/* Left Column: Gallery (40%) */}
                    <div className="lg:w-[40%] flex-shrink-0">
                        <ProductGallery images={pcData.images} />
                    </div>

                    {/* Right Column: Info (60%) */}
                    <div className="lg:w-[60%] mt-6 lg:mt-0">
                        <ReadyMadePCInfo
                            title={pcData.name}
                            useCase={pcData.useCase}
                            rating={pcData.rating}
                            reviewsCount={pcData.reviewsCount}
                            price={pcData.price}
                            originalPrice={pcData.originalPrice}
                            discount={pcData.discount}
                            offers={pcData.offers}
                            status={pcData.status}
                        />
                    </div>
                </div>

                {/* Benchmarks Section (Unique to PCs but styled nicely) */}
                <div className="mb-4">
                    <ProductBenchmarks />
                </div>

                {/* Highlights & Seller Info Section */}
                <div className="bg-white rounded-sm shadow-sm p-6 mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">System Highlights</h3>
                    <div className="flex flex-col md:flex-row gap-8">
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 flex-1">
                            {pcData.highlights.map((highlight, i) => (
                                <li key={i}>{highlight}</li>
                            ))}
                        </ul>

                        <div className="md:w-1/3 border-l border-gray-100 pl-8">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-gray-500 text-sm">Assembled By</span>
                                <span className="font-bold text-orange-600">Antigravity Systems</span>
                                <span className="bg-orange-600 text-white text-xs px-1.5 rounded-sm">Elite</span>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-gray-300 mr-2"></span>3 Years Onsite Warranty</li>
                                <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-gray-300 mr-2"></span>Lifetime Tech Support</li>
                            </ul>
                            <div className="mt-4">
                                <Link to={`/ready-made-pc/${id || 1}/components`} className="text-sm font-bold text-blue-600 hover:underline">
                                    View Full Component List &gt;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Specs Accordion */}
                <ProductSpecsAccordion specs={pcData.specs} />

                {/* Ratings & Reviews (Simplified Copy for now) */}
                <div className="bg-white rounded-sm shadow-sm p-6 mt-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Ratings & Reviews</h2>
                    </div>
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="text-center md:text-left">
                            <div className="text-5xl font-bold text-gray-900">4.8 <span className="text-3xl text-gray-400">★</span></div>
                            <p className="text-gray-500 text-sm mt-1">42 Ratings &<br />12 Reviews</p>
                        </div>
                        <div className="flex-1">
                            {/* Simple Review */}
                            <div className="border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded font-bold">5 ★</span>
                                    <span className="font-bold text-gray-900 text-sm">Beast of a machine!</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-2">Can handle anything I throw at it. Rendering 4K video is a breeze. Cable management is top notch.</p>
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Arjun K.</span>
                                    <span>1 week ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommended Upgrades / Related Products */}
                <div className="bg-white rounded-sm shadow-sm p-6 mt-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">You might be interested in</h2>
                    <div className="flex space-x-6 overflow-x-auto pb-4 hide-scrollbar">
                        {[
                            { title: "4K Gaming Monitor 144Hz", price: "₹45,999", img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600", discount: "Save ₹10k" },
                            { title: "Pro Streamer Kit (Cam + Light)", price: "₹12,499", img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=600", discount: "15% off" },
                            { title: "Mechanical Keyboard RGB", price: "₹8,999", img: "https://images.unsplash.com/photo-1587829741301-dc798b91add1?auto=format&fit=crop&q=80&w=600", discount: "Best Seller" },
                            { title: "Wireless Gaming Headset", price: "₹14,999", img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=600", discount: "New" },
                            { title: "Extended Gaming Mousepad", price: "₹1,500", img: "https://images.unsplash.com/photo-1615663245857-acda5b2b8d64?auto=format&fit=crop&q=80&w=600", discount: "20% off" },
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

export default ReadyMadePCDetailsPage;
