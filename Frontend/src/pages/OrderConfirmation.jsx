import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Home, Package, MapPin, User, Phone, ShieldCheck, ArrowRight } from 'lucide-react';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData, total } = location.state || {};

  if (!orderData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-28 text-center font-sans">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-sm w-full">
          <h2 className="font-grotesk text-xl font-bold text-slate-900 mb-2">No Active Order Found</h2>
          <p className="text-xs text-slate-500 mb-6">Explore our catalog to place your first order.</p>
          <Link to="/" className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl text-xs inline-block">
            Go to Home Page
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = orderData.paymentMethod === 'COD' 
    ? { text: 'Unpaid (Pay on Delivery)', color: 'text-amber-600 bg-amber-50 border-amber-200' }
    : { text: 'Pending Verification', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-28 pb-16 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md text-center relative overflow-hidden"
      >
        {/* Top Celebration Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-100/60 rounded-full blur-2xl pointer-events-none" />

        {/* Animated Checkmark Icon */}
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ type: 'spring', delay: 0.2, stiffness: 200 }} 
          className="flex justify-center mb-5 relative z-10"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 shadow-lg">
            <CheckCircle2 size={44} />
          </div>
        </motion.div>

        <h1 className="font-grotesk text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1 relative z-10">
          Order Confirmed! 🎉
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-6 relative z-10">
          Thank you for shopping with Digi Dude. Your order has been logged and is being prepared.
        </p>

        {/* Order Details Card */}
        <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-xs text-left border border-slate-200 space-y-3 shadow-inner">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
            <span className="text-slate-500 font-medium">Order ID</span>
            <span className="font-mono font-extrabold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200">
              #{orderData._id ? orderData._id.slice(-8).toUpperCase() : 'REC-992'}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
            <span className="text-slate-500 font-medium">Payment Method</span>
            <span className="font-bold text-slate-900">{orderData.paymentMethod}</span>
          </div>

          <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
            <span className="text-slate-500 font-medium">Status</span>
            <span className={`font-bold px-2 py-0.5 rounded-md border text-[11px] ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>

          {/* Customer Address Details */}
          {orderData.shippingAddress && (
            <div className="pt-2 space-y-2 text-slate-700">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <User size={14} className="text-indigo-600" />
                <span>{orderData.shippingAddress.fullName}</span>
              </div>

              {orderData.shippingAddress.phone && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone size={14} className="text-indigo-600" />
                  <span>{orderData.shippingAddress.phone}</span>
                </div>
              )}

              <div className="flex items-start gap-2 text-slate-600">
                <MapPin size={14} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                <span>
                  {orderData.shippingAddress.address}, {orderData.shippingAddress.city}, {orderData.shippingAddress.province}
                </span>
              </div>
            </div>
          )}

          {/* Total Amount */}
          <div className="border-t border-slate-200 pt-3 mt-2 flex justify-between items-center">
            <span className="text-slate-600 font-bold">Total Paid</span>
            <span className="font-grotesk text-lg font-black text-indigo-600">
              PKR {Number(orderData.totalPrice || total || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button 
            onClick={() => navigate('/')} 
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Home size={16} /> Return to Home
          </button>
          
          <button 
            onClick={() => navigate('/computerparts')} 
            className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <Package size={16} /> Continue Shopping
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mt-6">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tracking updates sent via SMS & WhatsApp</span>
        </div>
      </motion.div>
    </div>
  );
}