import React from 'react';
import gpuImg from '../assets/gpu.jpg';

const Sidebar = () => {
    return (
        <aside className="space-y-8">
            {/* Benchmarks Section (Replacing Quick Guides) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Benchmarks</h2>
                <div className="mb-6">
                    <div className="flex justify-between items-baseline mb-4">
                        <span className="text-3xl font-black text-gray-900">$2,999</span>
                    </div>

                    <p className="text-[10px] text-gray-400 mb-4 leading-relaxed uppercase tracking-widest font-bold">
                        Ultimate Peak Performance
                    </p>

                    {/* Line Chart SVG */}
                    <div className="relative h-40 w-full bg-gray-50/50 rounded-xl overflow-hidden border border-gray-50">
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                            {/* Grid lines */}
                            <line x1="0" y1="20" x2="100" y2="20" stroke="#f0f0f0" strokeWidth="0.5" />
                            <line x1="0" y1="40" x2="100" y2="40" stroke="#f0f0f0" strokeWidth="0.5" />
                            <line x1="0" y1="60" x2="100" y2="60" stroke="#f0f0f0" strokeWidth="0.5" />
                            <line x1="0" y1="80" x2="100" y2="80" stroke="#f0f0f0" strokeWidth="0.5" />

                            {/* Area fill */}
                            <path
                                d="M0 100 L0 60 C 20 50, 40 80, 50 60 C 60 40, 80 50, 100 20 L100 100 Z"
                                fill="url(#tealGradient)"
                                opacity="0.1"
                            />
                            {/* Line */}
                            <path
                                d="M0 60 C 20 50, 40 80, 50 60 C 60 40, 80 50, 100 20"
                                fill="none"
                                stroke="#0d9488"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />

                            <defs>
                                <linearGradient id="tealGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#0d9488" />
                                    <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Data points */}
                        <div className="absolute top-[58%] left-[0%] w-2 h-2 bg-teal-600 rounded-full border-2 border-white"></div>
                        <div className="absolute top-[58%] left-[48%] w-2 h-2 bg-teal-600 rounded-full border-2 border-white"></div>
                        <div className="absolute top-[18%] left-[98%] w-2 h-2 bg-teal-600 rounded-full border-2 border-white"></div>
                    </div>

                    <div className="flex justify-between mt-3 text-[10px] text-gray-400 font-bold">
                        <span>10</span><span>10</span><span>16</span><span>10</span><span>12</span><span>16</span><span>18</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <button className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center transition-all hover:bg-gray-100 hover:scale-[1.02]">
                        <span className="text-xs font-bold text-gray-700">CPU Benchmark</span>
                        <div className="bg-teal-600 text-white px-3 py-1 rounded-md text-[10px] font-black uppercase">See Plus</div>
                    </button>
                    <div className="flex justify-center mt-2">
                        <div className="h-4 w-32 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                            <div className="h-full bg-teal-100 w-[70%]" />
                        </div>
                    </div>
                </div>
            </div>


            {/* Smart AI Alerts Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Smart AI Alerts</h2>
                <div className="bg-[#f0f9f9] border border-teal-100 p-4 rounded-xl mb-4">
                    <div className="flex space-x-3">
                        <img
                            src={gpuImg}
                            alt="Alert"
                            className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                            <h4 className="text-xs font-bold text-gray-900">Price Drop on RTX Series!</h4>
                            <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">
                                Our AI detected a 15% price drop on selected graphics cards.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-800">Guide Hints</h3>
                    <p className="text-[10px] text-gray-500 leading-relaxed italic">
                        "Choosing the right PSU is critical for high-end builds. We recommend at least 850W for modern GPUs."
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
