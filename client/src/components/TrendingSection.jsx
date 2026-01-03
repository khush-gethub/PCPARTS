import React from 'react';
import { Link } from 'react-router-dom';
import motherboardImg from '../assets/motherboard.jpg';
import ramImg from '../assets/ram.jpg';
import gpuImg from '../assets/gpu.jpg';

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
                        <div key={item.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-orange-500/50 hover:shadow-2xl transition-all duration-300">

                            {/* Compatibility Badge */}
                            <div className="absolute top-3 left-3 z-10 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border border-green-100 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                Verified Fit
                            </div>

                            {/* Image Area */}
                            <Link to={`/product/${item.id}`} className="block aspect-[5/4] bg-gray-50 p-6 flex items-center justify-center relative">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="object-contain w-full h-full transform group-hover:scale-110 transition-transform duration-500 filter saturate-0 group-hover:saturate-100"
                                />

                                {/* Quick View Overlay */}
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <span className="bg-white text-orange-600 font-bold px-6 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        Quick View
                                    </span>
                                </div>
                            </Link>

                            {/* Content & Specs */}
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.category}</p>
                                    <div className="flex text-orange-400">
                                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        <span className="text-xs font-bold text-gray-500 ml-1">4.9</span>
                                    </div>
                                </div>
                                <Link to={`/product/${item.id}`}>
                                    <h3 className="font-bold text-gray-900 text-lg mb-4 leading-tight group-hover:text-orange-600 transition-colors cursor-pointer">{item.name}</h3>
                                </Link>

                                {/* Technical Specs Table - High Density */}
                                <div className="border-t border-b border-gray-100 py-3 mb-4">
                                    <div className="grid grid-cols-3 gap-2 text-center divide-x divide-gray-100">
                                        {item.specs.map((spec, i) => (
                                            <div key={i} className="flex flex-col">
                                                <span className="text-[10px] text-gray-400 uppercase font-bold">{spec.label}</span>
                                                <span className="text-xs font-bold text-gray-700">{spec.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-black text-gray-900">{item.price}</span>
                                    <button className="text-orange-600 p-2 hover:bg-orange-50 rounded-full transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrendingSection;