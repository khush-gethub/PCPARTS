import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import Navbar from '../components/Navbar.jsx';
import SubNavbar from '../components/SubNavbar.jsx';
import ProductGallery from '../components/ProductGallery.jsx';
import ProductInfo from '../components/ProductInfo.jsx';
import ProductSpecsAccordion from '../components/ProductSpecsAccordion.jsx';
import gpuImg from '../assets/gpu.jpg';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [variant, setVariant] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Fetch product details
                const prodData = await api.getProductById(id);
                setProduct(prodData);

                // Fetch variants to get price (assuming single variant for now or picking first)
                const variants = await api.getVariants(); // Optimally we should have getVariantsByProductId
                const prodVariant = variants.find(v => v.product_id === prodData.product_id);
                setVariant(prodVariant);

                // Fetch images
                // const imgs = await api.getProductImages(id); 
                // Using fallback for now as we didn't confirm image endpoint or data fully
                setImages([gpuImg]);

            } catch (err) {
                console.error("Error fetching product details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return <div className="p-10 text-center">Loading product details...</div>;
    if (!product) return <div className="p-10 text-center">Product not found.</div>;

    const price = variant ? `$${variant.price}` : 'N/A';

    // Construct specs for Info component
    const specsArray = product.specs ? Object.entries(product.specs).map(([k, v]) => ({ label: k, value: v })) : [];

    return (
        <div className="min-h-screen bg-[#eef2f2] font-sans pb-12">
            <Navbar />
            <SubNavbar />

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="bg-white rounded-sm shadow-sm flex flex-col lg:flex-row p-4 lg:p-6 mb-4">
                    {/* Left Column: Gallery */}
                    <div className="lg:w-[40%] flex-shrink-0">
                        <ProductGallery images={images} />
                    </div>

                    {/* Right Column: Info */}
                    <div className="lg:w-[60%] mt-6 lg:mt-0">
                        <ProductInfo
                            title={product.name}
                            brand={product.category_id?.name || "Brand"} // Ideally brand_id population
                            rating={4.8} // Placeholder
                            reviewsCount={120} // Placeholder
                            price={price}
                            originalPrice={null}
                            discount={null}
                            offers={[
                                { title: "Bank Offer", desc: "5% Cashback on Store Card" },
                            ]}
                        />
                    </div>
                </div>

                {/* Highlights */}
                <div className="bg-white rounded-sm shadow-sm p-6 mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Product Highlights</h3>
                    <div className="flex flex-col md:flex-row gap-8">
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 flex-1">
                            <li>Description: {product.description}</li>
                            {specsArray.map((spec, i) => (
                                <li key={i}>{spec.label}: {spec.value}</li>
                            ))}
                            {variant && <li>Stock Status: {variant.stock_status}</li>}
                        </ul>
                    </div>
                </div>

                {/* Specs Accordion - Passing real specs if component supports it, else keeping it purely for UI structure */}
                <ProductSpecsAccordion specs={product.specs} />

            </div>
        </div>
    );
};

export default ProductDetailsPage;
