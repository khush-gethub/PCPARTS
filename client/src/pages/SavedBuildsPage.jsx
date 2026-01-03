import React from 'react';
import Navbar from '../components/Navbar.jsx';
import SubNavbar from '../components/SubNavbar.jsx';
import Footer from '../components/Footer.jsx';

const SavedBuildsPage = () => {
    const savedBuilds = [
        {
            id: 1,
            name: "High-End Gaming Rig",
            date: "Dec 20, 2025",
            totalCost: 2499.99,
            components: ["Intel i9-14900K", "RTX 4090", "32GB DDR5"],
            image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: 2,
            name: "Workstation Pro",
            date: "Dec 15, 2025",
            totalCost: 1850.50,
            components: ["AMD Ryzen 9 7950X", "RTX 4070 Ti", "64GB DDR5"],
            image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400"
        },
        {
            id: 3,
            name: "Budget King v2",
            date: "Dec 10, 2025",
            totalCost: 899.00,
            components: ["AMD Ryzen 5 7600", "RX 7600", "16GB DDR5"],
            image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=400"
        }
    ];

    return (
        <div className="min-h-screen bg-[#eef2f2] font-sans">
            <Navbar />
            <SubNavbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Your Saved Builds</h1>
                        <p className="text-gray-600 mt-2">Manage your custom PC configurations and quickly add them to cart.</p>
                    </div>
                    <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-black hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20">
                        + New Build
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {savedBuilds.map((build) => (
                        <div key={build.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={build.image}
                                    alt={build.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-gray-900 shadow-sm">
                                    {build.date}
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-black text-gray-900 mb-2 truncate">{build.name}</h3>
                                <div className="space-y-1 mb-6">
                                    {build.components.map((comp, idx) => (
                                        <p key={idx} className="text-sm text-gray-500 flex items-center">
                                            <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mr-2"></span>
                                            {comp}
                                        </p>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="leading-tight">
                                        <p className="text-xs text-gray-400 font-bold uppercase">Total Price</p>
                                        <p className="text-2xl font-black text-orange-600">${build.totalCost.toFixed(2)}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors" title="Download PDF">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </button>
                                        <button className="px-4 py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors">
                                            Load
                                        </button>
                                    </div>
                                </div>

                                <button className="w-full mt-4 bg-orange-600/10 text-orange-600 py-3 rounded-lg font-black hover:bg-orange-600 hover:text-white transition-all text-sm uppercase">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SavedBuildsPage;
