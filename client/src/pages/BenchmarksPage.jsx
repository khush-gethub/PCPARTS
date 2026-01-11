import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../api';
import Navbar from '../components/Navbar.jsx';
import SubNavbar from '../components/SubNavbar.jsx';
import Footer from '../components/Footer.jsx';

const BenchmarksPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [notification, setNotification] = useState(null);
    const itemsPerPage = 9;
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await api.getBenchmarkTable();

                const formattedProducts = data.map(item => ({
                    id: item.product_id,
                    name: item.name,
                    image: item.image,
                    capacity: item.capacity,
                    cache: item.cache,
                    type: item.type,
                    interface: item.interface,
                    writeSpeed: item.write_speed,
                    readSpeed: item.read_speed,
                    maxWrite: item.max_write,
                    maxRead: item.max_read,
                    rating: item.rating,
                    reviews: item.reviews,
                    price: item.price
                }));

                setProducts(formattedProducts);
                setError(null);
            } catch (err) {
                console.error("Error fetching benchmark table:", err);
                setError("Failed to load benchmark results.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddToCart = (product) => {
        addToCart({
            id: `benchmark-${product.id}`,
            name: product.name,
            price: product.price,
            image: product.image,
            category: "Storage"
        });

        setNotification(`${product.name} added to cart!`);
        setTimeout(() => setNotification(null), 3000);
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm]);

    // Pagination logic
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    const renderStars = (rating) => {
        return (
            <div className="flex text-amber-500 text-xs">
                {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>{i < Math.floor(rating) ? "★" : "☆"}</span>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
            <Navbar />
            <SubNavbar />

            <main className="flex-grow max-w-[1400px] w-full mx-auto p-4 md:p-6 lg:p-8">
                <h1 className="text-2xl font-bold mb-4 text-slate-800">
                    {loading ? "Loading..." : `${filteredProducts.length} Compatible Products`}
                </h1>

                {notification && (
                    <div className="fixed top-24 right-8 z-[100] bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl animate-bounce flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-bold">{notification}</span>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Control Bar */}
                <div className="bg-white border border-slate-200 border-b-0 rounded-t-lg p-3 flex flex-col md:flex-row justify-end items-center gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative group w-full md:w-64">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                            <input
                                type="text"
                                className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                placeholder="Search Storage..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm">
                            Add From Filter
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-200 rounded-b-lg overflow-x-auto custom-scrollbar-hide shadow-sm">
                    {loading ? (
                        <div className="p-10 text-center text-slate-500 animate-pulse">
                            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            Loading benchmark data...
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse text-[12px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-3 font-semibold text-slate-500 uppercase tracking-tight pl-6">Name</th>
                                    <th className="p-3 font-semibold text-slate-500 uppercase tracking-tight">Cap.</th>
                                    <th className="p-3 font-semibold text-slate-500 uppercase tracking-tight">Cache</th>
                                    <th className="p-3 font-semibold text-slate-500 uppercase tracking-tight">Type</th>
                                    <th className="p-3 font-semibold text-slate-500 uppercase tracking-tight">Interface</th>
                                    <th className="p-3 font-semibold text-slate-500 uppercase tracking-tight">Seq. Write</th>
                                    <th className="p-3 font-semibold text-slate-500 uppercase tracking-tight">Seq. Read</th>
                                    <th className="p-3 font-semibold text-slate-500 uppercase tracking-tight">Rating</th>
                                    <th className="p-3 font-semibold text-slate-500 uppercase tracking-tight text-right pr-6">Price</th>
                                    <th className="p-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProducts.length > 0 ? (
                                    paginatedProducts.map(product => (
                                        <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                            <td className="p-3 pl-6">
                                                <div className="flex items-center gap-2.5 min-w-[200px]">
                                                    <img src={product.image} alt="" className="w-8 h-8 object-contain bg-white p-0.5 rounded border border-slate-100 shrink-0" />
                                                    <span className="font-semibold text-slate-800 truncate max-w-[200px]" title={product.name}>{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 whitespace-nowrap font-medium text-slate-600">{product.capacity}</td>
                                            <td className="p-3 whitespace-nowrap text-slate-500">{product.cache}</td>
                                            <td className="p-3 whitespace-nowrap text-slate-500">{product.type}</td>
                                            <td className="p-3 whitespace-nowrap text-slate-500">{product.interface}</td>
                                            <td className="p-3">
                                                <div className="w-28 xl:w-32">
                                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-700"
                                                            style={{ width: `${Math.min(100, (product.writeSpeed / product.maxWrite) * 100)}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-500 mt-1 block leading-none">{product.writeSpeed.toLocaleString()} MB/s</span>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="w-28 xl:w-32">
                                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-700 delay-100"
                                                            style={{ width: `${Math.min(100, (product.readSpeed / product.maxRead) * 100)}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-500 mt-1 block leading-none">{product.readSpeed.toLocaleString()} MB/s</span>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-1.5">
                                                    {renderStars(product.rating)}
                                                    <span className="text-slate-400 text-[10px] font-bold">({product.reviews})</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-right pr-6">
                                                <span className="font-bold text-slate-900">
                                                    {product.price > 0 ? `$${product.price.toFixed(2)}` : "N/A"}
                                                </span>
                                            </td>
                                            <td className="p-3 pr-6">
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className="bg-blue-600 text-white px-3 py-1.5 rounded text-[11px] font-bold hover:bg-blue-700 transition-all shadow-sm active:scale-95 disabled:bg-slate-200 disabled:text-slate-400"
                                                    disabled={product.price === 0}
                                                >
                                                    Add
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="p-12 text-center text-slate-400 italic text-sm">
                                            {searchTerm ? "No matching products found." : "No benchmark data available."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {filteredProducts.length > itemsPerPage && (
                    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 border border-slate-200 rounded-lg">
                        <span className="text-sm text-slate-600">
                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                        </span>
                        <div className="flex gap-2">
                            <button
                                className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50 disabled:opacity-50"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    className={`px-3 py-1 border rounded text-sm transition-colors ${currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 hover:bg-slate-50'}`}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50 disabled:opacity-50"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default BenchmarksPage;



