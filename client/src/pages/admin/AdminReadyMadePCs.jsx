import React, { useState } from 'react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminTable from '../../components/admin/AdminTable';
import AdminBadge from '../../components/admin/AdminBadge';

const AdminReadyMadePCs = () => {
    // Mock Data
    const [pcs] = useState([
        { id: 'PC-001', name: 'Starter Gaming PC', price: '$899.00', cpu: 'Intel i5-12400F', gpu: 'RTX 3060', status: 'Available' },
        { id: 'PC-002', name: 'Pro Streamer Build', price: '$2,499.00', cpu: 'AMD Ryzen 9 7900X', gpu: 'RTX 4080', status: 'Available' },
        { id: 'PC-003', name: 'Office Workstation', price: '$650.00', cpu: 'Intel i3-12100', gpu: 'Integrated', status: 'Out of Stock' },
        { id: 'PC-004', name: 'Ultra Beast X', price: '$4,200.00', cpu: 'Intel i9-13900KS', gpu: 'RTX 4090 OC', status: 'Limited' },
    ]);

    return (
        <div>
            <AdminPageHeader
                title="Ready-Made PCs"
                breadcrumbs={['Dashboard', 'Ready-Made PCs']}
                primaryAction={{ label: 'Build New PC', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', onClick: () => console.log('Build clicked') }}
            />

            <AdminTable
                headers={['PC Name', 'Price', 'Core Specs', 'Stock Status']}
                actions={true}
            >
                {pcs.map((pc) => (
                    <tr key={pc.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-900">{pc.name}</span>
                                <span className="text-[10px] text-gray-400 font-medium">{pc.id}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-orange-600">{pc.price}</td>
                        <td className="px-6 py-4">
                            <div className="flex flex-col text-xs text-gray-600">
                                <span><span className="font-bold text-gray-400">CPU:</span> {pc.cpu}</span>
                                <span><span className="font-bold text-gray-400">GPU:</span> {pc.gpu}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <AdminBadge
                                type={pc.status === 'Available' ? 'success' : pc.status === 'Limited' ? 'warning' : 'neutral'}
                                text={pc.status}
                            />
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                            <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                        </td>
                    </tr>
                ))}
            </AdminTable>
        </div>
    );
};

export default AdminReadyMadePCs;
