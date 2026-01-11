import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import SubNavbar from '../components/SubNavbar.jsx';
import ProductFilters from '../components/ProductFilters.jsx';
import ProductCard from '../components/ProductCard.jsx';

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Reuse mock products for now, but in a real app these would be fetched
    const allProducts = [
        { title: "NVIDIA GeForce RTX 4090", price: "$1,599.00", rating: 4.9, reviews: 128, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=1000" },
        { title: "AMD Ryzen 9 7950X", price: "$599.00", rating: 4.8, reviews: 85, image: "https://images.unsplash.com/photo-1555616635-6409600315ac?auto=format&fit=crop&q=80&w=1000" },
        { title: "ASUS ROG Swift OLED PG27AQDM", price: "$999.00", rating: 4.7, reviews: 42, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000" },
        // ... (more products could be added here to test pagination)
    ];

    const filtered = allProducts.filter(p => p.title.toLowerCase().includes(query.toLowerCase()) || query === '');

    // Pagination Calculation
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="min-h-screen bg-[#eef2f2] font-sans">
            <Navbar />
            <SubNavbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                            {query ? `Results for "${query}"` : 'All Products'}
                        </h1>
                        <p className="text-gray-500">Found {filtered.length} results</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Filters</h2>
                            <ProductFilters />
                        </div>
                    </aside>

                    <div className="flex-1">
                        {currentItems.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {currentItems.map((product, index) => (
                                        <ProductCard key={index} {...product} />
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="mt-12 flex justify-center gap-2">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => {
                                                    setCurrentPage(i + 1);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className={`w-10 h-10 rounded-lg font-bold transition-all ${currentPage === i + 1
                                                    ? 'bg-orange-600 text-white shadow-sm'
                                                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                                <p className="text-gray-500">Try checking your spelling or use different keywords.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SearchResultsPage;
