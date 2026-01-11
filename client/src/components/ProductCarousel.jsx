import React, { useRef } from 'react';

const ProductCarousel = ({ children }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left'
                ? scrollLeft - clientWidth * 0.8
                : scrollLeft + clientWidth * 0.8;

            scrollRef.current.scrollTo({
                left: scrollTo,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative group">
            {/* Left Button */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-xl border border-gray-100 p-3 rounded-full -ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-orange-600 hover:text-white"
                aria-label="Scroll Left"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 18l-6-6 6-6" />
                </svg>
            </button>

            {/* Carousel Container */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth px-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {React.Children.map(children, (child) => (
                    <div className="flex-none w-[280px] sm:w-[320px] snap-start">
                        {child}
                    </div>
                ))}
            </div>

            {/* Right Button */}
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 shadow-xl border border-gray-100 p-3 rounded-full -mr-4 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-orange-600 hover:text-white"
                aria-label="Scroll Right"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 18l6-6-6-6" />
                </svg>
            </button>

            <style aria-hidden="true">{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default ProductCarousel;
