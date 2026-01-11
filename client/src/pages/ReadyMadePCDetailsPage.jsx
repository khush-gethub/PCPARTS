import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useCart } from '../context/CartContext.jsx';
import Navbar from '../components/Navbar.jsx';
import SubNavbar from '../components/SubNavbar.jsx';
import ProductGallery from '../components/ProductGallery.jsx';
import ReadyMadePCInfo from '../components/ReadyMadePCInfo.jsx';
import ProductSpecsAccordion from '../components/ProductSpecsAccordion.jsx';
import PCCard from '../components/PCCard.jsx';
import ProductCarousel from '../components/ProductCarousel.jsx';
import heroPC from '../assets/hero-pc.png'; // Fallback

const ReadyMadePCDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [pcData, setPcData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recommendedPCs, setRecommendedPCs] = useState([]);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const data = await api.getReadyMadePCById(id);
                setPcData(data);

                // Fetch recommendations (Other PCs)
                const allPCs = await api.getReadyMadePCs();
                const related = allPCs
                    .filter(p => p.pc_id !== data.pc_id)
                    .slice(0, 10);
                setRecommendedPCs(related);

            } catch (err) {
                console.error("Error fetching PC details", err);
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
        if (!pcData) return;
        addToCart({
            id: pcData.pc_id,
            product_id: pcData.pc_id,
            title: pcData.name,
            price: pcData.price,
            image: (pcData.images && pcData.images.length > 0) ? pcData.images[0] : heroPC,
            category: pcData.category
        });
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/cart');
    };

    if (loading) return (
        <div className="min-h-screen flex text-center items-center justify-center bg-[#eef2f2]">
            <div className="text-xl font-bold text-gray-600 animate-pulse">Loading PC details...</div>
        </div>
    );

    if (!pcData) return (
        <div className="min-h-screen flex text-center items-center justify-center bg-[#eef2f2]">
            <div className="text-xl font-bold text-gray-800">PC configuration not found.</div>
        </div>
    );

    // Transform API images array or fallback
    const images = (pcData.images && pcData.images.length > 0) ? pcData.images : [heroPC];

    // Transform Items into Specs structure
    const componentSpecs = {
        category: "System Components",
        items: pcData.items ? pcData.items.map(item => ({
            label: item.product_id?.name || "Component",
            value: item.variant_id?.name || "Standard"
        })) : []
    };

    const specs = [componentSpecs];

    return (
        <div className="min-h-screen bg-[#eef2f2] font-sans pb-12">
            <Navbar />
            <SubNavbar />

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="bg-white rounded-sm shadow-sm flex flex-col lg:flex-row p-4 lg:p-6 mb-4">
                    {/* Left Column: Gallery (40%) */}
                    <div className="lg:w-[40%] flex-shrink-0">
                        <ProductGallery images={images} />
                    </div>

                    {/* Right Column: Info (60%) */}
                    <div className="lg:w-[60%] mt-6 lg:mt-0">
                        <ReadyMadePCInfo
                            title={pcData.name}
                            useCase={pcData.category}
                            rating={4.8}
                            reviewsCount={42}
                            price={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(pcData.price)}
                            originalPrice={null}
                            discount={null}
                            offers={[
                                { title: "Bank Offer", desc: "Flat ₹5000 off on HDFC Credit Cards" },
                                { title: "No Cost EMI", desc: "Available for up to 12 months" }
                            ]}
                            status="In Stock"
                            onAddToCart={handleAddToCart}
                            onBuyNow={handleBuyNow}
                        />
                    </div>
                </div>


                {/* Highlights & Seller Info Section */}
                <div className="bg-white rounded-sm shadow-sm p-6 mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">System Highlights</h3>
                    <div className="flex flex-col md:flex-row gap-8">
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 flex-1">
                            {/* Dynamic Highlighting based on top components */}
                            {pcData.items && pcData.items.slice(0, 5).map((item, i) => (
                                <li key={i}>{item.product_id?.name}</li>
                            ))}
                        </ul>

                        <div className="md:w-1/3 border-l border-gray-100 pl-8">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-gray-500 text-sm">Assembled By</span>
                                <span className="font-bold text-orange-600">Antigravity Systems</span>
                                <span className="bg-orange-600 text-white text-xs px-1.5 rounded-sm">Elite</span>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-gray-300 mr-2"></span>3 Years Onsite Warranty</li>
                                <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-gray-300 mr-2"></span>Lifetime Tech Support</li>
                            </ul>
                            <div className="mt-4">
                                <Link to={`/ready-made-pc/${id}/components`} className="text-sm font-bold text-blue-600 hover:underline">
                                    View Full Component List &gt;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Specs Accordion */}
                <ProductSpecsAccordion specs={specs} />

                {/* Recommended PC Upgrade Options / Related PCs */}
                {recommendedPCs.length > 0 && (
                    <div className="bg-white rounded-sm shadow-sm p-6 mt-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-primary">Similar Systems</h2>
                        <ProductCarousel>
                            {recommendedPCs.map(pc => (
                                <PCCard
                                    key={pc.pc_id}
                                    id={pc.pc_id}
                                    name={pc.name}
                                    price={`$${pc.price}`}
                                    image={pc.image || heroPC}
                                    useCase={pc.category}
                                    cpu="See Details"
                                    gpu="See Details"
                                    ram="See Details"
                                />
                            ))}
                        </ProductCarousel>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReadyMadePCDetailsPage;
