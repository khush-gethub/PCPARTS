import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import PCCard from './PCCard';
// Removed fallback image


const PreBuiltSection = () => {
    const [systems, setSystems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSystems = async () => {
            try {
                const data = await api.getReadyMadePCs();
                setSystems(data);
            } catch (err) {
                console.error("Failed to fetch pre-built PCs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSystems();
    }, []);

    if (loading) return null;

    return (
        <section className="py-24 bg-white border-b border-gray-100">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header with Progress Bar indicator */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-2 uppercase">Pre-Built Systems</h2>
                        <p className="text-gray-500 font-medium">Expertly assembled, performance guaranteed.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {systems && systems.length > 0 ? (
                        systems.slice(0, 4).map((item) => (
                            <PCCard
                                key={item.pc_id || item._id}
                                id={item.pc_id || item._id}
                                name={item.name}
                                image={item.image || "https://placehold.co/400x400?text=PC"}
                                price={item.price ? `$${item.price}` : "N/A"}
                                useCase={item.category || "General"}
                                cpu={""}
                                gpu={""}
                                ram={""}
                                rating={null}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 py-12">
                            {loading ? "Loading systems..." : "No pre-built systems available at the moment."}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PreBuiltSection;
