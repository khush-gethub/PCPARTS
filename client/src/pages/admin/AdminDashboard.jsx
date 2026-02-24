import React, { useState, useEffect } from 'react';
import AdminStatCard from '../../components/admin/AdminStatCard';
import { api } from '../../api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        activeUsers: 0,
        lowStockAlerts: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.getAdminStats();
                setStats(data);
            } catch (err) {
                console.error("Error fetching stats:", err);
            }
        };

        fetchStats();
    }, []);

    useEffect(() => {
        const fetchRecentOrders = async () => {
            setLoading(true);
            try {
                const data = await api.getAdminRecentOrders(page, limit);
                setRecentOrders(data.orders);
                setTotalPages(data.totalPages);
                setError(null);
            } catch (err) {
                console.error("Error fetching recent orders:", err);
                setError("Failed to load recent orders");
            } finally {
                setLoading(false);
            }
        };

        fetchRecentOrders();
    }, [page]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-red-50 rounded-2xl border border-red-100">
                <div className="text-red-500 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-red-900">Something went wrong</h3>
                <p className="text-red-700 mt-1">{error}</p>
                <button
                    onClick={() => setPage(1)}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminStatCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    change="+12.5%"
                    trend="up"
                    icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    color="green"
                />
                <AdminStatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    change="+3.2%"
                    trend="up"
                    icon="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    color="blue"
                />
                <AdminStatCard
                    title="Active Users"
                    value={stats.activeUsers}
                    change="+28.4%"
                    trend="up"
                    icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    color="purple"
                />
                <AdminStatCard
                    title="Low Stock Alerts"
                    value={stats.lowStockAlerts}
                    change="-2"
                    trend="down"
                    icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    color="red"
                />
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                    <button className="text-orange-600 text-xs font-bold uppercase tracking-widest hover:text-orange-700">View All</button>
                </div>
                <div className="overflow-x-auto min-h-[400px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-[400px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                        </div>
                    ) : (
                        <>
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentOrders.length > 0 ? (
                                        recentOrders.map((order) => (
                                            <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                                    #{order._id.substring(0, 10).toUpperCase()}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {order.user_id?.name || 'Guest'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {formatDate(order.created_at)}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                                    {formatCurrency(order.total_price)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${order.order_status === 'delivered' || order.order_status === 'confirmed'
                                                            ? 'bg-green-50 text-green-700 border-green-100'
                                                            : order.order_status === 'cancelled' || order.order_status === 'denied'
                                                                ? 'bg-red-50 text-red-700 border-red-100'
                                                                : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                        }`}>
                                                        {order.order_status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">
                                                No recent orders found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                                    <p className="text-sm text-gray-500 font-medium">
                                        Showing page <span className="text-gray-900">{page}</span> of <span className="text-gray-900">{totalPages}</span>
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-all border ${page === 1
                                                    ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 border-gray-200 hover:border-orange-600 hover:text-orange-600'
                                                }`}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-all border ${page === totalPages
                                                    ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 border-gray-200 hover:border-orange-600 hover:text-orange-600'
                                                }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
