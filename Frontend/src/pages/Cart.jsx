import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { removeFromCart, updateQuantity } from '../features/cart/cartSlice';
import { useNavigate, Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export default function Cart() {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = items.reduce((acc, item) => acc + ((item.price || 0) * item.quantity), 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 md:px-8 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Review Items</span>
          </div>
          <h1 className="font-grotesk text-3xl md:text-5xl font-extrabold text-slate-900">
            Shopping Cart ({items.length})
          </h1>
        </motion.div>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-grotesk text-2xl font-bold text-slate-900 mb-2">Your Cart is Empty</h2>
            <p className="text-slate-500 text-sm mb-6">Explore our genuine computer and mobile spare parts inventory.</p>
            <button 
              onClick={() => navigate('/computerparts')} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Explore Shop Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div 
                    key={item._id}
                    variants={itemVariants}
                    layout
                    exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
                    className="bg-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between border border-slate-200 shadow-sm hover:shadow-md transition-all gap-4"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img 
                        src={item.image || "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=600&q=80"} 
                        alt={item.name} 
                        className="w-20 h-20 rounded-xl object-cover bg-slate-100 flex-shrink-0" 
                      />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-0.5">
                          {item.category || "Part"}
                        </span>
                        <h3 className="font-extrabold text-slate-900 text-base line-clamp-1">{item.name}</h3>
                        <p className="font-grotesk font-extrabold text-indigo-600 text-sm mt-1">
                          PKR {Number(item.price || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-medium">Qty:</span>
                        <input 
                          type="number" 
                          min="1" 
                          value={item.quantity}
                          onChange={(e) => dispatch(updateQuantity({ id: item._id, qty: parseInt(e.target.value) || 1 }))}
                          className="w-16 bg-slate-50 border border-slate-200 p-2 rounded-xl text-center font-bold text-slate-900 focus:border-indigo-500 outline-none text-sm"
                        />
                      </div>

                      <button 
                        onClick={() => dispatch(removeFromCart(item._id))} 
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Trust Callout */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 flex items-center justify-around text-xs font-semibold text-indigo-800">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>100% Verified Original</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <span>Free Nationwide Delivery</span>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 sm:p-8 rounded-3xl h-fit border border-slate-200 shadow-xl sticky top-28"
            >
              <h2 className="font-grotesk font-extrabold text-slate-900 text-xl mb-6">Order Summary</h2>
              
              <div className="space-y-3.5 mb-6 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span> 
                  <span className="font-bold text-slate-900">PKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Nationwide Express Shipping</span> 
                  <span className="text-emerald-600 font-bold">Free</span>
                </div>
                <div className="border-t border-slate-200 pt-4 flex justify-between text-lg font-extrabold text-slate-900">
                  <span>Total Amount</span> 
                  <span className="text-indigo-600 font-grotesk">PKR {subtotal.toLocaleString()}</span>
                </div>
              </div>

              <SignedIn>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-base shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-base shadow-lg transition-all flex items-center justify-center gap-2">
                    <span>Login to Checkout</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </SignInButton>
              </SignedOut>

              <Link 
                to="/computerparts" 
                className="block text-center text-xs font-bold text-slate-500 hover:text-indigo-600 mt-4 transition-colors"
              >
                ← Continue Shopping
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}