import React, { useEffect, useState } from 'react';
import { api } from '../api';

const BenchmarksSection = () => {
    const [chartData, setChartData] = useState([]);
    const [displayProduct, setDisplayProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBenchmarks = async () => {
            setLoading(true);
            try {
                // Fetch all benchmarks and products in parallel
                const [allBenchmarks, products] = await Promise.all([
                    api.getBenchmarks(),
                    api.getProducts()
                ]);

                let foundBenchmarks = [];
                let foundProd = null;

                if (allBenchmarks && allBenchmarks.length > 0) {
                    // Try to match a product
                    const benchmarksByProduct = allBenchmarks.reduce((acc, b) => {
                        const pid = b.product_id;
                        if (!acc[pid]) acc[pid] = [];
                        acc[pid].push(b);
                        return acc;
                    }, {});

                    for (const p of products) {
                        const pid = p.product_id || p._id;
                        if (benchmarksByProduct[pid]) {
                            foundProd = p;
                            foundBenchmarks = benchmarksByProduct[pid];
                            break;
                        }
                    }
                }

                if (foundProd && foundBenchmarks.length > 0) {
                    // Enrich with image
                    let image = null;
                    try {
                        const images = await api.getProductImages(foundProd.product_id || foundProd._id);
                        if (images.length > 0) image = images[0].image_url;
                    } catch (e) { }

                    setDisplayProduct({ ...foundProd, image });
                    setChartData(foundBenchmarks.map((b, i) => ({
                        id: b.benchmark_id || i,
                        name: b.name,
                        value: b.score,
                        normalized: b.score ? Math.min((Number(b.score) / 20000) * 100, 100) : 0
                    })));
                } else {
                    // Fallback to sample data if database has no benchmarks or matches
                    setChartData([
                        { id: 1, name: "Single Core Performance", value: 1250, normalized: 65 },
                        { id: 2, name: "Multi Core Efficiency", value: 8900, normalized: 82 },
                        { id: 3, name: "Render Speed (FPS)", value: 144, normalized: 74 },
                        { id: 4, name: "Memory Latency", value: 62, normalized: 91 }
                    ]);
                    setDisplayProduct({
                        name: "Standard Performance Build",
                        image: "https://placehold.co/400x400?text=PC+Build"
                    });
                }
            } catch (err) {
                console.error("Failed to load benchmarks", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBenchmarks();
    }, []);

    if (loading) return (
        <div className="py-24 text-center text-gray-400 animate-pulse">
            CALIBRATING METRICS...
        </div>
    );

    return (
        <section className="py-24 bg-white border-b border-gray-100">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="mb-16">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-4">Performance Metrics</span>
                    <h2 className="text-4xl font-bold text-slate-900 tracking-tight uppercase">Comparative Benchmarks</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-gray-200 border border-gray-200">
                    {/* Data Visualization Block */}
                    <div className="bg-slate-900 p-12 flex flex-col justify-between">
                        <div>
                            <h3 className="text-white text-2xl font-bold mb-4">{displayProduct?.name || 'Core Performance Index'}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                                High-fidelity performance metrics validated through extensive hardware testing.
                            </p>

                            <div className="flex flex-col gap-6 mt-12">
                                {chartData.map((bar) => (
                                    <div key={bar.id} className="w-full">
                                        <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                                            <span>{bar.name}</span>
                                            <span className="text-orange-500">{bar.value}</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                            <div
                                                className="bg-orange-600 h-full rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${bar.normalized}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Hardware Validation Block */}
                    <div className="bg-white p-12 flex flex-col items-center justify-center border-l border-gray-100">
                        <div className="w-full max-w-md aspect-square bg-gray-50 border border-gray-100 p-8 flex items-center justify-center">
                            <img
                                src={displayProduct?.image || "https://placehold.co/400x400?text=Architecture"}
                                alt="Hardware"
                                className="w-full h-full object-contain mix-blend-multiply opacity-80"
                            />
                        </div>
                        <div className="mt-8 text-center">
                            <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Validated Architecture</h4>
                            <p className="text-slate-500 text-xs mt-2">Hardware signature verified against database standards.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BenchmarksSection;
