import React, { useState } from 'react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminTable from '../../components/admin/AdminTable';
import AdminBadge from '../../components/admin/AdminBadge';

const AdminOrders = () => {
    // Mock Data
    const [orders] = useState([
        { id: '#ORD-7829', customer: 'Michael Scott', date: 'Oct 24, 2023', total: '$1,299.00', status: 'Completed', payment: 'Paid' },
        { id: '#ORD-7830', customer: 'Dwight Schrute', date: 'Oct 25, 2023', total: '$450.50', status: 'Processing', payment: 'Paid' },
        { id: '#ORD-7831', customer: 'Jim Halpert', date: 'Oct 25, 2023', total: '$89.99', status: 'Pending', payment: 'Pending' },
        { id: '#ORD-7832', customer: 'Pam Beesly', date: 'Oct 26, 2023', total: '$2,499.00', status: 'Shipped', payment: 'Paid' },
        { id: '#ORD-7833', customer: 'Ryan Howard', date: 'Oct 26, 2023', total: '$12.00', status: 'Cancelled', payment: 'Refunded' },
    ]);

    const getStatusType = (status) => {
        switch (status) {
            case 'Completed': return 'success';
            case 'Shipped': return 'blue';
            case 'Processing': return 'warning';
            case 'Cancelled': return 'danger';
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
                <button className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">Pending</button>
                <button className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">Completed</button>
                <button className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">Cancelled</button>
            </div>

            <AdminTable
                headers={['Order ID', 'Customer', 'Date', 'Total', 'Payment', 'Status']}
                actions={true}
            >
                {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.id}</td>
                        <td className="px-6 py-4">
                            <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 mr-3">
                                    {order.customer.charAt(0)}
                                </div>
                                <span className="text-sm font-medium text-gray-900">{order.customer}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.total}</td>
                        <td className="px-6 py-4">
                            <span className={`text-xs font-medium ${order.payment === 'Paid' ? 'text-green-600' : 'text-gray-500'}`}>{order.payment}</span>
                        </td>
                        <td className="px-6 py-4">
                            <AdminBadge type={getStatusType(order.status)} text={order.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button className="text-orange-600 font-bold text-xs uppercase hover:underline">View Details</button>
                        </td>
                    </tr>
                ))}
            </AdminTable>
        </div>
    );
};

export default AdminOrders;
