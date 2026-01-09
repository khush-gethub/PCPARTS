import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import Navbar from '../components/Navbar.jsx';
import SubNavbar from '../components/SubNavbar.jsx';
import ProductCard from '../components/ProductCard.jsx';
import AdvancedFilters from '../components/AdvancedFilters.jsx';

const CategoryPage = () => {
    const { categoryId } = useParams();
    const categoryName = categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1) : 'Category';
    const [sortBy, setSortBy] = useState('relevance');

    // Filter State
    const [filters, setFilters] = useState({
        priceRange: 200000,
        brands: [],
        availability: 'any',
        specs: {}
    });

    const handleFilterChange = (category, value) => {
        if (category === 'reset') {
            setFilters({
                priceRange: 200000,
                brands: [],
                availability: 'any',
                specs: {}
            });
        } else {
            setFilters(prev => ({ ...prev, [category]: value }));
        }
    };

    // Mock Product Data with advanced specs
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data on mount or when categoryId changes
    React.useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // 1. Fetch All Products and Categories Global
                const [allProducts, categories] = await Promise.all([
                    api.getProducts(),
                    api.getCategories()
                ]);

                let data = allProducts;
                let matchedCategory = null;

                // 2. Filter by Category if categoryId is present and not generic
                if (categoryId && categoryId.toLowerCase() !== 'components' && categoryId.toLowerCase() !== 'all') {

                    // Try to match by ID or Name
                    const targetCat = categories.find(c =>
                        c.name.toLowerCase() === categoryId.toLowerCase() ||
                        c.category_id === categoryId
                    );

                    if (targetCat) {
                        matchedCategory = targetCat;
                        // Filter by ID Match
                        const filtered = allProducts.filter(p =>
                            p.category_id && (p.category_id._id === targetCat.category_id || p.category_id === targetCat.category_id)
                        );
                        if (filtered.length > 0) data = filtered;
                        // If filtered is 0, we might want to keep it 0 to show "No products in this category" 
                        // BUT user said "show data like home page", implying if "no category" (or invalid), show data.
                        // However, if I am in "Processors", and I have 0 Processors, showing ALL products is confusing.
                        // I will assume if targetCat is found, we respect the filter (even if 0).
                        // If targetCat is NOT found, we fallback to text search, and if that fails, maybe we show all?
                        // Let's stick to: Match -> Filter. No Match -> Text Filter.
                        data = filtered;
                    } else {
                        // Fallback: Text search on category_name or just return all if it looks like a "main" page request
                        const textFiltered = allProducts.filter(p => p.category_name?.toLowerCase().includes(categoryId.toLowerCase()));
                        if (textFiltered.length > 0) {
                            data = textFiltered;
                        } else {
                            // If no text match found, it might be an invalid category URL. 
                            // User request: "in category page there is no category i want to show product data like home page data"
                            // This implies if category is missing/invalid, show ALL.
                            console.warn("Category not found, showing all products");
                            data = allProducts;
                        }
                    }
                }

                // 3. Enrich Data (Image, Price, Stock)
                const enriched = await Promise.all(data.map(async (p) => {
                    let price = "N/A";
                    let image = "https://placehold.co/400x400?text=No+Image";
                    let stockStatus = "Out of Stock";
                    let originalPrice = null;

                    try {
                        const variants = await api.getVariants();
                        const variant = variants.find(v => v.product_id === p.product_id || v.product_id === p._id);
                        if (variant) {
                            price = `$${variant.price}`;
                            if (variant.discount_price) originalPrice = `$${variant.discount_price}`;

                            try {
                                const s = await api.getStock(variant.variant_id);
                                stockStatus = (s && s.quantity > 0) ? "In Stock" : "Out of Stock";
                            } catch (e) { }
                        }

                        const images = await api.getProductImages(p.product_id || p._id);
                        if (images.length > 0) image = images[0].image_url;

                    } catch (e) { console.warn("Enrich error", e) }

                    return {
                        id: p.product_id || p._id,
                        title: p.name,
                        price: price,
                        originalPrice: originalPrice,
                        image: image,
                        stockStatus: stockStatus,
                        brand: p.brand_id?.name || "Brand",
                        specs: p.specs ? Object.entries(p.specs).map(([k, v]) => ({ label: k, val: v })) : []
                    };
                }));

                setProducts(enriched);

            } catch (err) {
                console.error("Failed to load category products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryId]);

    // Filtering Logic
    const filteredProducts = useMemo(() => {
        let result = products;

        // 1. Price Filter
        result = result.filter(p => {
            const priceNum = parseFloat(p.price.replace(/[^0-9.-]+/g, ""));
            return !isNaN(priceNum) ? priceNum <= filters.priceRange : true;
        });

        // 2. Brand Filter
        if (filters.brands.length > 0) {
            result = result.filter(p => filters.brands.map(b => b.toLowerCase()).includes(p.brand.toLowerCase()));
        }

        // 3. Availability Filter
        if (filters.availability === 'in_stock') {
            result = result.filter(p => p.stockStatus === 'In Stock');
        }

        // 4. Specs Filter (Best effort match)
        Object.values(filters.specs).forEach(selectedOptions => {
            if (selectedOptions.length > 0) {
                result = result.filter(p =>
                    p.specs.some(spec =>
                        selectedOptions.some(opt =>
                            spec.val.toString().toLowerCase().includes(opt.toLowerCase()) ||
                            spec.label.toLowerCase().includes(opt.toLowerCase())
                        )
                    )
                );
            }
        });

        // Sorting
        return result.sort((a, b) => {
            if (sortBy === 'price_low') {
                const pA = parseFloat(a.price.replace(/[^0-9.-]+/g, ""));
                const pB = parseFloat(b.price.replace(/[^0-9.-]+/g, ""));
                return pA - pB;
            }
            if (sortBy === 'price_high') {
                const pA = parseFloat(a.price.replace(/[^0-9.-]+/g, ""));
                const pB = parseFloat(b.price.replace(/[^0-9.-]+/g, ""));
                return pB - pA;
            }
            return 0; // Relevance default
        });
    }, [products, filters, sortBy]);

    return (
        <div className="min-h-screen bg-[#eef2f2] font-sans pb-12">
            <Navbar />
            <SubNavbar />

            {/* Breadcrumb Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="text-sm text-gray-500 font-medium">
                        <Link to="/" className="hover:text-orange-600 transition">Home</Link>
                        <span className="mx-2">/</span>
                        <Link to="/category/components" className="hover:text-orange-600 transition">Components</Link>
                        {categoryId && (
                            <>
                                <span className="mx-2">/</span>
                                <span className="text-gray-900">{categoryName}</span>
                            </>
                        )}
                    </nav>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Column: Stats & Filters (Sticky) - 25% */}
                    <div className="w-full lg:w-1/4 flex-shrink-0">
                        <div className="sticky top-24">
                            <AdvancedFilters
                                categoryId={categoryId}
                                filters={filters}
                                onFilterChange={handleFilterChange}
                            />
                        </div>
                    </div>

                    {/* Right Column: Product Grid - 75% */}
                    <div className="flex-1">
                        {/* Top Controls */}
                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center">
                            <h1 className="text-lg font-bold text-gray-900 mb-2 sm:mb-0">
                                {categoryName} <span className="text-gray-400 font-normal text-sm ml-2">({filteredProducts.length} Results)</span>
                            </h1>

                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
                                <select
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2 outline-none"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="relevance">Relevance</option>
                                    <option value="price_low">Price: Low to High</option>
                                    <option value="price_high">Price: High to Low</option>
                                    <option value="rating">Rating</option>
                                    <option value="newest">Newest First</option>
                                </select>
                            </div>
                        </div>

                        {/* Selected Filter Chips */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {filters.brands.map(brand => (
                                <span key={brand} className="bg-white border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-sm">
                                    Brand: {brand}
                                    <button onClick={() => handleFilterChange('brands', filters.brands.filter(b => b !== brand))} className="ml-2 text-gray-400 hover:text-red-500">×</button>
                                </span>
                            ))}
                            {filters.availability === 'in_stock' && (
                                <span className="bg-white border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-sm">
                                    In Stock
                                    <button onClick={() => handleFilterChange('availability', 'any')} className="ml-2 text-gray-400 hover:text-red-500">×</button>
                                </span>
                            )}
                            {Object.entries(filters.specs).flatMap(([key, options]) =>
                                options.map(opt => (
                                    <span key={`${key}-${opt}`} className="bg-white border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-sm">
                                        {opt}
                                        <button onClick={() => {
                                            const newOptions = options.filter(o => o !== opt);
                                            handleFilterChange('specs', { ...filters.specs, [key]: newOptions });
                                        }} className="ml-2 text-gray-400 hover:text-red-500">×</button>
                                    </span>
                                ))
                            )}
                            {(filters.brands.length > 0 || filters.availability !== 'any' || Object.values(filters.specs).some(arr => arr.length > 0)) && (
                                <button onClick={() => handleFilterChange('reset')} className="text-xs text-orange-600 font-bold hover:underline ml-2">Clear All</button>
                            )}
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loading ? <div className="col-span-full text-center py-12 text-gray-500">Loading products...</div> :
                                filteredProducts.length === 0 ? <div className="col-span-full text-center py-12 text-gray-500">No products found matching your filters.</div> :
                                    filteredProducts.map(product => (
                                        <div key={product.id} className="h-full">
                                            <ProductCard
                                                {...product}
                                                specs={product.specs.slice(0, 3)} // Ensure visual consistency
                                            />
                                        </div>
                                    ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-12 flex justify-center">
                            <nav className="flex items-center gap-2">
                                <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 disabled:opacity-50" disabled>
                                    ←
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center bg-orange-600 text-white rounded-lg font-bold shadow-sm">1</button>
                                <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">2</button>
                                <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">3</button>
                                <span className="text-gray-400 px-2">...</span>
                                <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                                    →
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CategoryPage;
