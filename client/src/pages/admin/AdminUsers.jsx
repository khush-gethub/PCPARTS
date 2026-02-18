import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminTable from '../../components/admin/AdminTable';
import AdminBadge from '../../components/admin/AdminBadge';
import { api } from '../../api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await api.getUsers();
                // Filter out admins as requested
                const customerUsers = data.filter(user => user.role !== 'admin');
                setUsers(customerUsers);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading users...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-bold">Error: {error}</div>;

    return (
        <div>
            <AdminPageHeader
                title="User Management"
                breadcrumbs={['Dashboard', 'Users']}
            // Removed primaryAction (Invite User)
            />

            {/* User Statistics Card */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Users</p>
                        <h3 className="text-3xl font-black text-gray-900">{users.length}</h3>
                    </div>
                    <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <AdminTable
                headers={['Name', 'Email', 'Role', 'Joined Date']}
                actions={false} // Removed actions (Edit)
            >
                {users.map((user) => (
                    <tr key={user._id || user.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-xs font-black text-orange-600 mr-4 shadow-sm">
                                    {(user.name || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-gray-900">{user.name || 'Guest'}</span>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">ID: {user._id || user.id}</span>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-mono font-medium">{user.email}</td>
                        <td className="px-6 py-4">
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-gray-100 text-gray-500 border border-gray-200">
                                {user.role || 'customer'}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-500">
                            {user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            }) : 'N/A'}
                        </td>
                    </tr>
                ))}
            </AdminTable>
        </div>
    );
};

export default AdminUsers;
