import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
// Removed static pcRender


const BenchmarksSection = () => {
    const [chartData, setChartData] = useState([]);
    const [displayProduct, setDisplayProduct] = useState(null);

    useEffect(() => {
        const fetchBenchmarks = async () => {
            try {
                // Fetch all benchmarks and products in parallel
                const [allBenchmarks, products] = await Promise.all([
                    api.getBenchmarks(),
                    api.getProducts()
                ]);

                if (!allBenchmarks || allBenchmarks.length === 0) return;

                // Find a product that has benchmarks
                // Group benchmarks by product_id
                const benchmarksByProduct = allBenchmarks.reduce((acc, b) => {
                    const pid = b.product_id; // This is a string/ID
                    if (!acc[pid]) acc[pid] = [];
                    acc[pid].push(b);
                    return acc;
                }, {});

                // Find the first product that has benchmarks
                let foundProduct = null;
                let productBenchmarks = [];

                for (const p of products) {
                    const pid = p.product_id || p._id;
                    // Check strict match or string match
                    // The IDs in products are like "6960..." and in benchmarks "6960..."
                    // We check if benchmarksByProduct has this key
                    if (benchmarksByProduct[pid]) {
                        foundProduct = p;
                        productBenchmarks = benchmarksByProduct[pid];
                        break;
                    }
                }

                if (foundProduct && productBenchmarks.length > 0) {
                    // Get image
                    let image = null;
                    try {
                        const images = await api.getProductImages(foundProduct.product_id || foundProduct._id);
                        if (images.length > 0) image = images[0].image_url;
                    } catch (e) { }

                    setDisplayProduct({ ...foundProduct, image });

                    setChartData(productBenchmarks.map((b, i) => ({
                        id: b.benchmark_id || i,
                        name: b.name,
                        value: b.score,
                        // Normalize with safety check
                        normalized: b.score ? Math.min((Number(b.score) / 20000) * 100, 100) : 0
                    })));
                }

            } catch (e) {
                console.error("Bench error", e);
            }
        };
        fetchBenchmarks();
    }, []);

    // If no data, hide or show empty
    if (chartData.length === 0) return null; // "Remove all data that not come from database"

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
                            <h3 className="text-white text-2xl font-bold mb-4">{displayProduct ? displayProduct.name : 'Core Performance Index'}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                                Real-time performance metrics sourced directly from our database.
                            </p>

                            <div className="flex flex-col gap-4 mt-8 pb-2 border-b border-slate-700">
                                {chartData.map((bar) => (
                                    <div key={bar.id} className="w-full">
                                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                                            <span>{bar.name || `Benchmark ${bar.id}`}</span>
                                            <span>{bar.value}</span>
                                        </div>
                                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-orange-600 h-full rounded-full"
                                                style={{ width: `${bar.normalized || 50}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-12 flex gap-4">
                        </div>
                    </div>

                    {/* Hardware Validation Block */}
                    <div className="bg-white p-12 flex flex-col lg:flex-row gap-12 items-center">
                        <div className="flex-1 order-2 lg:order-1">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6 leading-tight">Validated Architecture</h3>
                        </div>
                        <div className="flex-1 order-1 lg:order-2 bg-gray-50 border border-gray-100 p-8">
                            <img
                                src={displayProduct?.image || "https://placehold.co/400x400?text=System"}
                                alt="High-end System"
                                className="w-full h-auto grayscale"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default BenchmarksSection;
