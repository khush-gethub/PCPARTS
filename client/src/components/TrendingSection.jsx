import React from 'react';
import { Link } from 'react-router-dom';
import motherboardImg from '../assets/motherboard.jpg';
import ramImg from '../assets/ram.jpg';
import gpuImg from '../assets/gpu.jpg';
import ProductCard from './ProductCard';

const TrendingSection = () => {
    const trends = [
        {
            id: 1,
            name: 'RTX 4090 OC Edition',
            category: 'Graphics',
            price: '$1,599',
            image: gpuImg,
            specs: [
                { label: 'VRAM', val: '24GB' },
                { label: 'Clock', val: '2.5GHz' },
                { label: 'TDP', val: '450W' }
            ]
        },
        {
            id: 2,
            name: 'Z790 Aorus Master',
            category: 'Motherboard',
            price: '$499',
            image: motherboardImg,
            specs: [
                { label: 'Socket', val: 'LGA1700' },
                { label: 'Format', val: 'E-ATX' },
                { label: 'DDR5', val: 'Yes' }
            ]
        },
        {
            id: 3,
            name: 'Dominator Plat 64GB',
            category: 'Memory',
            price: '$289',
            image: ramImg,
            specs: [
                { label: 'Speed', val: '6000MT/s' },
                { label: 'Latency', val: 'CL30' },
                { label: 'Type', val: 'DDR5' }
            ]
        },
        {
            id: 4,
            name: 'Ryzen 9 7950X3D',
            category: 'CPU',
            price: '$699',
            image: gpuImg, // Placeholder
            specs: [
                { label: 'Cores', val: '16' },
                { label: 'Boost', val: '5.7GHz' },
                { label: 'Cache', val: '128MB' }
            ]
        },
    ];

    return (
        <section className="py-24 bg-white border-b border-gray-100">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header with Progress Bar indicator */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">ENGINE ROOM</h2>
                        <p className="text-gray-500 font-medium">Top trending components this week.</p>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="hidden md:flex items-center gap-4">
                        <span className="text-sm font-bold text-gray-400">01 / 04</span>
                        <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className="w-1/4 h-full bg-orange-600 rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trends.map((item) => (
                        <ProductCard
                            key={item.id}
                            id={item.id}
                            title={item.name}
                            image={item.image}
                            price={item.price}
                            brand={item.category}
                            specs={item.specs}
                            rating={4.9}
                            badges={['Verified Fit']}
                            stockStatus="In Stock"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrendingSection;