import React from 'react';

const AdminBadge = ({ type, text }) => {
    const styles = {
        success: 'bg-green-50 text-green-700 border-green-100',
        warning: 'bg-orange-50 text-orange-700 border-orange-100',
        danger: 'bg-red-50 text-red-700 border-red-100',
        neutral: 'bg-gray-50 text-gray-700 border-gray-200',
        blue: 'bg-blue-50 text-blue-700 border-blue-100',
        purple: 'bg-purple-50 text-purple-700 border-purple-100',
    };

    const className = styles[type] || styles.neutral;

    return (
        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${className}`}>
            {text}
        </span>
    );
};

export default AdminBadge;
