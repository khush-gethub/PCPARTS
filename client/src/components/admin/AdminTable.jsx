import React from 'react';

const AdminTable = ({ headers, children, actions, pagination }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest"
                                >
                                    {header}
                                </th>
                            ))}
                            {actions && <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {children}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            {pagination && (
                <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                    <span className="text-xs font-medium text-gray-500">
                        Showing {pagination.start} to {pagination.end} of {pagination.total} results
                    </span>
                    <div className="flex space-x-2">
                        <button
                            onClick={pagination.onPrev}
                            disabled={!pagination.hasPrev}
                            className="px-3 py-1 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            onClick={pagination.onNext}
                            disabled={!pagination.hasNext}
                            className="px-3 py-1 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
            {!pagination && (
                <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500">Showing {children ? React.Children.count(children) : 0} results</span>
                </div>
            )}
        </div>
    );
};

export default AdminTable;
