import React from 'react';

const AdminStatCard = ({ title, value, change, trend, icon, color = "orange" }) => {

    const colorClasses = {
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        green: "bg-green-50 text-green-600 border-green-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
        red: "bg-red-50 text-red-600 border-red-100",
    };

    const isPositive = trend === 'up';

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl border ${colorClasses[color]}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                    </svg>
                </div>
                {change && (
                    <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {isPositive ? (
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        ) : (
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" /></svg>
                        )}
                        {change}
                    </div>
                )}
            </div>

            <h3 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">{value}</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
        </div>
    );
};

export default AdminStatCard;
