import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import { Truck, ShieldCheck, Star, Package, RefreshCw, Loader2, Minus, Plus, Heart, Share2, ShoppingBag, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../components/Toast';

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/parts/${id}`);
        const data = await response.json();
        setPart(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...part, qty }));
    setShowToast(true);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <Loader2 className="animate-spin text-[#D8973C]" size={40} />
      </div>
    );
  }
  if (!part) return <div className="text-white text-center mt-20">Product not found.</div>;

  const inStock = part.countInStock > 0;

  return (
    <motion.div
      initial="hidden" animate="visible" variants={containerVariants}
      className="pt-32 pb-20 px-6 min-h-screen bg-[#0a0a0f] text-white"
    >
      <Toast message={`${part.name} added to cart!`} isOpen={showToast} onClose={() => setShowToast(false)} />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* Image Section */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative bg-gradient-to-br from-[#152227] to-[#D8973C]/20 p-12 rounded-[40px] border border-white/5 shadow-2xl hover:border-[#D8973C]/30 transition-colors overflow-hidden group">
              {inStock ? (
                <span className="absolute top-5 left-5 z-10 bg-[#D8973C] text-[#0a0a0f] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                  In Stock
                </span>
              ) : (
                <span className="absolute top-5 left-5 z-10 bg-gray-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                  Sold Out
                </span>
              )}

              <button
                onClick={() => setLiked(!liked)}
                className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-black/30 backdrop-blur flex items-center justify-center hover:bg-black/50 transition-colors"
              >
                <motion.div animate={liked ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.3 }}>
                  <Heart size={18} className={liked ? 'fill-[#D8973C] text-[#D8973C]' : 'text-white'} />
                </motion.div>
              </button>

              <motion.img
                key={part.image}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                src={part.image.startsWith('http') ? part.image : `/api${part.image}`}
                alt={part.name}
                className="w-full h-[400px] object-contain transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            <div className="flex items-center justify-between mt-4 px-2">
              <button
                onClick={() => navigator.share ? navigator.share({ title: part.name, url: window.location.href }) : null}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#D8973C] transition-colors"
              >
                <Share2 size={14} /> Share this product
              </button>
              <span className="text-xs text-gray-500">SKU: {part._id?.slice(-8).toUpperCase()}</span>
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div variants={itemVariants}>
            {part.category && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D8973C] mb-2 block">
                {part.category}
              </span>
            )}
            <h1 className="text-4xl font-bold mb-4">{part.name}</h1>
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className="fill-[#D8973C] text-[#D8973C]" />)}
              <span className="text-sm text-gray-400 ml-2">(128 Reviews)</span>
            </div>

            <p className="text-gray-400 mb-8 leading-relaxed">{part.description}</p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="border-l-2 border-[#D8973C] pl-4">
                <p className="text-gray-500 text-sm">Price</p>
                <p className="text-2xl font-black text-[#D8973C]">PKR {part.price}</p>
              </div>
              <div className="border-l-2 border-[#D8973C] pl-4">
                <p className="text-gray-500 text-sm">Stock Status</p>
                <p className={`text-xl font-bold ${inStock ? 'text-white' : 'text-gray-500'}`}>
                  {inStock ? "Ready to Ship" : "Out of Stock"}
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            {inStock && (
              <div className="flex items-center gap-4 mb-8">
                <span className="text-gray-500 text-sm">Quantity</span>
                <div className="flex items-center bg-[#152227] border border-white/10 rounded-full">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-white hover:text-[#D8973C] transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-bold">{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(part.countInStock, q + 1))}
                    className="w-10 h-10 flex items-center justify-center text-white hover:text-[#D8973C] transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`relative w-full md:w-auto px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden ${
                inStock
                  ? "bg-[#D8973C] text-[#152227] hover:scale-105 hover:shadow-[0_0_20px_rgba(216,151,60,0.3)]"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2"
                  >
                    <Check size={20} /> Added to Cart
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingBag size={20} />
                    {inStock ? "Add to Cart" : "Out of Stock"}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>

        {/* Trust Section */}
        <motion.div variants={containerVariants} className="mt-24 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: <Truck />, title: "Fast Delivery", desc: "3-7 Days Delivery" },
            { icon: <ShieldCheck />, title: "Verified Quality", desc: "Tested by experts" },
            { icon: <Package />, title: "Secure Packing", desc: "Anti-static packaging" },
            { icon: <RefreshCw />, title: "Easy Returns", desc: "7 Days money back" }
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="bg-[#152227] p-6 rounded-2xl border border-white/5 hover:border-[#D8973C]/50 transition-all"
            >
              <div className="text-[#D8973C] mb-4">{item.icon}</div>
              <h3 className="font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Reviews Section */}
        <motion.div variants={containerVariants} className="mt-24">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Ali Ahmed", text: "Original product, working perfectly on my 14 Pro." },
              { name: "Sara Khan", text: "Fast delivery and genuine quality. Highly recommended!" },
              { name: "Bilal Raza", text: "Best price for OEM parts. Will buy again." }
            ].map((rev, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="bg-[#152227] p-6 rounded-2xl border border-white/5 hover:border-[#D8973C]/30 transition-colors"
              >
                <div className="flex text-[#D8973C] mb-2">
                  {Array(5).fill(0).map((_, i) => <Star key={i} size={14} className="fill-[#D8973C]" />)}
                </div>
                <p className="text-gray-300 text-sm mb-4">"{rev.text}"</p>
                <p className="font-bold text-xs uppercase text-gray-500">{rev.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}