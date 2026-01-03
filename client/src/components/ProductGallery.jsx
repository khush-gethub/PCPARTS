import React, { useState } from 'react';

const ProductGallery = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);
    const [isHovered, setIsHovered] = useState(false);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setCursorPos({ x, y });
    };

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-4 h-full">
            {/* Thumbnails (Vertical on desktop) */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible lg:w-20 flex-shrink-0 hide-scrollbar">
                {images.map((img, index) => (
                    <div
                        key={index}
                        onMouseEnter={() => setSelectedImage(img)}
                        className={`w-16 h-16 lg:w-20 lg:h-20 border-2 rounded-lg cursor-pointer overflow-hidden flex-shrink-0 transition-all ${selectedImage === img ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-contain bg-white p-1" />
                    </div>
                ))}
            </div>

            {/* Main Image */}
            <div
                className="flex-1 border border-gray-100 rounded-xl bg-white relative overflow-hidden group flex items-center justify-center p-4"
                style={{ minHeight: '500px' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseMove={handleMouseMove}
            >
                <img
                    src={selectedImage}
                    alt="Main Product"
                    className={`max-w-full max-h-[500px] object-contain transition-transform duration-200 ${isHovered ? 'scale-150 origin-center' : 'scale-100'}`}
                    style={isHovered ? {
                        transformOrigin: `${cursorPos.x}% ${cursorPos.y}%`
                    } : {}}
                />

                {/* Wishlist Button Overlay */}
                <button className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md text-gray-400 hover:text-red-500 transition border border-gray-100">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ProductGallery;
