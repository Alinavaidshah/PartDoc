import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, Package, User, MapPin, Building2, Landmark } from 'lucide-react';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData } = location.state || {};

  if (!orderData) return null;

  // Animation variants for smooth flow
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15 } // Details ek ke baad ek aayengi
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  const statusInfo = orderData.paymentMethod === 'COD' 
    ? { text: 'Unpaid (Pay on Delivery)', color: 'text-red-400' }
    : { text: 'Pending Verification', color: 'text-yellow-400' };

  return (
    <div className="min-h-screen bg-[#101e23] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="bg-[#1a2d33] p-8 rounded-3xl border border-white/5 shadow-2xl w-full max-w-sm text-center"
      >
        {/* Animated Icon */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="flex justify-center mb-6">
          <div className="bg-[#D8973C]/20 p-4 rounded-full border border-[#D8973C]/20">
            <CheckCircle className="text-[#D8973C]" size={40} />
          </div>
        </motion.div>

        <h1 className="text-2xl font-black text-white mb-2">Order Confirmed!</h1>
        <p className="text-gray-400 text-sm mb-8">Tumhara order successfully place ho gaya hai.</p>

        {/* Details Section with Staggered Animation */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-[#101e23] rounded-xl p-5 mb-8 text-sm text-left border border-white/5 space-y-3"
        >
          <motion.div variants={itemVariants} className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-gray-500">Order ID</span>
            <span className="text-white font-bold">{orderData._id.slice(-6).toUpperCase()}</span>
          </motion.div>

          <motion.div variants={itemVariants} className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-gray-500">Payment</span>
            <span className="text-white font-medium">{orderData.paymentMethod}</span>
          </motion.div>

          <motion.div variants={itemVariants} className="flex justify-between border-b border-white/10 pb-2">
            <span className="text-gray-500">Status</span>
            <span className={`font-bold ${statusInfo.color}`}>{statusInfo.text}</span>
          </motion.div>

          {/* User Details with Staggered Animation */}
          <motion.div variants={itemVariants} className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-gray-300">
              <User size={14} className="text-[#D8973C]"/> {orderData.shippingAddress.fullName}
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Landmark size={14} className="text-[#D8973C]"/> {orderData.shippingAddress.province}
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Building2 size={14} className="text-[#D8973C]"/> {orderData.shippingAddress.city}
            </div>
            <div className="flex items-start gap-2 text-gray-300">
              <MapPin size={14} className="text-[#D8973C] mt-1"/> 
              <span>{orderData.shippingAddress.address}</span>
            </div>
          </motion.div>

          {/* Total Amount */}
          <motion.div variants={itemVariants} className="border-t border-white/10 pt-3 mt-2 flex justify-between">
            <span className="text-gray-500">Total Amount</span>
            <span className="text-[#D8973C] font-black text-lg">PKR {orderData.totalPrice}</span>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <button 
            onClick={() => navigate('/')} 
            className="w-full py-4 bg-[#D8973C] hover:bg-[#c28532] text-black rounded-xl font-black transition-colors mb-3 flex items-center justify-center gap-2"
            >
            <Home size={18} /> Return to Home
            </button>
            
            <button 
            onClick={() => navigate('/orders')} 
            className="w-full py-4 bg-[#1a2d33] border border-white/10 hover:bg-[#20363d] text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
            >
            <Package size={18} /> View My Orders
            </button>
        </motion.div>
      </motion.div>
    </div>
  );
}