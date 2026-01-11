import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar.jsx';
import SubNavbar from '../components/SubNavbar.jsx';
import PCCard from '../components/PCCard.jsx';
import PCFilters from '../components/PCFilters.jsx';
import { api } from '../api';

const ReadyMadePCsPage = () => {
    const [pcs, setPcs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('Featured');
    const itemsPerPage = 9;

    // Filter State
    const [filters, setFilters] = useState({
        useCase: [],
        priceRange: 500000,
        cpuBrand: [],
        gpuBrand: [],
        inStockOnly: false
    });

    useEffect(() => {
        const fetchPCs = async () => {
            try {
                setLoading(true);
                const data = await api.getReadyMadePCs();

                // Format for PCCard if needed
                const formattedPCs = data.map(pc => ({
                    id: pc.pc_id,
                    name: pc.name,
                    image: pc.image,
                    cpu: pc.category === "High-End" ? "Core i9 / Ryzen 9" : "Core i5 / Ryzen 5",
                    gpu: pc.category === "High-End" ? "RTX 4090 / 4080" : "RTX 4060",
                    ram: pc.category === "High-End" ? "64GB DDR5" : "16GB DDR5",
                    price: pc.price, // Numeric price for filtering/sorting
                    formattedPrice: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(pc.price),
                    useCase: pc.category,
                    rating: (Math.random() * 0.5 + 4.5).toFixed(1),
                    inStock: Math.random() > 0.1 // Mock stock since API might not provide it yet
                }));

                setPcs(formattedPCs);
            } catch (err) {
                console.error("Error fetching PCs:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPCs();
    }, []);

    const handleFilterChange = (category, value) => {
        if (category === 'reset') {
            setFilters({
                useCase: [],
                priceRange: 500000,
                cpuBrand: [],
                gpuBrand: [],
                inStockOnly: false
            });
        } else {
            setFilters(prev => ({ ...prev, [category]: value }));
        }
        setCurrentPage(1); // Reset to page 1 on filter change
    };

    // Filtering & Sorting Logic
    const filteredPCs = useMemo(() => {
        let result = pcs;

        // 1. Use Case Filter
        if (filters.useCase.length > 0) {
            result = result.filter(pc => filters.useCase.includes(pc.useCase));
        }

        // 2. Price Filter
        result = result.filter(pc => pc.price <= filters.priceRange);

        // 3. CPU Platform
        if (filters.cpuBrand.length > 0) {
            result = result.filter(pc =>
                filters.cpuBrand.some(brand => pc.cpu.toLowerCase().includes(brand.toLowerCase()))
            );
        }

        // 4. GPU Platform
        if (filters.gpuBrand.length > 0) {
            result = result.filter(pc =>
                filters.gpuBrand.some(brand => pc.gpu.toLowerCase().includes(brand.toLowerCase()))
            );
        }

        // 5. Stock Filter
        if (filters.inStockOnly) {
            result = result.filter(pc => pc.inStock);
        }

        // Sorting
        return [...result].sort((a, b) => {
            if (sortBy === 'Price: Low to High') return a.price - b.price;
            if (sortBy === 'Price: High to Low') return b.price - a.price;
            return 0; // Default Featured
        });
    }, [pcs, filters, sortBy]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredPCs.length / itemsPerPage);
    const paginatedPCs = filteredPCs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#eef2f2] font-sans">
            <Navbar />
            <SubNavbar />

            <header className="bg-white border-b border-gray-200 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Ready-Made PCs</h1>
                    <p className="text-gray-500 max-w-2xl">
                        Hand-picked components, assembled by experts, and stress-tested for maximum performance. Choose your weapon.
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Filters - Sticky */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <PCFilters filters={filters} onFilterChange={handleFilterChange} />
                    </div>

                    {/* Right Product Grid */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                                {loading ? "Finding PCs..." : `Showing ${Math.min(startIndex + 1, filteredPCs.length)}-${Math.min(startIndex + itemsPerPage, filteredPCs.length)} of ${filteredPCs.length} Systems`}
                            </span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-white border border-gray-200 text-sm rounded-lg p-2.5 focus:ring-orange-500 focus:border-orange-500 outline-none"
                            >
                                <option>Sort by: Featured</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Newest</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {paginatedPCs.map(pc => (
                                        <PCCard key={pc.id} {...pc} price={pc.formattedPrice} />
                                    ))}
                                </div>

                                {filteredPCs.length === 0 && (
                                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 italic text-gray-500">
                                        No systems match your active filters. Try resetting!
                                    </div>
                                )}

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="mt-12 flex justify-center items-center gap-2">
                                        <button
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Previous
                                        </button>

                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => paginate(i + 1)}
                                                className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === i + 1
                                                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30'
                                                    : 'bg-white border border-gray-200 text-gray-700 hover:border-orange-500 hover:text-orange-500'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReadyMadePCsPage;
