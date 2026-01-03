import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import ProductCard from '../components/ProductCard.jsx';
import AdvancedFilters from '../components/AdvancedFilters.jsx';

const CategoryPage = () => {
    const { categoryId } = useParams();
    const categoryName = categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1) : 'Category';
    const [sortBy, setSortBy] = useState('relevance');

    // Mock Product Data with advanced specs
    const allProducts = [
        {
            id: 1,
            title: "Intel Core i9-13900K Processor (24 Cores, 32 Threads)",
            price: "₹49,999",
            originalPrice: "₹65,000",
            image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=400",
            specs: ["LGA 1700", "24 Cores / 32 Threads", "Up to 5.8 GHz", "125W TDP"],
            stockStatus: "In Stock",
            rating: 4.9
        },
        {
            id: 2,
            title: "AMD Ryzen 9 7950X Desktop Processor",
            price: "₹52,999",
            originalPrice: "₹69,000",
            image: "https://images.unsplash.com/photo-1555618568-96041067d5ce?auto=format&fit=crop&q=80&w=400",
            specs: ["AM5 Socket", "16 Cores / 32 Threads", "Up to 5.7 GHz", "170W TDP"],
            stockStatus: "Low Stock",
            rating: 4.8
        },
        {
            id: 3,
            title: "ASUS ROG Strix GeForce RTX 4090 OC Edition 24GB",
            price: "₹1,85,000",
            originalPrice: "₹2,10,000",
            image: "https://images.unsplash.com/photo-1624705024411-db5267b2d396?auto=format&fit=crop&q=80&w=400",
            specs: ["24GB GDDR6X", "Ada Lovelace Arch", "DLSS 3.0", "3.5 Slot Design"],
            stockStatus: "In Stock",
            rating: 5.0
        },
        {
            id: 4,
            title: "MSI GeForce RTX 4060 Ti Ventus 2X Black 8GB OC",
            price: "₹38,500",
            originalPrice: "₹45,000",
            image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400",
            specs: ["8GB GDDR6", "128-bit Memory Interface", "Compact Design"],
            stockStatus: "In Stock",
            rating: 4.5
        },
        {
            id: 5,
            title: "Corsair Vengeance 32GB (2x16GB) DDR5 6000MHz",
            price: "₹12,499",
            originalPrice: "₹18,000",
            image: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=400",
            specs: ["DDR5", "6000MHz", "CL36 Latency", "XMP 3.0 Support"],
            stockStatus: "In Stock",
            rating: 4.7
        },
        {
            id: 6,
            title: "Samsung 990 Pro 2TB NVMe PCIe 4.0 SSD",
            price: "₹16,999",
            originalPrice: "₹22,999",
            image: "https://images.unsplash.com/photo-1628557672631-1a890e0c0c7e?auto=format&fit=crop&q=80&w=400",
            specs: ["PCIe Gen 4.0", "Up to 7450 MB/s", "Heatsink Optional"],
            stockStatus: "Out of Stock",
            rating: 4.9
        },
        {
            id: 7,
            title: "NZXT H9 Flow Dual-Chamber Mid-Tower Airflow Case",
            price: "₹15,499",
            originalPrice: "₹19,000",
            image: "https://images.unsplash.com/photo-1587202372616-b4345bb655a6?auto=format&fit=crop&q=80&w=400",
            specs: ["Dual Chamber", "Tempered Glass", "High Airflow", "Supports 360mm AIO"],
            stockStatus: "In Stock",
            rating: 4.8
        },
        {
            id: 8,
            title: "Corsair RM1000e Fully Modular Low-Noise ATX Power Supply",
            price: "₹14,200",
            originalPrice: "₹17,500",
            image: "https://images.unsplash.com/photo-1587202372634-32705e3bf42c?auto=format&fit=crop&q=80&w=400",
            specs: ["1000W", "80 Plus Gold", "ATX 3.0 Compatible", "Zero RPM Mode"],
            stockStatus: "In Stock",
            rating: 4.6
        }
    ];

    return (
        <div className="min-h-screen bg-[#eef2f2] font-sans pb-12">
            <Navbar />

            {/* Breadcrumb Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="text-sm text-gray-500 font-medium">
                        <Link to="/" className="hover:text-orange-600 transition">Home</Link>
                        <span className="mx-2">/</span>
                        <Link to="/category/components" className="hover:text-orange-600 transition">Components</Link>
                        {categoryId && (
                            <>
                                <span className="mx-2">/</span>
                                <span className="text-gray-900">{categoryName}</span>
                            </>
                        )}
                    </nav>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Column: Stats & Filters (Sticky) - 25% */}
                    <div className="w-full lg:w-1/4 flex-shrink-0">
                        <div className="sticky top-24">
                            <AdvancedFilters categoryId={categoryId} />
                        </div>
                    </div>

                    {/* Right Column: Product Grid - 75% */}
                    <div className="flex-1">
                        {/* Top Controls */}
                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center">
                            <h1 className="text-lg font-bold text-gray-900 mb-2 sm:mb-0">
                                {categoryName} <span className="text-gray-400 font-normal text-sm ml-2">({allProducts.length} Results)</span>
                            </h1>

                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
                                <select
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2 outline-none"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="relevance">Relevance</option>
                                    <option value="price_low">Price: Low to High</option>
                                    <option value="price_high">Price: High to Low</option>
                                    <option value="rating">Rating</option>
                                    <option value="newest">Newest First</option>
                                </select>
                            </div>
                        </div>

                        {/* Selected Filter Chips (Mock) */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="bg-white border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-sm">
                                Brand: ASUS <button className="ml-2 text-gray-400 hover:text-red-500">×</button>
                            </span>
                            <span className="bg-white border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-sm">
                                In Stock <button className="ml-2 text-gray-400 hover:text-red-500">×</button>
                            </span>
                            <button className="text-xs text-orange-600 font-bold hover:underline ml-2">Clear All</button>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {allProducts.map(product => (
                                <div key={product.id} className="h-full">
                                    <ProductCard {...product} />
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-12 flex justify-center">
                            <nav className="flex items-center gap-2">
                                <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 disabled:opacity-50" disabled>
                                    ←
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center bg-orange-600 text-white rounded-lg font-bold shadow-sm">1</button>
                                <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">2</button>
                                <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">3</button>
                                <span className="text-gray-400 px-2">...</span>
                                <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                                    →
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CategoryPage;
