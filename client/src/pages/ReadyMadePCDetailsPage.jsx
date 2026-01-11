import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import SubNavbar from '../components/SubNavbar.jsx';
import ProductGallery from '../components/ProductGallery.jsx';
import ReadyMadePCInfo from '../components/ReadyMadePCInfo.jsx';
import ProductSpecsAccordion from '../components/ProductSpecsAccordion.jsx';
import ProductBenchmarks from '../components/ProductBenchmarks.jsx';
import { api } from '../api';

const ReadyMadePCDetailsPage = () => {
    const { id } = useParams();
    const [pcData, setPcData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPC = async () => {
            try {
                setLoading(true);
                const data = await api.getReadyMadePCById(id);

                // Format data for the UI
                const formatted = {
                    name: data.name,
                    price: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(data.price),
                    originalPrice: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(data.price * 1.2),
                    discount: 15,
                    useCase: data.category,
                    status: "In Stock",
                    rating: 4.8,
                    reviewsCount: 42,
                    images: [
                        data.image,
                        data.Image2 || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1000",
                        data.Image3 || "https://cdn.pixabay.com/photo/2019/07/28/05/18/gaming-pc-4368146_1280.jpg"
                    ].filter(img => img),
                    offers: [
                        { title: "Bank Offer", desc: "Flat ₹5000 off on HDFC Credit Cards" },
                        { title: "No Cost EMI", desc: "Available for up to 12 months" }
                    ],
                    highlights: data.items.slice(0, 6).map(item => item.product_id?.name || "Premium Component"),
                    specs: [
                        {
                            category: "Core Components",
                            items: data.items.slice(0, 4).map(item => ({
                                label: item.product_id?.category_id?.name || "Part",
                                value: item.product_id?.name || "Spec Details"
                            }))
                        }
                    ]
                };

                setPcData(formatted);
            } catch (err) {
                console.error("Error fetching PC details:", err);
                setError("Failed to load PC details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPC();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#eef2f2]">
                <Navbar /><SubNavbar />
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (error || !pcData) {
        return (
            <div className="min-h-screen bg-[#eef2f2]">
                <Navbar /><SubNavbar />
                <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                    <h2 className="text-2xl font-bold text-red-600">{error || "PC Not Found"}</h2>
                    <Link to="/ready-made-pcs" className="mt-4 inline-block text-blue-600 hover:underline">Back to All PCs</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#eef2f2] font-sans pb-12">
            <Navbar />
            <SubNavbar />

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

                {/* Benchmarks Section */}
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
                                <Link to={`/ready-made-pc/${id}/components`} className="text-sm font-bold text-blue-600 hover:underline">
                                    View Full Component List &gt;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Specs Accordion */}
                <ProductSpecsAccordion specs={pcData.specs} />

                {/* Ratings & Reviews */}
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
            </div>
        </div>
    );
};

export default ReadyMadePCDetailsPage;
