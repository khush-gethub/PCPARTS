import React from 'react';

const AdminPlaceholderPage = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-500 max-w-md">This module is currently under construction. Check back soon for full functionality.</p>
        </div>
    );
};

export default AdminPlaceholderPage;
