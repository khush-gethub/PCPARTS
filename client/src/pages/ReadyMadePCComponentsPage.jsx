import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

const ReadyMadePCComponentsPage = () => {
    const { id } = useParams();

    // Mock Component Data
    const components = [
        { category: "Processor", name: "Core i9-13900K 24-Core", brand: "Intel", specs: "Up to 5.8 GHz", price: "₹55,000", status: "In Stock" },
        { category: "Graphics Card", name: "GeForce RTX 4090 Gaming OC", brand: "Gigabyte", specs: "24GB GDDR6X", price: "₹1,85,000", status: "In Stock" },
        { category: "Motherboard", name: "ROG Maximus Z790 Hero", brand: "ASUS", specs: "LGA1700, DDR5, WiFi 6E", price: "₹65,000", status: "In Stock" },
        { category: "Memory", name: "Dominator Platinum RGB 64GB", brand: "Corsair", specs: "2x32GB DDR5 6000MHz", price: "₹32,000", status: "In Stock" },
        { category: "Storage (Primary)", name: "990 Pro NVMe M.2 SSD", brand: "Samsung", specs: "2TB PCIe Gen 4", price: "₹18,000", status: "In Stock" },
        { category: "Power Supply", name: "HX1200i Platinum", brand: "Corsair", specs: "1200W Fully Modular", price: "₹25,000", status: "Low Stock" },
        { category: "CPU Cooler", name: "Kraken Z73 RGB", brand: "NZXT", specs: "360mm AIO Liquid Cooler", price: "₹26,000", status: "In Stock" },
        { category: "Cabinet", name: "O11 Dynamic Evo", brand: "Lian Li", specs: "Mid Tower, Tempered Glass", price: "₹16,000", status: "In Stock" },
    ];

    const total = "₹4,22,000"; // Sum of above approx

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
                    <h1 className="text-xl font-bold text-gray-900">Hyperion X1 - Full Component List</h1>
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
                                        <td className="p-4 text-gray-900 font-bold text-right">{item.price}</td>
                                        <td className="p-4 text-right">
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${item.status === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
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
                                    <td className="p-4 text-right font-black text-xl text-gray-900">{total}</td>
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
                            <span className="text-3xl font-black text-orange-500">₹3,45,999</span>
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
