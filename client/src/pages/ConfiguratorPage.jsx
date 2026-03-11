import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar.jsx';
import SubNavbar from '../components/SubNavbar.jsx';
import Footer from '../components/Footer.jsx';
import BuilderRow from '../components/BuilderRow.jsx';
import PartSelectionModal from '../components/PartSelectionModal.jsx';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../api';

// --- CONFIGURATION ---
const COMPONENT_ROWS = [
    { id: 'cat_cpu', label: 'CPU', icon: '💻' },
    { id: 'cat_cpu_cooler', label: 'CPU Cooler', icon: '❄️' },
    { id: 'cat_motherboard', label: 'Motherboard', icon: '🔌' },
    { id: 'cat_ram', label: 'Memory', icon: '🧠' },
    { id: 'cat_storage_ssd', label: 'Storage', icon: '💾' },
    { id: 'cat_graphic_card', label: 'Video Card', icon: '🎮' },
    { id: 'cat_cabinet', label: 'Case', icon: '📦' },
    { id: 'cat_power_supply', label: 'Power Supply', icon: '⚡' },
    { id: 'cat_operating_system', label: 'Operating System', icon: '💿' },
    { id: 'cat_monitor', label: 'Monitor', icon: '🖥️' },
    { id: 'cat_accessories', label: 'Accessories', icon: '🎧' },
];

