import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "@clerk/clerk-react";
import { clearCart } from '../features/cart/cartSlice';
import { MapPin, Truck, Smartphone, CreditCard, Upload, Loader2, ShoppingBag, ShieldCheck, Receipt, CheckCircle2 } from 'lucide-react';

export default function Checkout() {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { getToken, isSignedIn } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [shippingDetails, setShippingDetails] = useState({
    fullName: '', email: '', phone: '', province: '', city: '', address: '', houseNo: '', nearestLandmark: ''
  });

  const handleInputChange = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  // ---- Same calculation logic, just broken out for display ----
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryCharges = 200;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryCharges + tax;

  const handlePlaceOrder = async () => {
    if (!isSignedIn) { alert("Please login first!"); return; }
    setLoading(true);

    const formattedOrderItems = items.map(item => ({
      part: item._id,
      qty: item.quantity,
      name: item.name,
      price: item.price,
      image: item.image || ""
    }));

    const formDataPayload = new FormData();
    formDataPayload.append('data', JSON.stringify({
      shippingAddress: shippingDetails,
      orderItems: formattedOrderItems,
      paymentMethod: paymentMethod,
      totalPrice: total
    }));

    if ((paymentMethod === 'JazzCash' || paymentMethod === 'EasyPaisa') && file) {
      formDataPayload.append('receipt', file);
    }

    try {
      const token = await getToken();
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        body: formDataPayload,
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await res.json();
      if (res.ok) {
        dispatch(clearCart());
        navigate('/order-confirmation', { state: { orderData: result, total } });
      } else {
        alert(result.message || "Failed to place order.");
      }
    } catch (err) {
      alert("Server connection error.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const fieldLabels = {
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone Number',
    province: 'Province',
    city: 'City',
    address: 'Street Address',
    houseNo: 'House No.',
    nearestLandmark: 'Nearest Landmark'
  };

  return (
    <motion.div
      initial="hidden" animate="visible" variants={containerVariants}
      className="min-h-screen bg-[#0a0a0f] pt-28 pb-20 px-4 text-gray-300 font-sans tracking-wide"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <ShoppingBag className="text-[#D8973C]" size={28} /> Checkout
        </h1>
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
          <span className="text-[#D8973C] font-semibold">Cart</span>
          <div className="w-8 h-px bg-[#D8973C]" />
          <span className="text-white font-semibold">Shipping & Payment</span>
          <div className="w-8 h-px bg-white/10" />
          <span>Confirmation</span>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            variants={itemVariants}
            whileHover={{ borderColor: 'rgba(216,151,60,0.3)' }}
            className="bg-[#152227] p-6 rounded-2xl border border-white/5 shadow-xl transition-colors"
          >
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-white">
              <MapPin className="text-[#D8973C]" size={20} /> Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
              {Object.keys(shippingDetails).map((field) => (
                <div key={field} className="relative">
                  <input
                    name={field}
                    placeholder=" "
                    value={shippingDetails[field]}
                    onChange={handleInputChange}
                    className="peer w-full bg-[#0a0a0f] border border-white/10 rounded-lg p-3 pt-4 text-white focus:border-[#D8973C] outline-none transition-all focus:ring-2 focus:ring-[#D8973C]/20"
                  />
                  <label className="absolute left-3 top-3.5 text-gray-500 text-sm transition-all pointer-events-none peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-[#D8973C] peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-gray-500">
                    {fieldLabels[field]}
                  </label>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ borderColor: 'rgba(216,151,60,0.3)' }}
            className="bg-[#152227] p-6 rounded-2xl border border-white/5 shadow-xl transition-colors"
          >
            <h2 className="text-lg font-semibold mb-5 text-white">Payment Method</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-6">
              {[
                { id: 'COD', icon: Truck },
                { id: 'JazzCash', icon: Smartphone },
                { id: 'EasyPaisa', type: 'image' },
                { id: 'Card', icon: CreditCard }
              ].map((m) => (
                <motion.button
                  key={m.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`relative p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                    paymentMethod === m.id
                      ? 'bg-[#D8973C]/20 border-[#D8973C] text-[#D8973C] scale-105'
                      : 'bg-[#0a0a0f] border-white/5 text-gray-400 hover:border-white/20'
                  }`}
                >
                  {paymentMethod === m.id && (
                    <motion.div
                      layoutId="paymentCheck"
                      className="absolute -top-2 -right-2 w-5 h-5 bg-[#D8973C] rounded-full flex items-center justify-center"
                    >
                      <CheckCircle2 size={14} className="text-[#0a0a0f]" />
                    </motion.div>
                  )}
                  {m.type === 'image' ? (
                    <img src="/easypaisa.png" alt="EP" className="w-6 h-6 rounded-full" />
                  ) : (
                    <m.icon size={22} />
                  )}
                  <span className="font-medium">{m.id}</span>
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {(paymentMethod === 'JazzCash' || paymentMethod === 'EasyPaisa') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 bg-[#0a0a0f] rounded-xl border border-[#D8973C]/20 text-center">
                    <p className="text-[#D8973C] font-bold mb-2">Transfer to Account</p>
                    <p className="text-white">Syed Muhammad Navaid Alam</p>
                    <p className="text-xl font-bold text-gray-300">0302-8222449</p>
                    <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#152227] border border-white/10 rounded-lg cursor-pointer hover:border-[#D8973C] transition-all text-sm">
                      <Upload size={16} /> {file ? file.name : "Attach Payment Screenshot"}
                      <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                    </label>
                    {file && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-green-400 mt-2 flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 size={12} /> Screenshot attached
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {paymentMethod === 'COD' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-xs text-gray-500 bg-[#0a0a0f] p-3 rounded-lg border border-white/5"
              >
                <ShieldCheck size={14} className="text-[#D8973C]" /> Pay in cash when your order arrives at your doorstep.
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Right Column — Order Summary */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="bg-[#152227] p-6 rounded-2xl border border-white/5 shadow-xl h-fit sticky top-28">
            <h2 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              <Receipt className="text-[#D8973C]" size={20} /> Order Summary
            </h2>

            {items.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">Your cart is empty.</p>
            ) : (
              <div className="space-y-4 mb-6 max-h-[30vh] overflow-y-auto text-sm pr-2 custom-scrollbar">
                {items.map(i => (
                  <motion.div
                    key={i._id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3 items-center group"
                  >
                    <img
                      src={i.image}
                      alt={i.name}
                      className="w-12 h-12 rounded-md object-cover border border-white/10 transition-transform group-hover:scale-105 bg-[#0a0a0f]"
                    />
                    <div className="flex-1">
                      <p className="text-white leading-tight">{i.name}</p>
                      <p className="text-xs text-gray-500">Qty: {i.quantity}</p>
                    </div>
                    <span className="text-gray-300">Rs {(i.price * i.quantity).toFixed(0)}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Price Breakdown */}
            <div className="border-t border-white/10 pt-5 space-y-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-gray-300">Rs {subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span className="flex items-center gap-1.5"><Truck size={14} /> Delivery Charges</span>
                <span className="text-gray-300">Rs {deliveryCharges.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax (5% VAT)</span>
                <span className="text-gray-300">Rs {tax.toFixed(0)}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                <span className="text-white font-semibold">Total</span>
                <motion.span
                  key={total}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-[#D8973C] font-bold text-xl"
                >
                  Rs {total.toFixed(0)}
                </motion.span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handlePlaceOrder}
              disabled={loading || items.length === 0}
              className={`w-full mt-6 py-3.5 bg-[#D8973C] hover:bg-[#c28532] text-black rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                loading || items.length === 0 ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-[0_0_20px_rgba(216,151,60,0.3)]'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Placing Order...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} /> Confirm Order
                </>
              )}
            </motion.button>

            <p className="text-[10px] text-gray-600 text-center mt-3">
              By confirming, you agree to our Terms & Return Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}