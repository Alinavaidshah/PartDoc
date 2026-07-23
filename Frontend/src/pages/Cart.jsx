import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { removeFromCart, updateQuantity } from '../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';

export default function Cart() {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Pro Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-[#101e23] pt-32 pb-20 px-4 md:px-8 text-white">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-4xl font-black mb-10"
        >
          Your Shopping Cart
        </motion.h1>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <h2 className="text-2xl text-gray-400">Cart khali hai bhai!</h2>
            <button onClick={() => navigate('/computerparts')} className="mt-6 px-8 py-3 bg-[#D8973C] rounded-xl font-bold hover:bg-[#c28532] transition-colors">
              Shopping Shuru Karo
            </button>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-10"
          >
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div 
                    key={item._id}
                    variants={itemVariants}
                    layout
                    exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                    className="bg-[#1a2d33] p-6 rounded-2xl flex items-center justify-between border border-white/5 hover:border-[#D8973C]/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                      <div>
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-[#D8973C] font-semibold">PKR {item.price}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <input 
                        type="number" min="1" value={item.quantity}
                        onChange={(e) => dispatch(updateQuantity({ id: item._id, qty: parseInt(e.target.value) || 1 }))}
                        className="w-16 bg-[#101e23] border border-white/10 p-2 rounded-lg text-center focus:border-[#D8973C] outline-none transition-all"
                      />
                      <button onClick={() => dispatch(removeFromCart(item._id))} className="text-red-400 hover:text-red-600 transition-colors font-medium">
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary Box */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#1a2d33] p-8 rounded-3xl h-fit border border-white/5 sticky top-32 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400"><span>Subtotal</span> <span>PKR {subtotal}</span></div>
                <div className="flex justify-between text-gray-400"><span>Shipping</span> <span className="text-green-500 font-bold">Free</span></div>
                <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold"><span>Total</span> <span>PKR {subtotal}</span></div>
              </div>

              <SignedIn>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 bg-[#D8973C] hover:bg-[#c28532] transition-all hover:scale-[1.02] rounded-xl font-black text-lg shadow-[0_0_15px_rgba(216,151,60,0.3)]"
                >
                  Proceed to Checkout
                </button>
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full py-4 bg-[#D8973C] hover:bg-[#c28532] transition-all hover:scale-[1.02] rounded-xl font-black text-lg shadow-[0_0_15px_rgba(216,151,60,0.3)]">
                    Login to Checkout
                  </button>
                </SignInButton>
              </SignedOut>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}