const ConfiguratorPage = () => {
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // --- STATE ---
    const [selectedParts, setSelectedParts] = useState({
        cat_cpu: null,
        cat_cpu_cooler: null,
        cat_motherboard: null,
        cat_ram: null,
        cat_storage_ssd: null,
        cat_graphic_card: null,
        cat_cabinet: null,
        cat_power_supply: null,
        cat_operating_system: null,
        cat_monitor: null,
        cat_accessories: null,
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [currentCategoryID, setCurrentCategoryID] = useState(null);
    const [currentCategoryName, setCurrentCategoryName] = useState('');
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    // --- SHARE LINK EFFECT ---
    const [shareUrl, setShareUrl] = useState('');
    const [shareCopied, setShareCopied] = useState(false);

    // Initial Load from URL
    useEffect(() => {
        const loadBuildFromUrl = async () => {
            const partsToLoad = {};
            let hasParts = false;
            for (const [key, value] of searchParams.entries()) {
                if (COMPONENT_ROWS.find(row => row.id === key) && value) {
                    partsToLoad[key] = value;
                    hasParts = true;
                }
            }
            if (!hasParts) return;

            try {
                const newSelected = { ...selectedParts };
                await Promise.all(
                    Object.entries(partsToLoad).map(async ([key, id]) => {
                        try {
                            const product = await api.getProductById(id);
                            if (product) {
                                newSelected[key] = product;
                            }
                        } catch (err) {
                            console.error(`Failed to load product ${id} for ${key}`);
                        }
                    })
                );
                setSelectedParts(newSelected);
            } catch (err) {
                console.error("Error loading build from URL", err);
            }
        };

        if (searchParams.toString()) {
            loadBuildFromUrl();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync state to URL and Share Link
    useEffect(() => {
        const params = new URLSearchParams();
        Object.entries(selectedParts).forEach(([key, part]) => {
            if (part && (part.product_id || part._id)) {
                params.set(key, part.product_id || part._id);
            }
        });
        const qs = params.toString();

        // Only replace if it changed
        if (qs !== searchParams.toString()) {
            setSearchParams(params, { replace: true });
        }

        const url = `${window.location.origin}${window.location.pathname}${qs ? `?${qs}` : ''}`;
        setShareUrl(url);
        setShareCopied(false);
    }, [selectedParts, searchParams, setSearchParams]);

    const handleCopyShare = () => {
        navigator.clipboard.writeText(shareUrl);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
    };

    // --- FETCHING ---
    const fetchProductsForCategory = async (categoryId) => {
        setIsLoadingProducts(true);
        try {
            const response = await fetch(`http://localhost:4080/api/products/category/${categoryId}`);
            const data = await response.json();
            setCategoryProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    // --- HANDLERS ---
    const openSelectionModal = (id, name) => {
        setCurrentCategoryID(id);
        setCurrentCategoryName(name);
        fetchProductsForCategory(id);
        setModalOpen(true);
    };

    const handleSelectProduct = (product) => {
        setSelectedParts(prev => ({ ...prev, [currentCategoryID]: product }));
    };

    const handleRemoveProduct = (id) => {
        setSelectedParts(prev => ({ ...prev, [id]: null }));
    };

    const handleBuyAll = () => {
        const partsToBuy = Object.values(selectedParts).filter(p => p !== null);
        partsToBuy.forEach(part => {
            addToCart({
                ...part,
                id: part.id || part._id // Ensure consistent ID for cart
            });
        });
        toast.success(`${partsToBuy.length} items added to cart!`);
    };

    const handleSaveBuild = async () => {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        if (!user) {
            toast.warning('Please login to save your build');
            navigate('/login');
            return;
        }
        const items = Object.values(selectedParts).filter(Boolean);

        if (items.length === 0) {
            toast.warning('Please select at least one component to save');
            return;
        }

        const buildItems = items.map(part => {
            const categoryId = Object.keys(selectedParts).find(key => selectedParts[key] === part);
            return {
                product_id: part._id,
                category_id: categoryId,
                variant_id: part.variant_id
            };
        });

        setIsSaving(true);
        try {
            const res = await fetch('http://localhost:4080/api/pc-builds', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id || user._id,
                    name: `My Custom Build - ${new Date().toLocaleDateString('en-GB')}`,
                    total_price: totalPrice,
                    items: buildItems
                })
            });
            if (res.ok) {
                toast.success('Build saved successfully!');
            } else {
                toast.error('Failed to save build');
            }
        } catch (err) {
            console.error(err);
            toast.error('An error occurred while saving');
        } finally {
            setIsSaving(false);
        }
    };

    // --- CALCULATIONS ---
    const calculateTotal = () => {
        return Object.values(selectedParts).reduce((acc, part) => acc + (part?.price || 0), 0);
    };

    const calculateWattage = () => {
        return Object.values(selectedParts).reduce((acc, part) => {
            const wattage = part?.specs?.Wattage || 0;
            return acc + (typeof wattage === 'number' ? wattage : parseInt(wattage) || 0);
        }, 0);
    };

    const totalWattage = calculateWattage();
    const totalPrice = calculateTotal();

    // Basic Compatibility Logic
    const getCompatibilityStatus = () => {
        const issues = [];
        if (selectedParts.cat_cpu && selectedParts.cat_motherboard) {
            const cpu = selectedParts.cat_cpu;
            const mobo = selectedParts.cat_motherboard;
            const cpuSocket = cpu.specs?.Socket;
            const moboSocket = mobo.specs?.Socket;

            // Socket Check (Mandatory)
            if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
                issues.push(`Socket Mismatch: ${cpuSocket} vs ${moboSocket}`);
            }

            // Brand & Chipset Logic (Mandatory)
            const cpuName = (cpu.name || '').toLowerCase();
            const cpuBrandAttr = (cpu.brand_id?.name || '').toLowerCase();
            const isIntel = cpuBrandAttr.includes('intel') || cpuName.includes('intel');
            const isAMD = cpuBrandAttr.includes('amd') || cpuName.includes('amd') || cpuName.includes('ryzen');

            const moboName = (mobo.name || '').toUpperCase();
            const moboChipsetAttr = (mobo.specs?.Chipset || mobo.specs?.chipset || '').toUpperCase();

            // Improved Series Detection (Handles H610, B760, Z790, B550I, X670E, etc.)
            const isIntelSeries = (chipset) => /^[HBQWZ]\d{2,3}/.test(chipset) || /\b[HBQWZ]\d{2,3}/.test(moboName);
            const isAMDSeries = (chipset) => /^[ABX]\d{2,3}/.test(chipset) || /\b[ABX]\d{2,3}/.test(moboName);

            if (isIntel) {
                if (!isIntelSeries(moboChipsetAttr)) {
                    issues.push("Incompatible Selection: Intel CPU requires an Intel chipset motherboard (H/B/Q/W/Z series)");
                }
            } else if (isAMD) {
                if (!isAMDSeries(moboChipsetAttr)) {
                    issues.push("Incompatible Selection: AMD CPU requires an AMD chipset motherboard (A/B/X series)");
                }
            }
        }

        // PSU Check
        if (selectedParts.cat_power_supply) {
            const psuWattage = parseInt(selectedParts.cat_power_supply.specs?.Wattage) || 0;
            if (totalWattage > psuWattage && psuWattage > 0) {
                issues.push("Power Warning: Estimated system wattage exceeds selected PSU capacity");
            }
        }

        return issues.length > 0 ? { status: "Issues Found", color: "bg-red-500", issues } : { status: "Compatible", color: "bg-green-500", issues: [] };
    };

    const compatibility = getCompatibilityStatus();

    return (
        <div className="min-h-screen bg-[#eef2f2] font-sans flex flex-col">
            <Navbar />
            <SubNavbar />

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">PC Builder</h1>
                    <p className="text-gray-500">Configure your custom PC part by part.</p>
                </div>

                {/* Compatibility Banner */}
                <div className={`w-full rounded-md shadow-sm mb-8 text-white flex justify-between items-center px-6 py-3 ${compatibility.color}`}>
                    <div className="flex items-center gap-3">
                        {compatibility.issues.length === 0 ? (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        )}
                        <span className="font-bold uppercase tracking-wide text-sm">
                            {compatibility.status}: {compatibility.issues.length > 0 ? compatibility.issues.join(", ") : "No issues or incompatibilities found."}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        <span className="font-bold text-sm">Estimated Wattage: {totalWattage}W</span>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-8 items-start">

                    {/* Left: Component List (Builder Table) */}
                    <div className="w-full xl:w-3/4 space-y-4">
                        {/* Header Row for visual structure */}
                        <div className="bg-gray-100 rounded-t-lg hidden md:flex border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <div className="py-3 px-4 pl-6 w-[15%]">Component</div>
                            <div className="py-3 px-4 w-[55%]">Selection</div>
                            <div className="py-3 px-4 w-[15%] text-right">Price</div>
                            <div className="py-3 px-4 w-[15%] text-right pr-6">Availability</div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <tbody className="divide-y divide-gray-100">
                                    {COMPONENT_ROWS.map(row => (
                                        <BuilderRow
                                            key={row.id}
                                            label={row.label}
                                            icon={row.icon}
                                            part={selectedParts[row.id]}
                                            onAdd={() => openSelectionModal(row.id, row.label)}
                                            onRemove={() => handleRemoveProduct(row.id)}
                                            onEdit={() => openSelectionModal(row.id, row.label)}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right: Sticky Summary Panel */}
                    <div className="w-full xl:w-1/4 xl:sticky xl:top-24 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h2 className="text-xl font-black text-gray-900 mb-6 pb-4 border-b border-gray-100">Build Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Base Total</span>
                                    <span className="font-mono text-gray-900">₹{totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-mono text-gray-900">Free</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-mono text-gray-900 opacity-50">-</span>
                                </div>

                                <div className="pt-4 border-t border-gray-100 mt-4">
                                    <div className="flex justify-between items-end">
                                        <span className="font-bold text-gray-900">Total</span>
                                        <span className="text-3xl font-black text-orange-600 tracking-tight">
                                            ₹{totalPrice.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleBuyAll}
                                    className="w-full bg-orange-600 text-white py-3.5 rounded-lg font-bold shadow-lg shadow-orange-600/20 hover:bg-orange-700 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={totalPrice === 0}
                                >
                                    Buy All
                                </button>
                                <button
                                    onClick={handleSaveBuild}
                                    disabled={isSaving || totalPrice === 0}
                                    className="w-full bg-white border-2 border-orange-100 text-orange-600 py-3.5 rounded-lg font-bold hover:bg-orange-50 transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? 'Saving...' : 'Save List'}
                                </button>
                            </div>

                            {/* Share Link */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-2">Share Link</label>
                                <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-200">
                                    <input type="text" readOnly value={shareUrl} className="bg-transparent text-xs text-gray-500 w-full px-2 focus:outline-none font-mono" />
                                    <button onClick={handleCopyShare} className="text-xs font-bold text-orange-600 px-3 py-1 hover:bg-white rounded-md transition-colors shadow-sm">
                                        {shareCopied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            <Footer />

            <PartSelectionModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                componentType={currentCategoryName}
                products={categoryProducts}
                onSelect={handleSelectProduct}
                isLoading={isLoadingProducts}
                selectedParts={selectedParts}
            />
        </div>
    );
};

export default ConfiguratorPage;
