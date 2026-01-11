import React, { useState } from 'react';

const ProductSpecsAccordion = ({ specs: customSpecs }) => {
    const defaultSpecs = [
        {
            category: "Performance",
            items: [
                { label: "Processor", value: "Intel Core i7-13700K (16 Cores, 24 Threads)" },
                { label: "Base Clock", value: "3.4 GHz" },
                { label: "Boost Clock", value: "5.4 GHz" },
                { label: "Cache", value: "30MB Smart Cache" }
            ]
        },
        {
            category: "Memory",
            items: [
                { label: "RAM Capacity", value: "32 GB" },
                { label: "RAM Type", value: "DDR5" },
                { label: "Frequency", value: "6000 MHz" },
                { label: "Slots", value: "4 DIMM Slots (2 Used)" }
            ]
        },
        {
            category: "Graphics",
            items: [
                { label: "GPU", value: "NVIDIA GeForce RTX 4080" },
                { label: "VRAM", value: "16 GB GDDR6X" },
                { label: "HDMI Ports", value: "2x HDMI 2.1" },
                { label: "DisplayPorts", value: "3x DisplayPort 1.4a" }
            ]
        },
        {
            category: "Storage",
            items: [
                { label: "Primary Storage", value: "1TB NVMe PCIe Gen 4.0 SSD" },
                { label: "Secondary Storage", value: "2TB HDD 7200RPM" }
            ]
        },
        {
            category: "Warranty",
            items: [
                { label: "Duration", value: "3 Years On-site Warranty" },
                { label: "Covered", value: "Manufacturing Defects" },
                { label: "Not Covered", value: "Physical Damage, Burn" }
            ]
        }
    ];

    const [openIndex, setOpenIndex] = useState(0);

    // Normalize specs: If it's a flat object from DB, wrap it in a category
    let normalizedSpecs = [];
    if (Array.isArray(customSpecs) && customSpecs.length > 0) {
        normalizedSpecs = customSpecs;
    } else if (customSpecs && typeof customSpecs === 'object' && Object.keys(customSpecs).length > 0) {
        normalizedSpecs = [{
            category: "Technical Specifications",
            items: Object.entries(customSpecs).map(([label, value]) => ({
                label: label.charAt(0).toUpperCase() + label.slice(1).replace(/_/g, ' '),
                value: String(value)
            }))
        }];
    } else {
        normalizedSpecs = defaultSpecs;
    }

    const specs = normalizedSpecs;

    return (
        <div className="bg-white rounded-md border border-gray-200 mt-8">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Specifications</h2>
            </div>
            {specs.map((section, index) => (
                <div key={index} className="border-b border-gray-200 last:border-0">
                    <button
                        onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
                        className="w-full flex justify-between items-center p-6 bg-gray-50 hover:bg-gray-100 transition text-left"
                    >
                        <span className="font-bold text-gray-800 text-lg">{section.category}</span>
                        <svg
                            className={`w-6 h-6 text-gray-500 transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {openIndex === index && (
                        <div className="p-6 bg-white animate-fadeIn">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                {section.items.map((item, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row md:border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 w-1/3 text-sm font-medium">{item.label}</span>
                                        <span className="text-gray-900 font-semibold text-sm flex-1">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProductSpecsAccordion;
