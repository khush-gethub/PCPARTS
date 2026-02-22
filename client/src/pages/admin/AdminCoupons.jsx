import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminTable from '../../components/admin/AdminTable';
import AdminBadge from '../../components/admin/AdminBadge';
import { api } from '../../api';

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCouponId, setCurrentCouponId] = useState(null);
    const [newCoupon, setNewCoupon] = useState({
        name: '',
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        min_completed_orders: 0,
        min_order_amount: 0,
        expires_at: '',
        status: 'active'
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const data = await api.getCoupons();
            setCoupons(data);
        } catch (err) {
            console.error("Error fetching coupons:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreateModal = () => {
        setIsEditing(false);
        setNewCoupon({
            name: '',
            code: '',
            discount_type: 'percentage',
            discount_value: '',
            min_completed_orders: 0,
            min_order_amount: 0,
            expires_at: '',
            status: 'active'
        });
        setShowModal(true);
    };

    const handleOpenEditModal = (coupon) => {
        setIsEditing(true);
        setCurrentCouponId(coupon._id);
        setNewCoupon({
            name: coupon.name || '',
            code: coupon.code || '',
            discount_type: coupon.discount_type || 'percentage',
            discount_value: coupon.discount_value || '',
            min_completed_orders: coupon.min_completed_orders || 0,
            min_order_amount: coupon.min_order_amount || 0,
            expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().split('T')[0] : '',
            status: coupon.status || 'active'
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.updateCoupon(currentCouponId, newCoupon);
            } else {
                await api.createCoupon(newCoupon);
            }
            setShowModal(false);
            fetchCoupons();
        } catch (err) {
            alert(`Failed to ${isEditing ? 'update' : 'create'} coupon: ` + err.message);
        }
    };

    const handleDeleteCoupon = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.deleteCoupon(id);
            fetchCoupons();
        } catch (err) {
            alert("Failed to delete: " + err.message);
        }
    };

    return (
        <div className="animate-fadeIn">
            <AdminPageHeader
                title="Coupon Manager"
                breadcrumbs={['Dashboard', 'Coupons']}
                primaryAction={{
                    label: 'Create Coupon',
                    icon: 'M12 4v16m8-8H4',
                    onClick: handleOpenCreateModal
                }}
            />

            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
            ) : (
                <AdminTable
                    headers={['Name / Code', 'Discount', 'Requirement', 'Expiry Date', 'Status', 'Actions']}
                    actions={true}
                >
                    {coupons.map((coupon) => (
                        <tr key={coupon._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-gray-900">{coupon.name || 'Unnamed'}</span>
                                    <span className="text-[10px] text-gray-400 font-black tracking-widest font-mono">{coupon.code}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-sm font-bold text-green-600">
                                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                {coupon.min_completed_orders > 0 ? `${coupon.min_completed_orders} Completed Orders` : 'None'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'No Limit'}
                            </td>
                            <td className="px-6 py-4">
                                <AdminBadge
                                    type={coupon.status === 'active' ? 'success' : 'neutral'}
                                    text={coupon.status}
                                />
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                                <button
                                    onClick={() => handleOpenEditModal(coupon)}
                                    className="text-gray-400 hover:text-orange-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDeleteCoupon(coupon._id)}
                                    className="text-gray-400 hover:text-red-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </AdminTable>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-scaleUp">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-2xl font-black text-gray-900 leading-none">{isEditing ? 'Edit' : 'New'} <span className="text-orange-600">Coupon</span></h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Coupon Name</label>
                                    <input
                                        type="text" required
                                        placeholder="Flash Sale"
                                        className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold"
                                        value={newCoupon.name}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Coupon Code</label>
                                    <input
                                        type="text" required
                                        placeholder="FLASH50"
                                        className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-black font-mono tracking-widest"
                                        value={newCoupon.code}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Discount Type</label>
                                    <select
                                        className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold"
                                        value={newCoupon.discount_type}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, discount_type: e.target.value })}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Discount Value</label>
                                    <input
                                        type="number" required
                                        placeholder="10"
                                        className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold"
                                        value={newCoupon.discount_value}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, discount_value: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Min Orders Req.</label>
                                    <input
                                        type="number"
                                        placeholder="2"
                                        className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold"
                                        value={newCoupon.min_completed_orders}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, min_completed_orders: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Expiry Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold"
                                        value={newCoupon.expires_at}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, expires_at: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                                <select
                                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold"
                                    value={newCoupon.status}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, status: e.target.value })}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="w-full py-4 bg-orange-600 text-white text-sm font-black rounded-2xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/20 uppercase tracking-widest">
                                    {isEditing ? 'Update' : 'Save'} Coupon
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCoupons;
