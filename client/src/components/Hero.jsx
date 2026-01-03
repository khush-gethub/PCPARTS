import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = ({ images = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!images.length) return;
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <section className="relative overflow-hidden h-[600px] flex items-center bg-[#cae2e2]">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-20 left-20 w-24 h-24 bg-white rotate-45 transform"></div>
                <div className="absolute bottom-40 right-40 w-40 h-40 bg-white rotate-12 transform"></div>
                <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white rotate-6 transform"></div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10 w-full">
                <div className="flex flex-col md:flex-row items-center justify-between gap-16">
                    {/* Left Content */}
                    <div className="md:w-full lg:w-[65%] text-left">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-800 leading-[1.1] mb-8 lg:tracking-tighter">
                            <span className="block xl:whitespace-nowrap">YOUR ULTIMATE PC</span>
                            <span className="block xl:whitespace-nowrap">JOURNEY STARTS HERE</span>
                        </h1>
                        <p className="text-gray-600 max-w-lg mb-12 text-base font-bold leading-relaxed">
                            Build your dream rig with our curated selection of high-performance components. Expertly crafted for every level of gamer.
                        </p>
                        <button
                            onClick={() => navigate('/configurator')}
                            className="bg-[#f06437] text-white px-10 py-4 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-xl text-xs uppercase tracking-widest active:scale-95 transform"
                        >
                            Shop Now
                        </button>
                    </div>

                    {/* Right Images (Simulated Carousel/Static for now to match image) */}
                    <div className="md:w-1/2 relative flex items-center justify-center h-[400px]">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className={`absolute transition-all duration-1000 ease-in-out transform ${index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                    }`}
                            >
                                <img
                                    src={image}
                                    alt={`Hero ${index}`}
                                    className="max-h-[350px] w-auto drop-shadow-2xl object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Indicators */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`h-2.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-[#f06437] w-8' : 'bg-white w-2.5'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;