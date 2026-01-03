import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import SubNavbar from '../components/SubNavbar.jsx';
import Footer from '../components/Footer.jsx';
import BuilderRow from '../components/BuilderRow.jsx';
import PartSelectionModal from '../components/PartSelectionModal.jsx';

// --- MOCK DATA ---
const MOCK_PRODUCTS = {
    cpu: [
        { id: 'cpu1', name: 'Intel Core i9-13900K', price: 49999, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=200', specs: { 'Core Count': '24', 'Boost Clock': '5.8 GHz', 'TDP': '125W', 'Socket': 'LGA1700' }, stockStatus: 'In Stock', wattage: 125 },
        { id: 'cpu2', name: 'AMD Ryzen 9 7950X', price: 52999, image: 'https://images.unsplash.com/photo-1555618568-96041067d5ce?auto=format&fit=crop&q=80&w=200', specs: { 'Core Count': '16', 'Boost Clock': '5.7 GHz', 'TDP': '170W', 'Socket': 'AM5' }, stockStatus: 'In Stock', wattage: 170 },
        { id: 'cpu3', name: 'Intel Core i5-13600K', price: 28999, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=200', specs: { 'Core Count': '14', 'Boost Clock': '5.1 GHz', 'TDP': '125W', 'Socket': 'LGA1700' }, stockStatus: 'In Stock', wattage: 125 },
    ],
    cooler: [
        { id: 'clr1', name: 'NZXT Kraken Z73 RGB', price: 24999, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=200', specs: { 'Radiator Size': '360mm', 'Fan Noise': '22-33 dBA', 'RGB': 'Yes' }, stockStatus: 'In Stock', wattage: 10 },
        { id: 'clr2', name: 'Noctua NH-D15', price: 8999, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=200', specs: { 'Type': 'Air Cooler', 'Fan Noise': '19-24 dBA', 'Height': '165mm' }, stockStatus: 'In Stock', wattage: 5 },
    ],
    motherboard: [
        { id: 'mb1', name: 'ASUS ROG Maximus Z790 Hero', price: 58999, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=200', specs: { 'Socket': 'LGA1700', 'Form Factor': 'ATX', 'Memory': 'DDR5', 'WiFi': 'Yes' }, stockStatus: 'In Stock', wattage: 50 },
        { id: 'mb2', name: 'MSI MAG B650 Tomahawk WiFi', price: 21999, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=200', specs: { 'Socket': 'AM5', 'Form Factor': 'ATX', 'Memory': 'DDR5', 'WiFi': 'Yes' }, stockStatus: 'In Stock', wattage: 45 },
    ],
    ram: [
        { id: 'ram1', name: 'Corsair Vengeance RGB 32GB (2x16GB)', price: 12499, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=200', specs: { 'Speed': 'DDR5-6000', 'Latency': 'CL36', 'Capacity': '32GB' }, stockStatus: 'In Stock', wattage: 5 },
        { id: 'ram2', name: 'G.Skill Trident Z5 Neo 64GB (2x32GB)', price: 24999, image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=200', specs: { 'Speed': 'DDR5-6000', 'Latency': 'CL30', 'Capacity': '64GB' }, stockStatus: 'Low Stock', wattage: 8 },
    ],
    storage: [
        { id: 'ssd1', name: 'Samsung 990 Pro 2TB', price: 16999, image: 'https://images.unsplash.com/photo-1628557672631-1a890e0c0c7e?auto=format&fit=crop&q=80&w=200', specs: { 'Type': 'NVMe Gen4', 'Read Speed': '7450 MB/s', 'Capacity': '2TB' }, stockStatus: 'In Stock', wattage: 5 },
        { id: 'ssd2', name: 'WD Black SN850X 1TB', price: 9999, image: 'https://images.unsplash.com/photo-1628557672631-1a890e0c0c7e?auto=format&fit=crop&q=80&w=200', specs: { 'Type': 'NVMe Gen4', 'Read Speed': '7300 MB/s', 'Capacity': '1TB' }, stockStatus: 'In Stock', wattage: 5 },
    ],
    gpu: [
        { id: 'gpu1', name: 'ASUS ROG Strix RTX 4090 OC', price: 185000, image: 'https://images.unsplash.com/photo-1624705024411-db5267b2d396?auto=format&fit=crop&q=80&w=200', specs: { 'VRAM': '24GB GDDR6X', 'Boost Clock': '2640 MHz', 'Length': '358mm' }, stockStatus: 'In Stock', wattage: 450 },
        { id: 'gpu2', name: 'Gigabyte GeForce RTX 4070 Ti Gaming OC', price: 78999, image: 'https://images.unsplash.com/photo-1624705024411-db5267b2d396?auto=format&fit=crop&q=80&w=200', specs: { 'VRAM': '12GB GDDR6X', 'Boost Clock': '2640 MHz', 'Length': '336mm' }, stockStatus: 'In Stock', wattage: 285 },
    ],
    case: [
        { id: 'case1', name: 'Lian Li O11 Dynamic EVO', price: 14999, image: 'https://images.unsplash.com/photo-1587202372616-b4345bb655a6?auto=format&fit=crop&q=80&w=200', specs: { 'Type': 'ATX Mid Tower', 'Side Panel': 'Tempered Glass', 'Color': 'Black' }, stockStatus: 'In Stock', wattage: 0 },
        { id: 'case2', name: 'Corsair 4000D Airflow', price: 7499, image: 'https://images.unsplash.com/photo-1587202372616-b4345bb655a6?auto=format&fit=crop&q=80&w=200', specs: { 'Type': 'ATX Mid Tower', 'Side Panel': 'Tempered Glass', 'Color': 'White' }, stockStatus: 'In Stock', wattage: 0 },
    ],
    psu: [
        { id: 'psu1', name: 'Corsair RM1000x', price: 15499, image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf42c?auto=format&fit=crop&q=80&w=200', specs: { 'Wattage': '1000W', 'Rating': '80+ Gold', 'Modular': 'Full' }, stockStatus: 'In Stock', wattage: 0 },
        { id: 'psu2', name: 'MSI MPG A850G', price: 11999, image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf42c?auto=format&fit=crop&q=80&w=200', specs: { 'Wattage': '850W', 'Rating': '80+ Gold', 'Modular': 'Full' }, stockStatus: 'In Stock', wattage: 0 },
    ],
    os: [
        { id: 'os1', name: 'Windows 11 Home', price: 11999, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=200', specs: { 'Type': '64-bit', 'Media': 'USB Flash Drive' }, stockStatus: 'In Stock', wattage: 0 },
    ],
    monitor: [
        { id: 'mon1', name: 'LG 27GP850-B', price: 32999, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=200', specs: { 'Size': '27"', 'Resolution': '2560x1440', 'Refresh': '165Hz' }, stockStatus: 'In Stock', wattage: 35 },
    ]
};

const ConfiguratorPage = () => {
    // --- STATE ---
    const [selectedParts, setSelectedParts] = useState({
        cpu: null,
        cooler: null,
        motherboard: null,
        ram: null,
        storage: null,
        gpu: null,
        case: null,
        psu: null,
        os: null,
        monitor: null,
        expansion: null,
        peripherals: null,
        accessories: null,
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [currentCategoryID, setCurrentCategoryID] = useState(null);
    const [currentCategoryName, setCurrentCategoryName] = useState('');

    // --- CONFIGURATION ---
    const componentRows = [
        { id: 'cpu', label: 'CPU', icon: '💻' },
        { id: 'cooler', label: 'CPU Cooler', icon: '❄️' },
        { id: 'motherboard', label: 'Motherboard', icon: '🔌' },
        { id: 'ram', label: 'Memory', icon: '🧠' },
        { id: 'storage', label: 'Storage', icon: '💾' },
        { id: 'gpu', label: 'Video Card', icon: '🎮' },
        { id: 'case', label: 'Case', icon: '📦' },
        { id: 'psu', label: 'Power Supply', icon: '⚡' },
        { id: 'os', label: 'Operating System', icon: '💿' },
        { id: 'monitor', label: 'Monitor', icon: '🖥️' },
        { id: 'expansion', label: 'Expansion Cards', icon: '📶' },
        { id: 'peripherals', label: 'Peripherals', icon: '⌨️' },
        { id: 'accessories', label: 'Accessories', icon: '🎧' },
    ];

    // --- HANDLERS ---
    const openSelectionModal = (id, name) => {
        setCurrentCategoryID(id);
        setCurrentCategoryName(name);
        setModalOpen(true);
    };

    const handleSelectProduct = (product) => {
        setSelectedParts(prev => ({ ...prev, [currentCategoryID]: product }));
    };

    const handleRemoveProduct = (id) => {
        setSelectedParts(prev => ({ ...prev, [id]: null }));
    };

    // --- CALCULATIONS ---
    const calculateTotal = () => {
        return Object.values(selectedParts).reduce((acc, part) => acc + (part?.price || 0), 0);
    };

    const calculateWattage = () => {
        return Object.values(selectedParts).reduce((acc, part) => acc + (part?.wattage || 0), 0);
    };

    const totalWattage = calculateWattage();
    const totalPrice = calculateTotal();

    // Basic Compatibility Logic
    const getCompatibilityStatus = () => {
        const issues = [];
        if (selectedParts.cpu && selectedParts.motherboard) {
            // Mock check: e.g. if CPU is AMD and Mobo is Intel (based on name for now)
            const cpuName = selectedParts.cpu.name.toLowerCase();
            const moboSpecs = selectedParts.motherboard.specs.Socket;

            if (cpuName.includes('intel') && moboSpecs !== 'LGA1700') issues.push("Incompatible CPU Socket");
            if (cpuName.includes('ryzen') && moboSpecs !== 'AM5') issues.push("Incompatible CPU Socket");
        }

        if (selectedParts.psu && totalWattage > parseInt(selectedParts.psu.specs.Wattage?.replace('W', '') || 0)) {
            issues.push("PSU Wattage Insufficient");
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
                                    {componentRows.map(row => (
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
                                    <span className="font-mono text-gray-900">₹{totalPrice.toLocaleString()}</span>
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
                                            ₹{totalPrice.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button className="w-full bg-orange-600 text-white py-3.5 rounded-lg font-bold shadow-lg shadow-orange-600/20 hover:bg-orange-700 transform hover:scale-[1.02] transition-all">
                                    Buy All
                                </button>
                                <button className="w-full bg-white border-2 border-orange-100 text-orange-600 py-3.5 rounded-lg font-bold hover:bg-orange-50 transition-colors">
                                    Save List
                                </button>
                            </div>

                            {/* Share Link (Mock) */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-2">Share Link</label>
                                <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-200">
                                    <input type="text" readOnly value="https://pcbuilder.com/list/xyz123" className="bg-transparent text-xs text-gray-500 w-full px-2 focus:outline-none font-mono" />
                                    <button className="text-xs font-bold text-orange-600 px-3 py-1 hover:bg-white rounded-md transition-colors shadow-sm">Copy</button>
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
                products={MOCK_PRODUCTS[currentCategoryID] || []}
                onSelect={handleSelectProduct}
            />
        </div>
    );
};

export default ConfiguratorPage;
