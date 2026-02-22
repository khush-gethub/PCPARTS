import React, { useState, useEffect } from 'react';
import { api } from '../../api.js';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminTable from '../../components/admin/AdminTable';
import AdminBadge from '../../components/admin/AdminBadge';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await api.getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await api.updateOrderStatus(orderId, newStatus);
            // Refresh local state or refetch
            setOrders(orders.map(o => o._id === orderId ? { ...o, order_status: newStatus } : o));
        } catch (error) {
            console.error(`Error updating status to ${newStatus}:`, error);
            alert(`Failed to update order status to ${newStatus}`);
        }
    };

    const getStatusType = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'delivered':
            case 'confirmed': return 'success';
            case 'shipped': return 'blue';
            case 'processing': return 'warning';
            case 'cancelled':
            case 'denied': return 'danger';
            default: return 'neutral';
        }
    };

    return (
        <div>
            <AdminPageHeader
                title="Order Management"
                breadcrumbs={['Dashboard', 'Orders']}
            />

            {/* Filter Tabs Mockup */}
            <div className="flex space-x-2 mb-6 border-b border-gray-200">
                <button className="px-4 py-2 text-sm font-bold text-orange-600 border-b-2 border-orange-600">All Orders</button>
            </div>

            <AdminTable
                headers={['Order ID', 'Customer', 'Date', 'Total', 'Payment', 'Status', 'Actions']}
                actions={true}
            >
                {loading ? (
                    <tr>
                        <td colSpan="7" className="px-6 py-10 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                Loading Orders...
                            </div>
                        </td>
                    </tr>
                ) : orders.length === 0 ? (
                    <tr>
                        <td colSpan="7" className="px-6 py-10 text-center text-gray-500">No orders found.</td>
                    </tr>
                ) : (
                    orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 text-sm font-bold text-gray-900 leading-tight">
                                <span className="text-gray-400 text-[10px] block mb-1">#{order._id.substring(0, 8)}</span>
                                <p className="mb-2">{order._id}</p>
                                <div className="flex flex-wrap gap-1">
                                    {order.items?.map((item, idx) => (
                                        <span key={idx} className="bg-gray-100 text-[9px] px-2 py-0.5 rounded-md text-gray-500 font-bold uppercase tracking-tighter border border-gray-200">
                                            {item.product_name} x {item.quantity}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600 mr-3 shadow-sm">
                                        {(order.user_id?.full_name || 'G').charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-gray-900 leading-none mb-1">{order.user_id?.full_name || 'Guest User'}</span>
                                        <span className="text-[10px] text-gray-400 font-bold leading-none">{order.user_id?.email || 'No Email'}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm font-black text-gray-900">₹{order.total_price}</td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col items-start gap-1">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${order.payment_status === 'paid' ? 'text-green-600' : 'text-gray-400'}`}>
                                        {order.payment_status}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">{order.payment_method}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <AdminBadge type={getStatusType(order.order_status)} text={order.order_status} />
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    {(order.order_status === 'processing' || order.order_status === 'pending') && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(order._id, 'confirmed')}
                                                className="px-3 py-1.5 bg-green-500 text-white text-[10px] font-black rounded-lg hover:bg-green-600 transition-all uppercase tracking-widest"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(order._id, 'denied')}
                                                className="px-3 py-1.5 bg-red-100 text-red-600 text-[10px] font-black rounded-lg hover:bg-red-200 transition-all uppercase tracking-widest"
                                            >
                                                Deny
                                            </button>
                                        </>
                                    )}
                                    {order.order_status === 'confirmed' && (
                                        <button
                                            onClick={() => handleStatusUpdate(order._id, 'shipped')}
                                            className="px-3 py-1.5 bg-blue-500 text-white text-[10px] font-black rounded-lg hover:bg-blue-600 transition-all uppercase tracking-widest"
                                        >
                                            Ship
                                        </button>
                                    )}
                                    {(order.order_status === 'shipped') && (
                                        <button
                                            onClick={() => handleStatusUpdate(order._id, 'delivered')}
                                            className="px-3 py-1.5 bg-gray-900 text-white text-[10px] font-black rounded-lg hover:bg-black transition-all uppercase tracking-widest"
                                        >
                                            Complete
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    )
                    ))}
            </AdminTable>
        </div>
    );
};

export default AdminOrders;
