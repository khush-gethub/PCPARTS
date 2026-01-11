import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { api } from '../api';

const ReadyMadePCComponentsPage = () => {
    const { id } = useParams();
    const [pcData, setPcData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPCData = async () => {
            try {
                setLoading(true);
                const data = await api.getReadyMadePCById(id);
                setPcData(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching PC components:", err);
                setError("Failed to load component details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPCData();
    }, [id]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#eef2f2]">
                <Navbar />
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (error || !pcData) {
        return (
            <div className="min-h-screen bg-[#eef2f2]">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                    <h2 className="text-xl font-bold text-red-600">{error || "PC Not Found"}</h2>
                    <Link to="/ready-made-pcs" className="mt-4 inline-block text-blue-600 hover:underline">Back to All PCs</Link>
                </div>
            </div>
        );
    }

    const components = pcData.items.map(item => {
        const product = item.product_id;
        const variant = item.variant_id;

        // Extract specs into a string
        let specString = "-";
        if (product?.specs) {
            specString = Object.entries(product.specs)
                .slice(0, 2)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ');
        }

        return {
            category: product?.category_id?.name || "Component",
            name: product?.name || "Unknown Product",
            brand: product?.brand_id?.name || "Generic",
            specs: specString,
            price: variant?.price || 0,
            status: item.stock > 0 ? "In Stock" : "Out of Stock",
            stock: item.stock
        };
    });

    const individualTotal = components.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="min-h-screen bg-[#eef2f2] font-sans pb-12">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Nav */}
                <div className="flex items-center justify-between mb-8">
                    <Link to={`/ready-made-pc/${id}`} className="inline-flex items-center text-sm text-gray-500 hover:text-orange-600 font-medium transition-colors">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back to PC Details
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900">{pcData.name} - Full Component List</h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                    <th className="p-4 font-semibold">Category</th>
                                    <th className="p-4 font-semibold">Product Name</th>
                                    <th className="p-4 font-semibold">Brand</th>
                                    <th className="p-4 font-semibold">Key Specs</th>
                                    <th className="p-4 font-semibold text-right">Price</th>
                                    <th className="p-4 font-semibold text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {components.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-bold text-gray-900">{item.category}</td>
                                        <td className="p-4 text-gray-800 font-medium">{item.name}</td>
                                        <td className="p-4 text-gray-600">{item.brand}</td>
                                        <td className="p-4 text-gray-500">{item.specs}</td>
                                        <td className="p-4 text-gray-900 font-bold text-right">{formatCurrency(item.price)}</td>
                                        <td className="p-4 text-right">
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${item.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-gray-50">
                                    <td colSpan="4" className="p-4 text-right font-bold text-gray-600">Total System Value (Individual Parts)</td>
                                    <td className="p-4 text-right font-black text-xl text-gray-900">{formatCurrency(individualTotal)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Footer Summary Card */}
                <div className="mt-8 bg-gray-900 text-white rounded-xl shadow-lg p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">Get the Pre-Built Advantage</h2>
                        <p className="text-gray-400 text-sm">Professional assembly, cable management, and stress testing included. Save time and hassle.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right hidden md:block">
                            <span className="block text-gray-400 text-sm">Our Bundle Price</span>
                            <span className="text-3xl font-black text-orange-500">{formatCurrency(pcData.price)}</span>
                        </div>
                        <button className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition shadow-lg hover:shadow-orange-500/20 whitespace-nowrap">
                            Add Full System to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReadyMadePCComponentsPage;
