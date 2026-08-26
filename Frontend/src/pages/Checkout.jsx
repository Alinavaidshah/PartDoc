import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "@clerk/clerk-react";
import { clearCart } from '../features/cart/cartSlice';
import { API_URL } from '../api/axiosConfig';
import { MapPin, Truck, Smartphone, CreditCard, Upload, Loader2, ShoppingBag, ShieldCheck, Receipt, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY);

const StripePaymentForm = ({ totalAmount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/order-confirmation',
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message);
      setIsProcessing(false);
    } else {
      setIsProcessing(false);
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-indigo-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-indigo-700">Enter Card Details</span>
        <button type="button" onClick={onCancel} className="text-xs text-slate-400 hover:text-slate-600 underline">
          Change Method
        </button>
      </div>
      <PaymentElement />
      {message && <div className="text-red-500 text-xs font-semibold">{message}</div>}
      <button
        disabled={isProcessing || !stripe || !elements}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
        <span>{isProcessing ? "Processing Payment..." : `Pay PKR ${totalAmount.toLocaleString()}`}</span>
      </button>
    </form>
  );
};

export default function Checkout() {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { getToken, isSignedIn } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [stripeIntentLoading, setStripeIntentLoading] = useState(false);

  const [shippingDetails, setShippingDetails] = useState({
    fullName: '', email: '', phone: '', province: '', city: '', address: '', houseNo: '', nearestLandmark: ''
  });

  const handleInputChange = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const subtotal = items.reduce((acc, item) => acc + ((item.price || 0) * item.quantity), 0);
  const deliveryCharges = 200;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryCharges + tax;

  const handleStripeIntent = async () => {
    if (!isSignedIn) { 
      alert("Please login first!"); 
      return; 
    }
    if (!shippingDetails.fullName || !shippingDetails.phone || !shippingDetails.address || !shippingDetails.city) {
      alert("Please fill in required shipping fields before proceeding to card payment.");
      return;
    }

    setStripeIntentLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/payments/create-payment-intent`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ amount: Math.round(total) })
      });
      const data = await res.json();
      if (res.ok && data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        alert(data.message || "Failed to initialize card payment.");
      }
    } catch (err) {
      alert("Server connection error while setting up card payment.");
    } finally {
      setStripeIntentLoading(false);
    }
  };

  const handlePlaceOrder = async (stripeSuccess = false) => {
    if (!isSignedIn) { 
      alert("Please login first to place your order!"); 
      return; 
    }

    if (!shippingDetails.fullName || !shippingDetails.phone || !shippingDetails.address || !shippingDetails.city) {
      alert("Please fill in required shipping fields (Name, Phone, City, Address).");
      return;
    }

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
      paymentMethod: stripeSuccess ? 'Card' : paymentMethod,
      totalPrice: total
    }));

    if ((paymentMethod === 'JazzCash' || paymentMethod === 'EasyPaisa') && file) {
      formDataPayload.append('receipt', file);
    }

    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/orders`, {
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
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const fieldLabels = {
    fullName: 'Full Name *',
    email: 'Email Address',
    phone: 'Phone Number *',
    province: 'Province',
    city: 'City *',
    address: 'Street Address *',
    houseNo: 'House No.',
    nearestLandmark: 'Nearest Landmark'
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 md:px-8 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-3">
            <Link to="/cart" className="hover:text-indigo-600 transition-colors">Cart</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-indigo-600 font-bold">Shipping & Payment</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Order Confirmation</span>
          </div>

          <h1 className="font-grotesk text-3xl md:text-5xl font-extrabold text-slate-900 flex items-center gap-3">
            <ShoppingBag className="text-indigo-600 w-8 h-8" /> 
            <span>Secure Checkout</span>
          </h1>
        </motion.div>

        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible" 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >

          <div className="lg:col-span-2 space-y-6">
            
            <motion.div 
              variants={itemVariants}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-grotesk font-extrabold text-slate-900 text-lg">Shipping Information</h2>
                  <p className="text-xs text-slate-500">Enter your address for express nationwide 24-48h delivery</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.keys(shippingDetails).map((field) => (
                  <div key={field} className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">
                      {fieldLabels[field]}
                    </label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      value={shippingDetails[field]}
                      onChange={handleInputChange}
                      placeholder={`Enter ${fieldLabels[field].replace('*', '').trim()}`}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-sm focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-grotesk font-extrabold text-slate-900 text-lg">Payment Method</h2>
                  <p className="text-xs text-slate-500">Choose your preferred payment option</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { id: 'COD', label: 'Cash on Delivery', icon: Truck },
                  { id: 'JazzCash', label: 'JazzCash Mobile', icon: Smartphone },
                  { id: 'EasyPaisa', label: 'EasyPaisa Mobile', icon: Smartphone },
                  { id: 'Card', label: 'Card Payment', icon: CreditCard, disabled: true }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    disabled={m.disabled}
                    onClick={() => {
                      if (m.disabled) return;
                      setPaymentMethod(m.id);
                      if (m.id !== 'Card') setClientSecret(null);
                    }}
                    className={`relative p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                      m.disabled
                        ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                        : paymentMethod === m.id
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm font-bold scale-[1.02]'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {paymentMethod === m.id && !m.disabled && (
                      <span className="absolute top-2 right-2 w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                    <m.icon className={`w-5 h-5 ${m.disabled ? 'text-slate-400' : 'text-indigo-600'}`} />
                    <span className="text-xs font-bold">{m.id}</span>
                    {m.disabled && (
                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded">
                        Disabled
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {paymentMethod === 'Card' && (
                <div className="p-6 bg-slate-50 rounded-2xl border border-indigo-200">
                  {!clientSecret ? (
                    <div className="text-center py-2">
                      <p className="text-xs text-slate-600 mb-4">Pay securely using Visa, Mastercard, or UnionPay via Stripe.</p>
                      <button
                        type="button"
                        onClick={handleStripeIntent}
                        disabled={stripeIntentLoading}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all inline-flex items-center gap-2"
                      >
                        {stripeIntentLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>{stripeIntentLoading ? "Preparing Secure Form..." : "Proceed to Card Details"}</span>
                      </button>
                    </div>
                  ) : (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <StripePaymentForm 
                        totalAmount={total} 
                        onSuccess={() => handlePlaceOrder(true)} 
                        onCancel={() => setClientSecret(null)} 
                      />
                    </Elements>
                  )}
                </div>
              )}

              <AnimatePresence>
                {(paymentMethod === 'JazzCash' || paymentMethod === 'EasyPaisa') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 bg-slate-50 rounded-2xl border border-indigo-200 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold mb-3">
                        <span>{paymentMethod} Account Transfer</span>
                      </div>
                      <p className="text-slate-600 text-xs mb-1">Account Title:</p>
                      <p className="font-grotesk font-extrabold text-slate-900 text-base mb-1">Syed Muhammad Navaid Alam</p>
                      <p className="font-grotesk font-black text-indigo-600 text-xl mb-4 tracking-wider">0302-8222449</p>

                      <label className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-indigo-300 rounded-xl cursor-pointer hover:bg-indigo-50 transition-all text-xs font-bold text-indigo-700 shadow-sm">
                        <Upload className="w-4 h-4" /> 
                        <span>{file ? file.name : "Attach Payment Proof / Screenshot"}</span>
                        <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                      </label>
                      
                      {file && (
                        <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Receipt screenshot attached successfully
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {paymentMethod === 'COD' && (
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Cash on Delivery: Pay when your order is delivered safely to your doorstep.</span>
                </div>
              )}
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl sticky top-28">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                <Receipt className="w-5 h-5 text-indigo-600" />
                <h2 className="font-grotesk font-extrabold text-slate-900 text-xl">Order Summary</h2>
              </div>

              {items.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Your cart is empty.</p>
              ) : (
                <div className="space-y-3 mb-6 max-h-[30vh] overflow-y-auto pr-1">
                  {items.map((i) => (
                    <div key={i._id} className="flex gap-3 items-center">
                      <img
                        src={i.image || "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=600&q=80"}
                        alt={i.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{i.name}</p>
                        <p className="text-[11px] text-slate-500">Qty: {i.quantity}</p>
                      </div>
                      <span className="font-grotesk font-bold text-xs text-slate-900 whitespace-nowrap">
                        PKR {((i.price || 0) * i.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-slate-100 pt-4 space-y-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">PKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Express Delivery</span>
                  <span className="font-bold text-slate-900">PKR {deliveryCharges.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST / Tax (5%)</span>
                  <span className="font-bold text-slate-900">PKR {tax.toFixed(0)}</span>
                </div>
                
                <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm">
                  <span className="font-extrabold text-slate-900">Total Payable</span>
                  <span className="font-grotesk font-black text-indigo-600 text-xl">
                    PKR {total.toFixed(0)}
                  </span>
                </div>
              </div>

              {paymentMethod !== 'Card' && (
                <button
                  onClick={() => handlePlaceOrder(false)}
                  disabled={loading || items.length === 0}
                  className={`w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold text-base shadow-lg transition-all flex items-center justify-center gap-2 ${
                    loading || items.length === 0 ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Confirm Order Now</span>
                    </>
                  )}
                </button>
              )}

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 mt-4">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit Encrypted SSL Security</span>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}