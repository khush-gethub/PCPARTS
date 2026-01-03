import React from 'react';
import { Link } from 'react-router-dom';
import heroPC from '../assets/hero-pc.png';
import heroPCPremium from '../assets/hero-pc.png'; // Fallback
import workstationPC from '../assets/pc-build.jpg'; // Fallback
import gamingPC from '../assets/pc-build.jpg'; // Fallback

const PreBuiltSection = () => {
    const systems = [
        {
            id: 1,
            name: 'Aegis Master G5',
            category: 'Gaming PC',
            price: '$2,499',
            image: heroPC,
            specs: [
                { label: 'CPU', val: 'i9-14900K' },
                { label: 'GPU', val: 'RTX 4080' },
                { label: 'RAM', val: '32GB DDR5' }
            ]
        },
        {
            id: 2,
            name: 'Precision Pro 9',
            category: 'Workstation',
            price: '$3,899',
            image: workstationPC,
            specs: [
                { label: 'CPU', val: 'Threadripper' },
                { label: 'GPU', val: 'RTX 6000' },
                { label: 'RAM', val: '128GB ECC' }
            ]
        },
        {
            id: 3,
            name: 'Ghost Elite S3',
            category: 'Small Form Factor',
            price: '$1,849',
            image: gamingPC,
            specs: [
                { label: 'CPU', val: 'Ryzen 7 7800X3D' },
                { label: 'GPU', val: 'RTX 4070 Ti' },
                { label: 'RAM', val: '32GB DDR5' }
            ]
        },
        {
            id: 4,
            name: 'Lumina Premium',
            category: 'Creator PC',
            price: '$2,199',
            image: heroPCPremium,
            specs: [
                { label: 'CPU', val: 'i7-14700K' },
                { label: 'GPU', val: 'RTX 4070 Super' },
                { label: 'RAM', val: '64GB DDR5' }
            ]
        },
    ];

    return (
        <section className="py-24 bg-white border-b border-gray-100">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header with Progress Bar indicator */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-2 uppercase">Pre-Built Systems</h2>
                        <p className="text-gray-500 font-medium">Expertly assembled, performance guaranteed.</p>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="hidden md:flex items-center gap-4">
                        <span className="text-sm font-bold text-gray-400">01 / 02</span>
                        <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className="w-1/2 h-full bg-orange-600 rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {systems.map((item) => (
                        <div key={item.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-orange-500/50 hover:shadow-2xl transition-all duration-300">

                            {/* Status Badge */}
                            <div className="absolute top-3 left-3 z-10 bg-orange-50 text-orange-700 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border border-orange-100 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                Pro-Assembled
                            </div>

                            {/* Image Area */}
                            <Link to={`/ready-made-pc/${item.id}`} className="block aspect-[5/4] bg-gray-50 p-6 flex items-center justify-center relative">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="object-contain w-full h-full transform group-hover:scale-110 transition-transform duration-500 filter saturate-0 group-hover:saturate-100"
                                />

                                {/* Quick View Overlay */}
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <span className="bg-white text-orange-600 font-bold px-6 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        View Build Details
                                    </span>
                                </div>
                            </Link>

                            {/* Content & Specs */}
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.category}</p>
                                    <div className="flex text-orange-400">
                                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        <span className="text-xs font-bold text-gray-500 ml-1">5.0</span>
                                    </div>
                                </div>
                                <Link to={`/ready-made-pc/${item.id}`}>
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
                                    <Link to={`/ready-made-pc/${item.id}`} className="text-orange-600 p-2 hover:bg-orange-50 rounded-full transition-colors font-bold text-sm uppercase px-4">
                                        Buy Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PreBuiltSection;
