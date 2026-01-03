import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const OrderTrackingPage = () => {
    const { orderId } = useParams();

    const steps = [
        { label: 'Ordered', date: 'Dec 24, 10:00 AM', completed: true },
        { label: 'Processing', date: 'Dec 24, 02:00 PM', completed: true },
        { label: 'Shipped', date: 'Dec 25, 09:30 AM', completed: true },
        { label: 'Out for Delivery', date: 'Expected Today', completed: false, current: true },
        { label: 'Delivered', date: 'Expected Dec 26', completed: false }
    ];

    const currentStepIndex = steps.findIndex(s => s.current);

    return (
        <div className="min-h-screen bg-[#eef2f2] font-sans flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="mb-8">
                    <Link to={`/orders/${orderId}`} className="text-sm font-bold text-gray-500 hover:text-orange-600 mb-2 inline-block">← Back to Order Details</Link>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Track Order</h1>
                    <p className="text-gray-500 mt-1">Order ID: <span className="font-mono text-gray-900 font-bold">{orderId}</span></p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="max-w-4xl mx-auto">

                        {/* Status Banner */}
                        <div className="bg-orange-50 border border-orange-100 rounded-lg p-6 mb-12 text-center">
                            <h2 className="text-2xl font-black text-orange-600 mb-2">Arriving Today</h2>
                            <p className="text-orange-800 font-medium">Your package is out for delivery in your area.</p>
                        </div>

                        {/* Visual Stepper */}
                        <div className="relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10 hidden md:block"></div>

                            <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0">
                                {steps.map((step, index) => {
                                    // Logic for visual state
                                    const isCompleted = index <= currentStepIndex; // Previous steps
                                    const isCurrent = step.current;

                                    return (
                                        <div key={step.label} className="relative flex md:flex-col items-center md:items-center gap-4 md:gap-2 bg-white md:bg-transparent p-2 md:p-0">
                                            {/* Connector line for mobile */}
                                            {index !== steps.length - 1 && (
                                                <div className={`absolute top-8 left-3.5 w-0.5 h-full -z-10 md:hidden ${isCompleted ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
                                            )}

                                            <div className={`
                                                w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ring-4 ring-white
                                                ${isCompleted || isCurrent
                                                    ? 'bg-orange-600 border-orange-600 text-white'
                                                    : 'bg-white border-gray-300 text-gray-300'}
                                            `}>
                                                {isCompleted ? (
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                ) : (index + 1)}
                                            </div>

                                            <div className="text-left md:text-center">
                                                <p className={`font-bold text-sm ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{step.date}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Detailed Timeline Events (Optional Extra) */}
                        <div className="mt-16 border-t border-gray-100 pt-8">
                            <h3 className="font-bold text-gray-900 mb-6">Tracking Activity</h3>
                            <div className="space-y-6 max-w-2xl mx-auto">
                                <div className="flex gap-4">
                                    <div className="w-24 text-xs text-gray-500 text-right pt-0.5">8:45 AM</div>
                                    <div className="w-2 h-2 rounded-full bg-orange-600 mt-1.5 flex-shrink-0"></div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">Out for Delivery</p>
                                        <p className="text-gray-500 text-xs text-sm">Bangalore Hub</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 opacity-50">
                                    <div className="w-24 text-xs text-gray-500 text-right pt-0.5">Dec 25</div>
                                    <div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5 flex-shrink-0"></div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">Arrived at Sort Facility</p>
                                        <p className="text-gray-500 text-xs text-sm">Bangalore Main Hub</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default OrderTrackingPage;
