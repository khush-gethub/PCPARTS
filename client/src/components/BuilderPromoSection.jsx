import React from 'react';
import { Link } from 'react-router-dom';
import BuilderInterfaceMockup from './BuilderInterfaceMockup.jsx';

const BuilderPromoSection = () => {
    return (
        <section className="bg-[#0f1115] text-white py-24 relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Content */}
                    <div className="text-center lg:text-left">
                        <span className="inline-block py-1 px-4 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold text-xs tracking-[0.2em] mb-8 uppercase">
                            Configurator 2.0
                        </span>

                        <h2 className="text-5xl lg:text-6xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 leading-[1.1]">
                            CREATE YOUR <br /> MONSTER
                        </h2>

                        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Our intelligent engine checks 40+ points of compatibility in real-time.
                            Build with confidence knowing every part fits perfectly.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                            <Link to="/configurator" className="inline-block bg-orange-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-orange-700 transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_30px_rgba(234,88,12,0.6)] transform hover:-translate-y-1">
                                Start Building Now
                            </Link>

                            {/* Social Proof */}
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-[#0f1115]"></div>
                                    ))}
                                </div>
                                <div className="text-left">
                                    <div className="flex text-orange-500 text-xs">★★★★★</div>
                                    <span className="text-xs text-gray-500 font-bold">2,000+ Builds</span>
                                </div>
                            </div>
                        </div>

                        {/* Visual Breadcrumbs (Small) */}
                        <div className="mt-12 flex flex-wrap justify-center lg:justify-start items-center gap-4 text-xs font-bold text-gray-600 uppercase tracking-widest">
                            <span className="text-gray-400">Step 1: CPU</span>
                            <span className="w-4 h-[1px] bg-gray-800"></span>
                            <span>GPU</span>
                            <span className="w-4 h-[1px] bg-gray-800"></span>
                            <span>RAM</span>
                            <span className="w-4 h-[1px] bg-gray-800"></span>
                            <span>Case</span>
                        </div>
                    </div>

                    {/* Right: UI Visual */}
                    <div className="relative transform lg:translate-x-10 lg:scale-110">
                        <BuilderInterfaceMockup />
                    </div>

                </div>

            </div>
        </section>
    );
};

export default BuilderPromoSection;
