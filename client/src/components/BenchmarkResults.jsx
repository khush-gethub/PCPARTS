import React from 'react';
import { useNavigate } from 'react-router-dom';
import gpuImg from '../assets/3d-gpu.png';
import pcImg from '../assets/3d-hero-pc.png';

const BenchmarkResults = () => {
    const navigate = useNavigate();

    return (
        <section className="mt-12 mb-20 px-10">
            <h2 className="text-2xl font-black text-gray-800 mb-8 tracking-tight">Benchmmark Results</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* GPU Performance Score - Chart */}
                <div className="bg-[#1a232e] rounded-3xl p-8 text-white h-[450px] flex flex-col">
                    <h3 className="text-xl font-bold mb-2">GPU Performance Score</h3>
                    <p className="text-gray-400 text-xs mb-8">System performance across latest benchmarks.</p>

                    {/* Simulated Bar Chart */}
                    <div className="flex-1 flex items-end justify-between gap-2 px-2">
                        {[40, 60, 45, 80, 50, 90, 70, 100, 60, 85].map((height, i) => (
                            <div
                                key={i}
                                className="bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-sm transition-all duration-500 hover:opacity-80 cursor-pointer"
                                style={{ height: `${height * 0.7}%`, width: '100%' }}
                            ></div>
                        ))}
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={() => navigate('/benchmarks')}
                            className="bg-orange-600 text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-orange-700 transition-colors uppercase active:scale-95 transform"
                        >
                            Details
                        </button>
                        <button className="bg-white/10 text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-white/20 transition-colors uppercase">Export</button>
                    </div>
                </div>

                {/* GPU Performance Score - PC View */}
                <div className="bg-[#cae2e2] rounded-3xl p-8 text-gray-800 h-[450px] flex flex-col relative overflow-hidden">
                    <h3 className="text-xl font-bold mb-2">GPU Performance Score</h3>
                    <p className="text-gray-600 text-xs mb-8">Real-time thermal and efficiency analytics.</p>

                    <div className="flex-1 flex items-center justify-center">
                        <img src={pcImg} alt="PC Build" className="max-h-[250px] object-contain drop-shadow-2xl" />
                    </div>

                    <div className="mt-8 flex gap-4 relative z-10">
                        <button
                            onClick={() => navigate('/configurator')}
                            className="bg-[#1a232e] text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-black transition-colors uppercase active:scale-95 transform"
                        >
                            Config
                        </button>
                        <button className="bg-white text-gray-800 px-6 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors border border-gray-200 uppercase">Offered</button>
                    </div>
                </div>

                {/* Sidebar Info - Quick Guides & Alerts */}
                <div className="flex flex-col gap-6 h-[450px]">
                    <div className="bg-[#1a232e] rounded-3xl p-8 text-white flex-1">
                        <h3 className="text-base font-bold mb-6">Quick Guides</h3>
                        <div className="flex items-center gap-6 mb-8">
                            <span className="text-4xl font-black text-orange-500">16.8%</span>
                            <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                                Growth in performance scores compared to previous generation builds.
                            </p>
                        </div>
                        <ul className="space-y-3 text-[10px] text-gray-300 font-medium">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                Optimize your RGB settings
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                Check for latest BIOS updates
                            </li>
                        </ul>
                    </div>

                    <div className="bg-[#1a232e] rounded-3xl p-6 text-white h-1/3 flex items-center gap-6">
                        <div className="w-16 h-16 bg-[#cae2e2] rounded-2xl flex items-center justify-center p-2">
                            <img src={gpuImg} alt="GPU" className="max-h-full object-contain" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-xs font-bold mb-1 uppercase tracking-wider text-orange-500">Sent by Alerts</h4>
                            <p className="text-[9px] text-gray-400 font-medium leading-tight">
                                New high score reached for RTX 4080 Super build. Check global rankings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BenchmarkResults;
