import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext.jsx';
import Navbar from '../components/Navbar.jsx';
import SubNavbar from '../components/SubNavbar.jsx';
import Footer from '../components/Footer.jsx';

const BenchmarksPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [notification, setNotification] = useState(null);
    const itemsPerPage = 10;
    const { addToCart } = useCart();

    const handleAddToCart = (product) => {
        addToCart({
            id: `benchmark-${product.id}`, // Ensure unique ID for benchmark items
            name: product.name,
            price: product.price,
            image: product.image,
            category: "Storage"
        });

        setNotification(`${product.name} added to cart!`);
        setTimeout(() => setNotification(null), 3000);
    };

    const products = useMemo(() => {
        const brands = ["Samsung", "Kingston", "Western Digital", "Crucial", "Lexar", "Sabrent", "Seagate", "PNY", "Corsair", "KIOXIA"];
        const models = ["990 PRO", "FURY Renegade", "WD_BLACK SN850X", "T705", "NM790", "Rocket 4 Plus", "FireCuda 540", "CS3140", "MP700", "EXCERIA PRO"];
        const capacities = ["500 GB", "1 TB", "2 TB", "4 TB"];

        return Array.from({ length: 35 }, (_, i) => {
            const brand = brands[i % brands.length];
            const model = models[i % models.length];
            const cap = capacities[i % capacities.length];
            const writeSpeed = 12000 - (i * 100) + Math.floor(Math.random() * 500);
            const readSpeed = 13000 - (i * 100) + Math.floor(Math.random() * 500);

            return {
                id: i + 1,
                name: `${brand} ${model} ${cap} M.2-2280 PCIe 5.0 X4 NVME`,
                capacity: cap,
                cache: i % 3 === 0 ? "4096 MB" : "-",
                type: "SSD",
                interface: "M.2 PCIe 5.0 X4",
                writeSpeed,
                readSpeed,
                maxWrite: 14000,
                maxRead: 14000,
                rating: (Math.random() * 2 + 3).toFixed(1),
                reviews: Math.floor(Math.random() * 50),
                price: (200 + i * 15.5 + Math.random() * 20),
                image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=200"
            };
        });
    }, []);

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

            <main className="flex-grow max-w-[1400px] w-full mx-auto p-4 md:p-8">
                <h1 className="text-2xl font-bold mb-6 text-slate-800">{filteredProducts.length} Compatible Products</h1>

                {notification && (
                    <div className="fixed top-24 right-8 z-[100] bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl animate-bounce flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-bold">{notification}</span>
                    </div>
                )}

                {/* Control Bar */}
                <div className="bg-white border border-slate-200 border-b-0 rounded-t-lg p-4 flex flex-col md:flex-row justify-end items-center gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative group w-full md:w-64">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="Search Storage..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap">
                            Add From Filter
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-200 rounded-b-lg overflow-x-auto custom-scrollbar-hide">
                    <table className="w-full text-left border-collapse text-[13px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 font-semibold text-slate-600 uppercase tracking-wider pl-8">Name</th>
                                <th className="p-4 font-semibold text-slate-600 uppercase tracking-wider">Capacity</th>
                                <th className="p-4 font-semibold text-slate-600 uppercase tracking-wider">Cache</th>
                                <th className="p-4 font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                                <th className="p-4 font-semibold text-slate-600 uppercase tracking-wider">Interface</th>
                                <th className="p-4 font-semibold text-slate-600 uppercase tracking-wider">Seq. Write (QD4)</th>
                                <th className="p-4 font-semibold text-slate-600 uppercase tracking-wider">Seq. Read (QD4)</th>
                                <th className="p-4 font-semibold text-slate-600 uppercase tracking-wider">Rating</th>
                                <th className="p-4 font-semibold text-slate-600 uppercase tracking-wider text-right">Price</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedProducts.length > 0 ? (
                                paginatedProducts.map(product => (
                                    <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4 pl-8">
                                            <div className="flex items-center gap-3 min-w-[250px]">
                                                <img src={product.image} alt="" className="w-10 h-10 object-contain bg-white p-1 rounded border border-slate-100" />
                                                <span className="font-medium text-slate-900">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">{product.capacity}</td>
                                        <td className="p-4 whitespace-nowrap">{product.cache}</td>
                                        <td className="p-4 whitespace-nowrap">{product.type}</td>
                                        <td className="p-4 whitespace-nowrap">{product.interface}</td>
                                        <td className="p-4">
                                            <div className="w-40">
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
                                                        style={{ width: `${(product.writeSpeed / product.maxWrite) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-[11px] text-slate-500 mt-1 block">{product.writeSpeed.toLocaleString()} MB/s</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="w-40">
                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
                                                        style={{ width: `${(product.readSpeed / product.maxRead) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-[11px] text-slate-500 mt-1 block">{product.readSpeed.toLocaleString()} MB/s</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1">
                                                {renderStars(product.rating)}
                                                <span className="text-slate-400 text-[11px]">({product.reviews})</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className="font-bold text-slate-900">${product.price.toFixed(2)}</span>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="bg-blue-600 text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-md"
                                            >
                                                Add
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="p-12 text-center text-slate-500 italic text-base">
                                        No matching products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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



