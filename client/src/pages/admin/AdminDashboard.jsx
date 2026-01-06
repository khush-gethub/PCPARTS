import React from 'react';
import AdminStatCard from '../../components/admin/AdminStatCard';

const AdminDashboard = () => {
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
                    value="$48,294"
                    change="+12.5%"
                    trend="up"
                    icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    color="green"
                />
                <AdminStatCard
                    title="Total Orders"
                    value="1,245"
                    change="+3.2%"
                    trend="up"
                    icon="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    color="blue"
                />
                <AdminStatCard
                    title="Active Users"
                    value="8,521"
                    change="+28.4%"
                    trend="up"
                    icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    color="purple"
                />
                <AdminStatCard
                    title="Low Stock Alerts"
                    value="12"
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
                <div className="overflow-x-auto">
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
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">#ORD-00{i}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">Jane Doe</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">Oct 24, 2023</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">$1,299.00</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-green-50 text-green-700 text-[10px] font-black uppercase px-2 py-1 rounded border border-green-100">Completed</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
