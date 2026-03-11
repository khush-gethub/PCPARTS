import React, { useState, useEffect, useMemo } from 'react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminTable from '../../components/admin/AdminTable';
import AdminBadge from '../../components/admin/AdminBadge';
import { toast } from 'react-toastify';
import { api } from '../../api';

const AdminReadyMadePCs = () => {
    const [pcs, setPcs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Builder Data
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [variants, setVariants] = useState([]);

    const [editingPC, setEditingPC] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '', // Will be auto-calculated but can be overridden
        category: 'Entry-Level',
        image: ''
    });

    // Selected Parts State: { [categoryId]: variantId }
    // We store variantId because that represents the specific item + price
    const [selectedParts, setSelectedParts] = useState({});

    // Fetch initial data
    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [pcsData, catsData, prodsData, varsData] = await Promise.all([
                api.getReadyMadePCs(),
                api.getCategories(),
                api.getProducts(),
                api.getAllVariants()
            ]);
            setPcs(pcsData);
            setCategories(catsData);
            setProducts(prodsData);
            setVariants(varsData);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    // Calculate Total Price when parts change
    useEffect(() => {
        if (!isModalOpen) return;

        let total = 0;
        Object.values(selectedParts).forEach(variantId => {
            const variant = variants.find(v => v._id === variantId || v.variant_id === variantId);
            if (variant) {
                total += (variant.price || 0);
            }
        });

        // Update price only if user hasn't manually set a "deal price" (optional logic, forcing manual override)
        // For this requirement: "Calculate and display total price dynamically".
        // simple approach: Always set it.
        if (total > 0) {
            setFormData(prev => ({ ...prev, price: total }));
        }
    }, [selectedParts, variants, isModalOpen]);

    const handleEdit = async (pc) => {
        setEditingPC(pc);
        setFormData({
            name: pc.name,
            price: pc.price,
            category: pc.category || 'Entry-Level',
            image: pc.image || ''
        });

        // Load existing parts
        try {
            const fullPC = await api.getReadyMadePCById(pc._id || pc.pc_id);
            const existingItems = fullPC.items || [];

            const newSelected = {};
            existingItems.forEach(item => {
                // Find category of product
                const product = products.find(p => p._id === item.product_id._id || p._id === item.product_id);
                if (product && product.category_id) {
                    const catId = typeof product.category_id === 'object' ? product.category_id._id : product.category_id;
                    newSelected[catId] = item.variant_id._id || item.variant_id;
                }
            });
            setSelectedParts(newSelected);
        } catch (error) {
            console.error("Failed to load PC details", error);
            setSelectedParts({});
        }

        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingPC(null);
        setFormData({
            name: '',
            price: '',
            category: 'Entry-Level',
            image: ''
        });
        setSelectedParts({});
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // Construct items array from selectedParts
        const itemsToSave = [];
        Object.entries(selectedParts).forEach(([catId, variantId]) => {
            // Find product for this variant
            const variant = variants.find(v => v._id === variantId || v.variant_id === variantId);
            if (variant) {
                itemsToSave.push({
                    product_id: variant.product_id,
                    variant_id: variant._id || variant.variant_id
                });
            }
        });

        const payload = {
            ...formData,
            items: itemsToSave
        };

        if (itemsToSave.length === 0) {
            toast.warning("Please select at least one component for the PC build.");
            return;
        }

        if (!payload.price || payload.price <= 0) {
            toast.warning("The total price must be greater than 0. Please select valid components.");
            return;
        }

        try {
            if (editingPC) {
                await api.updateReadyMadePC(editingPC._id || editingPC.pc_id, payload);
            } else {
                await api.createReadyMadePC(payload);
            }
            setIsModalOpen(false);
            fetchInitialData(); // Refresh list
        } catch (error) {
            console.error("Failed to save PC", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this PC?')) {
            try {
                await api.deleteReadyMadePC(id);
                fetchInitialData();
            } catch (error) {
                console.error("Failed to delete", error);
            }
        }
    };

    // Helper to get products for a category
    const getProductsForCategory = (catId) => {
        return products.filter(p => {
            const pCatId = typeof p.category_id === 'object' ? p.category_id._id : p.category_id;
            return pCatId === catId;
        });
    };

    // Helper to get variants for a product
    const getVariantsForProduct = (prodId) => {
        return variants.filter(v => v.product_id === prodId);
    };

    return (
        <div>
            <AdminPageHeader
                title="Ready-Made PCs Manager"
                breadcrumbs={['Dashboard', 'Ready-Made PCs']}
                primaryAction={{ label: 'Build New PC', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', onClick: handleCreate }}
            />

            <AdminTable headers={['PC Name', 'Price', 'Core Specs', 'Category']} actions={true}>
                {loading ? (
                    <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
                ) : pcs.map((pc) => (
                    <tr key={pc._id || pc.pc_id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{pc.name}</td>
                        <td className="px-6 py-4 text-orange-600 font-bold">₹{pc.price?.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                            {/* Static summary for now, could be dynamic if we processed items */}
                            {pc.category === 'High-End' ? 'Extreme Performance' : pc.category === 'Mid-Range' ? 'Balanced Build' : 'Starter Kit'}
                        </td>
                        <td className="px-6 py-4"><AdminBadge type="neutral" text={pc.category} /></td>
                        <td className="px-6 py-4 text-right space-x-2">
                            <button onClick={() => handleEdit(pc)} className="text-blue-600 hover:text-blue-800">Edit</button>
                            <button onClick={() => handleDelete(pc._id || pc.pc_id)} className="text-red-600 hover:text-red-800">Delete</button>
                        </td>
                    </tr>
                ))}
            </AdminTable>

            {/* Builder Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{editingPC ? 'Edit Configuration' : 'System Builder'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 font-bold text-xl">&times;</button>
                        </div>

                        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Left Column: Basic Info */}
                            <div className="lg:col-span-1 space-y-4">
                                <h3 className="font-bold text-gray-900 border-b pb-2">System Info</h3>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Build Name</label>
                                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border p-2 rounded" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Category</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full border p-2 rounded">
                                        <option>Entry-Level</option>
                                        <option>Mid-Range</option>
                                        <option>High-End</option>
                                        <option>Workstation</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Image URL</label>
                                    <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full border p-2 rounded" placeholder="https://..." />
                                </div>
                                <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                                    <label className="block text-xs font-bold text-orange-800 uppercase">Total System Price</label>
                                    <div className="text-3xl font-black text-orange-600 mt-1">₹{formData.price?.toLocaleString('en-IN')}</div>
                                    <p className="text-xs text-orange-600 mt-2">Auto-calculated from selected parts.</p>
                                </div>
                            </div>

                            {/* Right Column: Part Selector */}
                            <div className="lg:col-span-2 space-y-6">
                                <h3 className="font-bold text-gray-900 border-b pb-2">Component Selection</h3>
                                <div className="space-y-4">
                                    {categories.map(cat => (
                                        <div key={cat._id || cat.category_id} className="grid grid-cols-12 gap-4 items-center">
                                            <div className="col-span-3 text-sm font-bold text-gray-600">{cat.name}</div>
                                            <div className="col-span-9">
                                                <select
                                                    className="w-full border border-gray-300 rounded p-2 text-sm"
                                                    value={selectedParts[cat._id || cat.category_id] || ''}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setSelectedParts(prev => ({
                                                            ...prev,
                                                            [cat._id || cat.category_id]: val === '' ? undefined : val
                                                        }));
                                                    }}
                                                >
                                                    <option value="">Select {cat.name}...</option>
                                                    {getProductsForCategory(cat._id || cat.category_id).map(prod => {
                                                        const prodVariants = getVariantsForProduct(prod._id || prod.product_id);
                                                        if (prodVariants.length === 0) return null;
                                                        return (
                                                            <optgroup label={prod.name} key={prod._id}>
                                                                {prodVariants.map(v => (
                                                                    <option key={v._id || v.variant_id} value={v._id || v.variant_id}>
                                                                        {v.name || 'Standard'} (+₹{v.price.toLocaleString('en-IN')})
                                                                    </option>
                                                                ))}
                                                            </optgroup>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="lg:col-span-3 flex justify-end space-x-3 border-t pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 font-bold">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-bold">Save Configuration</button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReadyMadePCs;
