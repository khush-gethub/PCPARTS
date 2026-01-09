import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import ProductCard from './ProductCard';
// Removed fallback image import as we will use real images


const TrendingSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, variantsData] = await Promise.all([
                    api.getProducts(),
                    api.getVariants()
                ]);

                // We need to fetch images and stock for these products to show real data.
                // Limit to 4 for trending first to avoid too many requests
                const trendingProducts = productsData.slice(0, 4);

                const dataWithDetails = await Promise.all(trendingProducts.map(async (p) => {
                    const variant = variantsData.find(v => v.product_id === p.product_id);
                    let image = null;
                    let stock = null;

                    try {
                        const images = await api.getProductImages(p.product_id);
                        if (images && images.length > 0) {
                            image = images[0].image_url;
                        }
                    } catch (e) { console.warn("Image fetch failed", e); }

                    if (variant) {
                        try {
                            const stockData = await api.getStock(variant.variant_id);
                            stock = stockData;
                        } catch (e) { console.warn("Stock fetch failed", e); }
                    }

                    return {
                        ...p,
                        // Use real image or a placeholder URL if missing (or handle in card)
                        image: image || "https://placehold.co/300x200?text=No+Image",
                        price: variant ? `$${variant.price}` : 'N/A',
                        category_name: p.category_id?.name || 'Component',
                        stockStatus: (stock && stock.quantity > 0) ? "In Stock" : "Out of Stock",
                        // Convert specs string/object roughly
                        specList: p.specs ? Object.entries(p.specs).slice(0, 2).map(([key, val]) => ({
                            label: key.charAt(0).toUpperCase() + key.slice(1),
                            val: val.toString()
                        })) : []
                    };
                }));

                setProducts(dataWithDetails);
            } catch (err) {
                console.error("Failed to fetch trending products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="py-24 text-center">Loading Engine Room...</div>;

    return (
        <section className="py-24 bg-white border-b border-gray-100">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header with Progress Bar indicator */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">ENGINE ROOM</h2>
                        <p className="text-gray-500 font-medium">Top trending components this week.</p>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="hidden md:flex items-center gap-4">
                        <span className="text-sm font-bold text-gray-400">01 / 04</span>
                        <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className="w-1/4 h-full bg-orange-600 rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((item) => (
                        <ProductCard
                            key={item.product_id || item._id}
                            id={item.product_id || item._id}
                            title={item.name}
                            image={item.image}
                            price={item.price}
                            brand={item.category_name}
                            specs={item.specList}
                            rating={null} // Hiding rating as not in DB
                            badges={[]} // Removed static badge
                            stockStatus={item.stockStatus}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrendingSection;