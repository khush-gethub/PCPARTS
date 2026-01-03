import { Link } from 'react-router-dom';
import pcRender from '../assets/hero-pc.png';

const BenchmarksSection = () => {
    const chartData = [
        { id: 1, value: 35 },
        { id: 2, value: 55 },
        { id: 3, value: 45 },
        { id: 4, value: 75 },
        { id: 5, value: 48 },
        { id: 6, value: 95 },
        { id: 7, value: 65 },
        { id: 8, value: 105 },
        { id: 9, value: 60 },
        { id: 10, value: 85 }
    ];

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
                            <h3 className="text-white text-2xl font-bold mb-4">Core Performance Index</h3>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                                Standardized system stress-test results across a 10-node localized build cluster.
                            </p>

                            <div className="flex items-end gap-2 h-48 mt-16 pb-2 border-b border-slate-700">
                                {chartData.map((bar) => (
                                    <div
                                        key={bar.id}
                                        className="bg-orange-600 w-full"
                                        style={{ height: `${(bar.value / 120) * 100}%` }}
                                    ></div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Test Node 01</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Test Node 10</span>
                            </div>
                        </div>

                        <div className="mt-12 flex gap-4">
                            <Link to="/benchmarks" className="bg-orange-600 text-white px-8 py-3 rounded-[2px] text-[11px] font-bold uppercase tracking-widest hover:bg-orange-700 transition-colors">
                                View Methodology
                            </Link>
                            <Link to="/" className="border border-slate-700 text-slate-300 px-8 py-3 rounded-[2px] text-[11px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors">
                                Export CSV
                            </Link>
                        </div>
                    </div>

                    {/* Hardware Validation Block */}
                    <div className="bg-white p-12 flex flex-col lg:flex-row gap-12 items-center">
                        <div className="flex-1 order-2 lg:order-1">
                            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest block mb-4">Hardware ID: PX-900</span>
                            <h3 className="text-2xl font-bold text-slate-900 mb-6 leading-tight">Validated Architecture for Enterprise Workloads</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-8">
                                Every configuration undergoes a 48-hour thermal soak and noise-profile analysis to ensure laboratory-grade stability.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-xs font-bold text-slate-900">
                                    <div className="w-1.5 h-1.5 bg-orange-600"></div>
                                    THERMAL HEADROOM: +15%
                                </li>
                                <li className="flex items-center gap-3 text-xs font-bold text-slate-900">
                                    <div className="w-1.5 h-1.5 bg-orange-600"></div>
                                    LATENCY STABILITY: 99.8%
                                </li>
                            </ul>
                        </div>
                        <div className="flex-1 order-1 lg:order-2 bg-gray-50 border border-gray-100 p-8">
                            <img
                                src={pcRender}
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
