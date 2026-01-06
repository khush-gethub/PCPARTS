import React, { useState } from 'react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminTable from '../../components/admin/AdminTable';
import AdminBadge from '../../components/admin/AdminBadge';

const AdminProducts = () => {
    // Mock Data
    const [products] = useState([
        { id: 'PROD-001', name: 'NVIDIA GeForce RTX 4090', category: 'GPU', brand: 'NVIDIA', price: '$1,599.00', stock: 12, status: 'In Stock' },
        { id: 'PROD-002', name: 'Intel Core i9-13900K', category: 'CPU', brand: 'Intel', price: '$589.00', stock: 4, status: 'Low Stock' },
        { id: 'PROD-003', name: 'Samsung 980 PRO 2TB', category: 'Storage', brand: 'Samsung', price: '$169.99', stock: 0, status: 'Out of Stock' },
        { id: 'PROD-004', name: 'Corsair Vengeance DDR5 32GB', category: 'RAM', brand: 'Corsair', price: '$129.99', stock: 45, status: 'In Stock' },
        { id: 'PROD-005', name: 'ASUS ROG Swift Monitor', category: 'Monitor', brand: 'ASUS', price: '$799.00', stock: 8, status: 'In Stock' },
    ]);

    const getStatusType = (status) => {
        if (status === 'In Stock') return 'success';
        if (status === 'Low Stock') return 'warning';
        return 'danger';
    };

    return (
        <div>
            <AdminPageHeader
                title="Product Management"
                breadcrumbs={['Dashboard', 'Products']}
                primaryAction={{ label: 'Add Product', icon: 'M12 4v16m8-8H4', onClick: () => console.log('Add clicked') }}
            />

            <AdminTable
                headers={['Product Name', 'Category', 'Brand', 'Price', 'Stock', 'Status']}
                actions={true}
            >
                {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-900">{product.name}</span>
                                <span className="text-[10px] text-gray-400 font-medium">{product.id}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.brand}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{product.price}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{product.stock}</td>
                        <td className="px-6 py-4">
                            <AdminBadge type={getStatusType(product.status)} text={product.status} />
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                            <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
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

export default AdminProducts;
