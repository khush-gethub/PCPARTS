import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminTable from '../../components/admin/AdminTable';
import AdminBadge from '../../components/admin/AdminBadge';
import { api } from '../../api';
import { toast } from 'react-toastify';

const AdminProducts = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    // Search and Pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Form State
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category_id: '',
        brand_id: '',
        price: '',
        stock: '',
        image_url: '',
        specs: '{}'
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsData, categoriesData, brandsData] = await Promise.all([
                api.getProducts(),
                api.getCategories(),
                api.getBrands()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
            setBrands(brandsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const navigate = useNavigate();

    // Handle deep-link from notifications (restock)
    useEffect(() => {
        if (location.state?.editProductId && products.length > 0) {
            const productToEdit = products.find(p => p._id === location.state.editProductId);
            if (productToEdit) {
                console.log('Restock triggered for:', productToEdit.name);
                handleOpenModal(productToEdit, true);
                // Clear state using router to avoid re-opening
                navigate(location.pathname, { replace: true, state: {} });
            }
        }
    }, [location.key, products, location.state]);

    const handleOpenModal = (product = null, isRestock = false) => {
        if (product) {
            setCurrentProduct(product);
            setFormData({
                name: product.name,
                description: product.description || '',
                category_id: product.category_id?._id || product.category_id || '',
                brand_id: product.brand_id?._id || product.brand_id || '',
                price: product.price,
                stock: product.stock,
                image_url: product.image_url || '',
                specs: JSON.stringify(product.specs || {}, null, 2)
            });
        } else {
            setCurrentProduct(null);
            setFormData({
                name: '',
                description: '',
                category_id: '',
                brand_id: '',
                price: '',
                stock: '',
                image_url: '',
                specs: '{}'
            });
        }
        setIsModalOpen(true);
        if (isRestock) {
            // Give it a tiny timeout to ensure DOM is ready
            setTimeout(() => {
                const stockInput = document.getElementsByName('stock')[0];
                if (stockInput) {
                    stockInput.focus();
                    stockInput.select();
                }
            }, 100);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentProduct(null);
    };

    const [submitting, setSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let specsJson = {};
            try {
                specsJson = JSON.parse(formData.specs || '{}');
            } catch (jsonErr) {
                toast.error('Invalid JSON in Specs field. Please fix before saving.');
                setSubmitting(false);
                return;
            }

            const payload = {
                ...formData,
                price: Number(formData.price) || 0,
                stock: Number(formData.stock) || 0,
                specs: specsJson
            };

            if (currentProduct) {
                await api.updateProduct(currentProduct._id, payload);
                if (payload.stock > currentProduct.stock) {
                    toast.info(`Notification: Stock for ${payload.name} has been increased from ${currentProduct.stock} to ${payload.stock}.`);
                }
            } else {
                await api.createProduct(payload);
            }
            fetchData();
            handleCloseModal();
            toast.success(currentProduct ? 'Product updated successfully' : 'Product added successfully');
        } catch (err) {
            toast.error('Failed to save product: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.deleteProduct(id);
                fetchData();
                toast.success('Product deleted successfully');
            } catch (err) {
                toast.error('Failed to delete product: ' + err.message);
            }
        }
    };

    const getStatusType = (stock) => {
        if (stock > 10) return 'success';
        if (stock > 0) return 'warning';
        return 'danger';
    };

    const getStatusText = (stock) => {
        if (stock > 10) return 'In Stock';
        if (stock > 0) return 'Low Stock';
        return 'Out of Stock';
    };

    const filteredProducts = useMemo(() => {
        let res = products;
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            res = res.filter(p =>
                p.name?.toLowerCase().includes(lowerSearch) ||
                p.variant_id?.toLowerCase().includes(lowerSearch) ||
                p.category_id?.name?.toLowerCase().includes(lowerSearch) ||
                p.brand_id?.name?.toLowerCase().includes(lowerSearch)
            );
        }
        return res;
    }, [products, searchTerm]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const paginationProps = {
        total: filteredProducts.length,
        start: filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1,
        end: Math.min(currentPage * itemsPerPage, filteredProducts.length),
        onNext: () => setCurrentPage(p => Math.min(totalPages, p + 1)),
        onPrev: () => setCurrentPage(p => Math.max(1, p - 1)),
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
    };

    // Reset pagination on search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading products...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div>
            <AdminPageHeader
                title="Product Management"
                breadcrumbs={['Dashboard', 'Products']}
                primaryAction={{ label: 'Add Product', icon: 'M12 4v16m8-8H4', onClick: () => handleOpenModal() }}
            />

            <div className="mb-6">
                <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="Search products by name, SKU, category, brand..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
            </div>

            <AdminTable
                headers={['Product', 'Category', 'Brand', 'Price', 'Stock', 'Status']}
                actions={true}
                pagination={paginationProps}
            >
                {paginatedProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                                {product.image_url && (
                                    <img src={product.image_url} alt={product.name} className="w-10 h-10 object-cover rounded-lg border border-gray-100" />
                                )}
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-900">{product.name}</span>
                                    <span className="text-[10px] text-gray-400 font-medium">SKU: {product.variant_id}</span>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.category_id?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.brand_id?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{product.price?.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{product.stock}</td>
                        <td className="px-6 py-4">
                            <AdminBadge type={getStatusType(product.stock)} text={getStatusText(product.stock)} />
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                            <button onClick={() => handleOpenModal(product)} className="text-gray-400 hover:text-blue-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button onClick={() => handleDelete(product._id)} className="text-gray-400 hover:text-red-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </td>
                    </tr>
                ))}
            </AdminTable>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">{currentProduct ? 'Edit Product' : 'Add Product'}</h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                                    <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select required name="category_id" value={formData.category_id} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all">
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                                    <select required name="brand_id" value={formData.brand_id} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all">
                                        <option value="">Select Brand</option>
                                        {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                                    <input required type="number" min="0" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                                    <input required type="number" min="0" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                    <input name="image_url" value={formData.image_url} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Specs (as JSON)</label>
                                    <textarea name="specs" value={formData.specs} onChange={handleInputChange} rows="4" className="w-full px-4 py-2 border border-gray-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all" />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                                <button type="button" onClick={handleCloseModal} disabled={submitting} className="px-6 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors disabled:opacity-50">Cancel</button>
                                <button type="submit" disabled={submitting} className="px-6 py-2 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200 disabled:opacity-50 min-w-[120px]">
                                    {submitting ? 'Saving...' : (currentProduct ? 'Update Product' : 'Create Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
