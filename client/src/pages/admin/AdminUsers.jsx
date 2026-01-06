import React, { useState } from 'react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminTable from '../../components/admin/AdminTable';
import AdminBadge from '../../components/admin/AdminBadge';

const AdminUsers = () => {
    // Mock Data
    const [users] = useState([
        { id: 'USR-001', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', joined: 'Jan 12, 2023' },
        { id: 'USR-002', name: 'Jane Smith', email: 'jane@test.com', role: 'Customer', status: 'Active', joined: 'Feb 28, 2023' },
        { id: 'USR-003', name: 'Bob Johnson', email: 'bob@spam.com', role: 'Customer', status: 'Suspended', joined: 'Mar 15, 2023' },
        { id: 'USR-004', name: 'Alice Williams', email: 'alice@corp.com', role: 'Moderator', status: 'Active', joined: 'Apr 02, 2023' },
    ]);

    return (
        <div>
            <AdminPageHeader
                title="User Management"
                breadcrumbs={['Dashboard', 'Users']}
                primaryAction={{ label: 'Invite User', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', onClick: () => console.log('Invite clicked') }}
            />

            <AdminTable
                headers={['Name', 'Email', 'Role', 'Status', 'Joined Date']}
                actions={true}
            >
                {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600 mr-3">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-gray-900">{user.name}</span>
                                    <span className="text-[10px] text-gray-400 font-medium">ID: {user.id}</span>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-mono">{user.email}</td>
                        <td className="px-6 py-4">
                            <span className={`text-xs font-bold px-2 py-1 rounded inline-block ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                {user.role}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <AdminBadge type={user.status === 'Active' ? 'success' : 'danger'} text={user.status} />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{user.joined}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                            <button className="text-gray-400 hover:text-gray-900 font-bold text-xs uppercase">Edit</button>
                        </td>
                    </tr>
                ))}
            </AdminTable>
        </div>
    );
};

export default AdminUsers;
