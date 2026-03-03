import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../api.js';
import Navbar from '../components/Navbar.jsx';
import SubNavbar from '../components/SubNavbar.jsx';
import Footer from '../components/Footer.jsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const OrderConfirmationPage = () => {
    const location = useLocation();
    const orderId = location.state?.orderId;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        } else {
            setLoading(false);
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const data = await api.getOrderById(orderId);
            setOrder(data);
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    const orderDate = order?.created_at
        ? new Date(order.created_at).toLocaleDateString('en-GB')
        : new Date().toLocaleDateString('en-GB');

    const handleDownloadInvoice = () => {
        if (!order) return;
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(234, 88, 12); // Orange
        doc.text('PC Parts Invoice', 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Order ID: ${order._id}`, 14, 30);
        doc.text(`Date: ${new Date(order.created_at).toLocaleDateString('en-GB')}`, 14, 35);

        // Billing Info
        doc.setTextColor(0);
        doc.setFontSize(12);
        doc.text('Billed To:', 14, 45);
        doc.setFontSize(10);
        doc.text(`${order.address_id.firstName} ${order.address_id.lastName}`, 14, 52);
        doc.text(`${order.address_id.line1}`, 14, 57);
        doc.text(`${order.address_id.city}, ${order.address_id.state} ${order.address_id.pincode}`, 14, 62);

        // Items Table
        const tableColumn = ["Item", "Quantity", "Price", "Total"];
        const tableRows = [];
        order.items.forEach(item => {
            tableRows.push([
                item.product_name,
                item.quantity,
                `Rs. ${item.price}`,
                `Rs. ${Number(item.price) * item.quantity}`
            ]);
        });

        doc.autoTable({
            startY: 70,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [234, 88, 12] }
        });

        // Totals
        const finalY = doc.lastAutoTable.finalY || 70;
        doc.text(`Subtotal: Rs. ${order.subtotal || 0}`, 140, finalY + 10);
        doc.text(`Tax: Rs. ${order.tax || 0}`, 140, finalY + 17);
        doc.text(`Shipping: Rs. ${order.shipping_cost || 0}`, 140, finalY + 24);
        if (order.discount > 0) {
            doc.text(`Discount: -Rs. ${order.discount}`, 140, finalY + 31);
        }
        doc.setFontSize(12);
        doc.setTextColor(234, 88, 12);
        doc.text(`Total: Rs. ${order.total_price}`, 140, order.discount > 0 ? finalY + 40 : finalY + 33);

        doc.save(`invoice_${order._id}.pdf`);
    };

    return (
        <div className="min-h-screen bg-[#eef2f2] flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900">
            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }
                @keyframes scaleUp {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scaleUp {
                    animation: scaleUp 0.4s ease-out forwards;
                }
                .success-check {
                    animation: bounce 0.8s cubic-bezier(0.36, 0, 0.66, -0.56) infinite alternate;
                }
                @keyframes bounce {
                    from { transform: translateY(0); }
                    to { transform: translateY(-10px); }
                }
            `}</style>
            <Navbar />
            <SubNavbar />

            <main className="flex-grow flex items-center justify-center p-8 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full filter blur-3xl"></div>
                </div>

                <div className="max-w-2xl w-full relative z-10 animate-scaleUp">
                    <div className="glass-card p-12 rounded-[3rem] shadow-2xl text-center space-y-8">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center space-y-4">
                                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Authenticating Order...</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-center">
                                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-lg shadow-green-500/20 success-check">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>

                                <div>
                                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Order <span className="text-green-600">Confirmed!</span></h1>
                                    <p className="text-gray-500 font-bold mt-2">Your hardware is on its way to your doorstep.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-8 border-y border-gray-100">
                                    <div className="text-left">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Order Number</p>
                                        <p className="text-lg font-black text-gray-900">{orderId || 'N/A'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Order Date</p>
                                        <p className="text-lg font-black text-gray-900">{orderDate}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50/50 rounded-3xl p-6 text-left space-y-4">
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Delivery Summary</h3>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm flex-shrink-0">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 leading-tight">
                                                {order?.address_id ? (
                                                    `${order.address_id.firstName} ${order.address_id.lastName}, ${order.address_id.line1}, ${order.address_id.city}, ${order.address_id.state} ${order.address_id.pincode}`
                                                ) : (
                                                    'Shipping details unavailable'
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-500 font-black mt-2 uppercase tracking-tighter">
                                                Payment: <span className="text-orange-600">{order?.payment_method?.toUpperCase()}</span> | Total: <span className="text-orange-600">₹{order?.total_price}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50/50 rounded-3xl p-6 text-left space-y-4">
                                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Order Items</h3>
                                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {order?.items?.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                                <div className="flex-grow">
                                                    <p className="font-bold text-gray-900 leading-tight">{item.product_name}</p>
                                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
                                                        Qty: {item.quantity} × ₹{item.price}
                                                    </p>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <p className="font-black text-gray-900">₹{Number(item.price) * item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4 border-t border-gray-200 space-y-2">
                                        <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                            <p>Subtotal</p>
                                            <p>₹{order?.subtotal || 0}</p>
                                        </div>
                                        <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                            <p>Tax (8%)</p>
                                            <p>₹{order?.tax || 0}</p>
                                        </div>
                                        <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                            <p>Shipping</p>
                                            <p>₹{order?.shipping_cost || 0}</p>
                                        </div>
                                        {order?.discount > 0 && (
                                            <div className="flex justify-between items-center text-sm font-bold text-green-500">
                                                <p>Discount</p>
                                                <p>-₹{order?.discount}</p>
                                            </div>
                                        )}
                                        <div className="pt-2 mt-2 border-t border-gray-100 flex justify-between items-center">
                                            <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Total Amount</p>
                                            <p className="text-2xl font-black text-orange-600">₹{order?.total_price}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button
                                        onClick={handleDownloadInvoice}
                                        className="py-3 px-6 bg-gray-900 text-white text-sm font-black rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mx-auto"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                        Download Invoice PDF
                                    </button>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Link
                                        to="/"
                                        className="flex-grow py-4 bg-orange-600 text-white text-sm font-black rounded-2xl hover:bg-orange-700 hover:shadow-xl transition-all tracking-widest uppercase text-center"
                                    >
                                        Back to Home
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="flex-grow py-4 bg-white text-gray-900 text-sm font-black rounded-2xl hover:bg-gray-50 border-2 border-gray-100 transition-all tracking-widest uppercase text-center"
                                    >
                                        View Order status
                                    </Link>
                                </div>

                                <p className="text-xs text-gray-400 font-bold">A confirmation email has been sent to your registered address.</p>
                            </>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default OrderConfirmationPage;
