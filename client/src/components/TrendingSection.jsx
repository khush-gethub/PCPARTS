import React, { useEffect, useState } from 'react';
import { api } from '../api';
import ProductCard from './ProductCard';

const TrendingSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch basic product info
                const productsData = await api.getProducts();

                // Limit to 4 for trending
                const trendingProducts = productsData.slice(0, 4);

                // Enrich with variants (images are now in p.image_url from backend)
                const enrichedData = await Promise.all(trendingProducts.map(async (p) => {
                    let image = p.image_url || "https://placehold.co/300x200?text=No+Image";
                    let price = "N/A";
                    let stockStatus = "Unknown";

                    try {
                        const [variants] = await Promise.all([
                            api.getVariantsByProductId(p.product_id)
                        ]);

                        if (variants.length > 0) {
                            price = `$${variants[0].price}`;
                            stockStatus = variants[0].stock_status === 'in_stock' ? "In Stock" : "Out of Stock";
                        }
                    } catch (e) {
                        console.warn("Error enriching product", p.product_id, e);
                    }

                    return {
                        ...p,
                        image,
                        price,
                        category_name: p.category_id?.name || 'Component',
                        stockStatus,
                        // Convert specs to array for card
                        specList: p.specs ? Object.entries(p.specs).slice(0, 3).map(([key, val]) => ({
                            label: key,
                            val: val ? val.toString() : ''
                        })) : []
                    };
                }));

                setProducts(enrichedData);
            } catch (err) {
                console.error("Failed to fetch trending products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <section className="py-24 bg-white border-b border-gray-100 flex justify-center">
            <div className="text-gray-400 font-medium animate-pulse">Loading Engine Room...</div>
        </section>
    );

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
                            brand={item.brand_id?.name || item.category_name}
                            specs={item.specList}
                            stockStatus={item.stockStatus}
                            rating={4.8} // Placeholder rating
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrendingSection;
