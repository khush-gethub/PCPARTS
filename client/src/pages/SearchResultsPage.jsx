import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import Navbar from '../components/Navbar.jsx';
import SubNavbar from '../components/SubNavbar.jsx';
import ProductCard from '../components/ProductCard.jsx';
import PCCard from '../components/PCCard.jsx';
import gpuImg from '../assets/gpu.jpg'; // Fallback
import heroPC from '../assets/hero-pc.png'; // Fallback

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;
            setLoading(true);
            try {
                const data = await api.search(query);
                setResults(data.results || []);
            } catch (err) {
                console.error("Search fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="min-h-screen bg-[#eef2f2] font-sans pb-12">
            <Navbar />
            <SubNavbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                        {query ? `Results for "${query}"` : 'Global Search'}
                    </h1>
                    <p className="text-gray-500">
                        {loading ? 'Searching...' : `Found ${results.length} results`}
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="text-xl font-bold text-gray-400 animate-pulse">Loading amazing deals...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {results.length > 0 ? (
                            results.map((item, index) => {
                                if (item.type === 'readymade-pc') {
                                    return (
                                        <PCCard
                                            key={item.pc_id || index}
                                            id={item.pc_id}
                                            name={item.name}
                                            image={item.image || heroPC}
                                            price={`$${item.price}`}
                                            useCase={item.category}
                                            cpu="High Performance"
                                            gpu="Optimized"
                                            ram="Gaming Grade"
                                        />
                                    );
                                }
                                return (
                                    <ProductCard
                                        key={item.product_id || index}
                                        id={item.product_id}
                                        title={item.name}
                                        price={`$${item.price || '---'}`}
                                        image={item.image_url || gpuImg}
                                        brand={item.brand?.name}
                                    />
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-20 bg-white rounded-xl border border-gray-100">
                                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                                <p className="text-gray-500 text-sm">Try checking your spelling or use different keywords like "RTX" or "RAM".</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default SearchResultsPage;
