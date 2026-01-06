import React from 'react';

const AdminPageHeader = ({ title, breadcrumbs, primaryAction }) => {
    return (
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-black text-gray-900 mb-2">{title}</h1>
                {breadcrumbs && (
                    <nav className="flex text-sm text-gray-500 font-medium">
                        {breadcrumbs.map((crumb, index) => (
                            <span key={index} className="flex items-center">
                                {index > 0 && <span className="mx-2 text-gray-300">/</span>}
                                <span className={index === breadcrumbs.length - 1 ? 'text-gray-900 border-b-2 border-orange-500' : 'hover:text-gray-700'}>
                                    {crumb}
                                </span>
                            </span>
                        ))}
                    </nav>
                )}
            </div>
            {primaryAction && (
                <button
                    onClick={primaryAction.onClick}
                    className="bg-[#f06437] text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition duration-150 text-sm flex items-center shadow-lg shadow-orange-200 hover:shadow-xl hover:translate-y-[-1px]"
                >
                    {primaryAction.icon && (
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={primaryAction.icon} />
                        </svg>
                    )}
                    {primaryAction.label}
                </button>
            )}
        </div>
    );
};

export default AdminPageHeader;
