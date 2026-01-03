import React from 'react';
import Navbar from '../components/Navbar.jsx';
import PCCard from '../components/PCCard.jsx';
import PCFilters from '../components/PCFilters.jsx';

const ReadyMadePCsPage = () => {
    // Mock Data
    const pcs = [
        {
            id: 1,
            name: "Hyperion X1 - Ultimate Gaming Rig",
            image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=600",
            cpu: "Intel Core i9-13900K",
            gpu: "NVIDIA RTX 4090 24GB",
            ram: "64GB DDR5 6000MHz",
            price: "₹3,45,999",
            useCase: "Gaming",
            rating: 4.8
        },
        {
            id: 2,
            name: "Creator Pro Studio",
            image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=600",
            cpu: "AMD Ryzen 9 7950X",
            gpu: "NVIDIA RTX 4080 16GB",
            ram: "128GB DDR5",
            price: "₹2,89,999",
            useCase: "Workstation",
            rating: 5.0
        },
        {
            id: 3,
            name: "Velox Starter",
            image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=600",
            cpu: "Intel Core i5-13400F",
            gpu: "NVIDIA RTX 4060 8GB",
            ram: "16GB DDR4",
            price: "₹85,999",
            useCase: "Budget",
            rating: 4.5
        },
        {
            id: 4,
            name: "Streamer Elite",
            image: "https://cdn.pixabay.com/photo/2019/07/28/05/18/gaming-pc-4368146_1280.jpg",
            cpu: "Intel Core i7-13700K",
            gpu: "NVIDIA RTX 4070 Ti",
            ram: "32GB DDR5",
            price: "₹1,85,999",
            useCase: "Gaming",
            rating: 4.7
        }
    ];

    return (
        <div className="min-h-screen bg-[#eef2f2] font-sans">
            <Navbar />

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
                        <PCFilters />
                    </div>

                    {/* Right Product Grid */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Showing {pcs.length} Systems</span>
                            <select className="bg-white border border-gray-200 text-sm rounded-lg p-2.5 focus:ring-orange-500 focus:border-orange-500 outline-none">
                                <option>Sort by: Featured</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Newest</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {pcs.map(pc => (
                                <PCCard key={pc.id} {...pc} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReadyMadePCsPage;
