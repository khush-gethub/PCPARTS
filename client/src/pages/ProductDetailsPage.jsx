import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useCart } from '../context/CartContext.jsx';
import Navbar from '../components/Navbar.jsx';
import SubNavbar from '../components/SubNavbar.jsx';
import ProductGallery from '../components/ProductGallery.jsx';
import ProductInfo from '../components/ProductInfo.jsx';
import ProductSpecsAccordion from '../components/ProductSpecsAccordion.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductCarousel from '../components/ProductCarousel.jsx';
import gpuImg from '../assets/gpu.jpg'; // Fallback

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                // Fetch product details with aggregated data
                const prodData = await api.getProductById(id);
                setProduct(prodData);

                // Set initial variant (default to first or active one)
                if (prodData.variants && prodData.variants.length > 0) {
                    setSelectedVariant(prodData.variants[0]);
                }

                // Set images
                if (prodData.images && prodData.images.length > 0) {
                    setImages(prodData.images.map(img => img.image_url));
                } else {
                    setImages([gpuImg]); // Fallback
                }

                // Fetch recommendations (Simple logic: fetch all and filter by category for now)
                // In a real app, backend should provide /products/:id/recommendations
                const allProducts = await api.getProducts();
                const related = allProducts
                    .filter(p => {
                        const pCatId = p.category_id?._id || p.category_id;
                        const prodCatId = prodData.category_id?._id || prodData.category_id;
                        return pCatId === prodCatId && p.product_id !== prodData.product_id;
                    })
                    .slice(0, 10);
                setRelatedProducts(related);

            } catch (err) {
                console.error("Error fetching product details", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDetails();
            window.scrollTo(0, 0);
        }
    }, [id]);

    const handleAddToCart = () => {
        if (!product || !selectedVariant) return;
        addToCart({
            id: selectedVariant._id || selectedVariant.variant_id || product.product_id,
            product_id: product.product_id,
            title: `${product.name} - ${selectedVariant.name}`,
            price: selectedVariant.price,
            image: images[0] || gpuImg,
            variant_name: selectedVariant.name
        });
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/cart');
    };

    if (loading) return (
        <div className="min-h-screen flex text-center items-center justify-center bg-[#eef2f2]">
            <div className="text-xl font-bold text-gray-600 animate-pulse">Loading product details...</div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex text-center items-center justify-center bg-[#eef2f2]">
            <div className="text-xl font-bold text-gray-800">Product not found.</div>
        </div>
    );

    const price = selectedVariant ? `$${selectedVariant.price}` : 'N/A';
    const originalPrice = selectedVariant?.discount_price ? `$${selectedVariant.price + 50}` : null; // Mock logic for orig price
    const discount = selectedVariant?.discount_price ? Math.floor(((selectedVariant.price + 50 - selectedVariant.price) / (selectedVariant.price + 50)) * 100) : null;

    // Construct specs for Info component
    const specsArray = product.specs
        ? Object.entries(product.specs)
            .filter(([k]) => !['ram', 'storage'].includes(k.toLowerCase()))
            .map(([k, v]) => ({ label: k, value: v }))
        : [];

    return (
        <div className="min-h-screen bg-[#eef2f2] font-sans pb-12">
            <Navbar />
            <SubNavbar />

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Product Section */}
                <div className="bg-white rounded-sm shadow-sm flex flex-col lg:flex-row p-4 lg:p-6 mb-4">
                    {/* Left Column: Gallery */}
                    <div className="lg:w-[40%] flex-shrink-0">
                        <ProductGallery images={images} />
                    </div>

                    {/* Right Column: Info */}
                    <div className="lg:w-[60%] mt-6 lg:mt-0">
                        <ProductInfo
                            title={product.name}
                            brand={product.brand_id?.name || "Brand"}
                            rating={4.8} // Placeholder: Backend needs Review aggregation
                            reviewsCount={120} // Placeholder
                            price={price}
                            originalPrice={originalPrice}
                            discount={discount}
                            offers={[
                                { title: "Bank Offer", desc: "5% Cashback on Store Card" },
                            ]}
                            onAddToCart={handleAddToCart}
                            onBuyNow={handleBuyNow}
                        />
                        {/* Variant Selector */}
                        {product.variants && product.variants.length > 1 && (
                            <div className="mt-6 border-t border-gray-100 pt-4">
                                <h4 className="font-bold text-gray-800 text-sm mb-2">Variants</h4>
                                <div className="flex flex-wrap gap-2">
                                    {product.variants.map(v => (
                                        <button
                                            key={v.variant_id}
                                            onClick={() => setSelectedVariant(v)}
                                            className={`px-4 py-2 border rounded text-sm font-medium ${selectedVariant?.variant_id === v.variant_id
                                                ? 'border-orange-500 text-orange-600 bg-orange-50'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                }`}
                                        >
                                            {v.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Highlights */}
                <div className="bg-white rounded-sm shadow-sm p-6 mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Product Highlights</h3>
                    <div className="flex flex-col md:flex-row gap-8">
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 flex-1">
                            <li><strong>Description:</strong> {product.description}</li>
                            {specsArray.map((spec, i) => (
                                <li key={i}><strong>{spec.label}:</strong> {spec.value}</li>
                            ))}
                            {selectedVariant && <li><strong>Stock Status:</strong> <span className={selectedVariant.stock_status === 'in_stock' ? 'text-green-600 font-bold' : 'text-red-500'}>{selectedVariant.stock_status}</span></li>}
                        </ul>
                    </div>
                </div>

                {/* Specs Accordion */}
                <ProductSpecsAccordion specs={product.specs} />

                {/* Recommendations */}
                {relatedProducts.length > 0 && (
                    <div className="bg-white rounded-sm shadow-sm p-6 mt-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-primary">Related Products</h2>
                        <ProductCarousel>
                            {relatedProducts.map(rel => (
                                <ProductCard
                                    key={rel.product_id}
                                    id={rel.product_id}
                                    title={rel.name}
                                    price={`$${rel.price || '999'}`} // Ideally fetch variant price
                                    image={rel.image_url || gpuImg}
                                    brand={rel.brand_id?.name}
                                />
                            ))}
                        </ProductCarousel>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProductDetailsPage;
