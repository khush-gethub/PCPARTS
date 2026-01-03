import React from 'react';

const ProductBenchmarks = () => {
    const benchmarks = [
        { name: 'Cyberpunk 2077 (4K Ultra)', score: 125, max: 150 },
        { name: 'Red Dead Redemption 2', score: 144, max: 150 },
        { name: 'Call of Duty: MW3', score: 110, max: 150 },
        { name: 'Blender Classroom', score: 95, max: 150 },
    ];

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Performance Benchmarks</h2>
            <div className="space-y-6">
                {benchmarks.map((item, index) => (
                    <div key={index}>
                        <div className="flex justify-between mb-2">
                            <span className="font-bold text-gray-800">{item.name}</span>
                            <span className="font-mono font-bold text-orange-600">{item.score} FPS</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-orange-500 to-red-500 h-4 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${(item.score / item.max) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-sm text-gray-500 mt-6 italic">* Tested on Intel Core i9-13900K, 32GB DDR5 RAM. Actual performance may vary.</p>
        </div>
    );
};

export default ProductBenchmarks;
