import React, { useState } from 'react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminTable from '../../components/admin/AdminTable';
import AdminBadge from '../../components/admin/AdminBadge';

const AdminCoupons = () => {
    // Mock Data
    const [coupons] = useState([
        { id: 'CPN-001', code: 'SUMMER2024', discount: '15%', type: 'Percentage', expiry: 'Aug 31, 2024', usage: '45/100', status: 'Active' },
        { id: 'CPN-002', code: 'WELCOME10', discount: '$10.00', type: 'Fixed Amount', expiry: 'Dec 31, 2024', usage: '1240/∞', status: 'Active' },
        { id: 'CPN-003', code: 'FLASH50', discount: '50%', type: 'Percentage', expiry: 'Expired', usage: '50/50', status: 'Expired' },
    ]);

    return (
        <div>
            <AdminPageHeader
                title="Coupon Manager"
                breadcrumbs={['Dashboard', 'Coupons']}
                primaryAction={{ label: 'Create Coupon', icon: 'M12 4v16m8-8H4', onClick: () => console.log('Create clicked') }}
            />

            <AdminTable
                headers={['Code', 'Discount', 'Type', 'Expiry Date', 'Usage', 'Status']}
                actions={true}
            >
                {coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-gray-900 font-mono tracking-wider">{coupon.code}</span>
                                <span className="text-[10px] text-gray-400 font-medium">ID: {coupon.id}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-green-600">{coupon.discount}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{coupon.type}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{coupon.expiry}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700">{coupon.usage}</td>
                        <td className="px-6 py-4">
                            <AdminBadge type={coupon.status === 'Active' ? 'success' : 'neutral'} text={coupon.status} />
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                            <button className="text-gray-400 hover:text-red-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </td>
                    </tr>
                ))}
            </AdminTable>
        </div>
    );
};

export default AdminCoupons;
