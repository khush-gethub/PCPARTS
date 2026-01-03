import React from 'react';

const BuilderInterfaceMockup = () => {
    return (
        <div className="w-full aspect-square bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl relative overflow-hidden p-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="h-4 w-32 bg-slate-700 rounded-full"></div>
            </div>

            <div className="grid grid-cols-3 gap-4 h-full">
                <div className="col-span-2 space-y-4">
                    <div className="h-32 w-full bg-slate-700/50 rounded-xl border border-slate-600 border-dashed animate-pulse"></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 bg-slate-700/50 rounded-xl"></div>
                        <div className="h-24 bg-slate-700/50 rounded-xl"></div>
                    </div>
                    <div className="h-24 bg-orange-600/20 rounded-xl border border-orange-500/30"></div>
                </div>
                <div className="space-y-4">
                    <div className="h-full bg-slate-700/50 rounded-xl"></div>
                </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent pointer-events-none"></div>
        </div>
    );
};

export default BuilderInterfaceMockup;
