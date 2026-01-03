import React from 'react';
import { Link } from 'react-router-dom';
import heroPC from '../assets/hero-pc.png';
import heroPCPremium from '../assets/hero-pc.png'; // Fallback
import workstationPC from '../assets/pc-build.jpg'; // Fallback
import gamingPC from '../assets/pc-build.jpg'; // Fallback
import PCCard from './PCCard';

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
                    {systems.map((item) => {
                        const cpu = item.specs.find(s => s.label === 'CPU')?.val;
                        const gpu = item.specs.find(s => s.label === 'GPU')?.val;
                        const ram = item.specs.find(s => s.label === 'RAM')?.val;

                        return (
                            <PCCard
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                image={item.image}
                                price={item.price}
                                useCase={item.category}
                                cpu={cpu}
                                gpu={gpu}
                                ram={ram}
                                rating={5.0}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default PreBuiltSection;
