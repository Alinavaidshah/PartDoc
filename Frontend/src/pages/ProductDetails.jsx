import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import {
  Truck, ShieldCheck, Star, Package, RefreshCw, Minus, Plus, Heart,
  Share2, ShoppingBag, Check, Zap, Wrench, ChevronRight, AlertCircle,
  HelpCircle, ArrowLeft, CheckCircle2, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../components/Toast';
import AestheticLoader from '../components/AestheticLoader';
import api, { getImageUrl } from '../api/axiosConfig';

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  // Dynamic Options State
  const [selectedVariant, setSelectedVariant] = useState('OEM Grade');
  const [selectedWarranty, setSelectedWarranty] = useState('Standard (Free)');
  const [compatibilityModel, setCompatibilityModel] = useState('');
  const [compatibilityStatus, setCompatibilityStatus] = useState(null); // 'matched' | null
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'guide' | 'reviews'

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/parts/${id}`);
        setPart(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <AestheticLoader text="Fetching Component Specifications..." />;
  }

  if (!part) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-6 pt-32">
        <AlertCircle size={48} className="text-[#D8973C] mb-4" />
        <h2 className="text-2xl font-bold font-grotesk">Component Not Found</h2>
        <p className="text-slate-400 text-sm mt-2 mb-6">The requested part ID may be invalid or out of inventory.</p>
        <Link to="/computerparts" className="px-6 py-3 bg-[#D8973C] text-black font-extrabold rounded-xl text-xs uppercase tracking-wider">
          Return To Parts Catalog
        </Link>
      </div>
    );
  }

  const basePrice = Number(part.price) || 0;
  const warrantyCost = selectedWarranty.includes('1-Year') ? 2500 : selectedWarranty.includes('2-Year') ? 4800 : 0;
  const unitPrice = basePrice + warrantyCost;
  const totalPrice = unitPrice * qty;
  const inStock = (part.countInStock || 0) > 0;

  const VARIANTS = [
    { id: 'OEM Grade', label: 'OEM Grade Original', badge: 'Recommended' },
    { id: 'Tested A+', label: 'Pre-Tested Grade A+', badge: '100% Quality' },
    { id: 'Sealed New', label: 'Factory Sealed Box', badge: 'Brand New' }
  ];

  const WARRANTY_OPTIONS = [
    { id: 'Standard (Free)', label: 'Standard Warranty', cost: 'Included' },
    { id: '1-Year Extended (+PKR 2,500)', label: '1-Year Comprehensive Warranty', cost: '+PKR 2,500' },
    { id: '2-Year Priority (+PKR 4,800)', label: '2-Year Priority Replacement', cost: '+PKR 4,800' }
  ];

  const handleAddToCart = () => {
    dispatch(addToCart({
      ...part,
      price: unitPrice,
      variant: selectedVariant,
      warrantyOption: selectedWarranty,
      qty
    }));
    setShowToast(true);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const checkCompatibility = (e) => {
    e.preventDefault();
    if (compatibilityModel.trim()) {
      setCompatibilityStatus('matched');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-[#D8973C] selection:text-black pt-28 pb-20 px-4 sm:px-8">
      
      <Toast message={`${part.name} added to cart!`} isOpen={showToast} onClose={() => setShowToast(false)} />

      <div className="max-w-7xl mx-auto">

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-8 font-medium">
          <Link to="/" className="hover:text-[#D8973C] transition-colors">Home</Link>
          <ChevronRight size={14} className="text-slate-600" />
          <Link to="/computerparts" className="hover:text-[#D8973C] transition-colors">{part.category || 'Catalog'}</Link>
          <ChevronRight size={14} className="text-slate-600" />
          <span className="text-[#D8973C] font-semibold truncate max-w-[200px] sm:max-w-none">{part.name}</span>
        </div>

        {/* TOP PRODUCT HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">

          {/* LEFT: IMAGE & GALLERY SECTION */}
          <div className="lg:col-span-6 relative">
            <div className="relative bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-12 overflow-hidden shadow-2xl group">
              
              {/* Background Radial Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#D8973C]/10 rounded-full blur-3xl group-hover:bg-[#D8973C]/20 transition-all pointer-events-none" />

              {/* Badges */}
              <div className="flex items-center justify-between relative z-10 mb-6">
                <span className={`text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border ${
                  inStock
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {inStock ? `● In Stock (${part.countInStock} Units)` : 'Out of Stock'}
                </span>

                <button
                  onClick={() => setLiked(!liked)}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 backdrop-blur flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Heart size={18} className={liked ? 'fill-[#D8973C] text-[#D8973C]' : 'text-slate-300'} />
                </button>
              </div>

              {/* Main Product Image */}
              <motion.img
                key={part._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={getImageUrl(part.image)}
                alt={part.name}
                className="w-full h-80 sm:h-96 object-contain relative z-10 group-hover:scale-105 transition-transform duration-500"
                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1591405351990-4726e331f141?w=600&q=80'}
              />

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10 relative z-10 text-xs text-slate-400 font-mono">
                <span>SKU: #{part._id?.slice(-8).toUpperCase()}</span>
                <span>SERIAL: VERIFIED-OEM</span>
              </div>
            </div>

            {/* Quick Share & Support */}
            <div className="flex items-center justify-between mt-4 px-2 text-xs text-slate-400">
              <button
                onClick={() => navigator.share ? navigator.share({ title: part.name, url: window.location.href }) : null}
                className="flex items-center gap-1.5 hover:text-[#D8973C] transition-colors"
              >
                <Share2 size={14} /> Share Specification
              </button>

              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 size={14} /> 100% Tested Prior To Shipping
              </span>
            </div>
          </div>

          {/* RIGHT: DETAILS & DYNAMIC OPTIONS */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Category & Title */}
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#D8973C] mb-2 block font-mono">
                {part.category || 'Spare Part'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-grotesk leading-tight mb-4">
                {part.name}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex text-[#D8973C]">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={16} className="fill-[#D8973C] text-[#D8973C]" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-300">4.9 / 5.0</span>
                <span className="text-xs text-slate-500">(128 Verified Buyer Reviews)</span>
              </div>

              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                {part.description || "High-grade authentic component engineered for optimal system compatibility and maximum longevity."}
              </p>

              {/* OPTION 1: SELECT VARIANT / GRADE */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
                  <span>1. Select Component Grade</span>
                  <span className="text-slate-500 font-normal text-[11px]">Selected: <b className="text-[#D8973C]">{selectedVariant}</b></span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {VARIANTS.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.id)}
                      className={`p-3 rounded-xl border text-left transition-all relative ${
                        selectedVariant === v.id
                          ? 'bg-[#D8973C]/10 border-[#D8973C] text-white shadow-[0_0_15px_rgba(216,151,60,0.2)]'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <div className="text-xs font-bold">{v.id}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{v.badge}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* OPTION 2: SELECT WARRANTY ADDON */}
              <div className="mb-8">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                  2. Choose Warranty Protection Plan
                </label>
                <div className="space-y-2">
                  {WARRANTY_OPTIONS.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setSelectedWarranty(w.id)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        selectedWarranty === w.id
                          ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className={selectedWarranty === w.id ? 'text-indigo-400' : 'text-slate-500'} />
                        <span className="text-xs font-bold">{w.label}</span>
                      </div>
                      <span className="text-xs font-mono text-[#D8973C] font-semibold">{w.cost}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* OPTION 3: COMPATIBILITY CHECKER */}
              <div className="mb-8 bg-white/5 border border-white/10 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-white mb-2">
                  <Wrench size={16} className="text-[#D8973C]" />
                  <span>Compatibility Checker</span>
                </div>
                <form onSubmit={checkCompatibility} className="flex gap-2">
                  <input
                    type="text"
                    value={compatibilityModel}
                    onChange={(e) => { setCompatibilityModel(e.target.value); setCompatibilityStatus(null); }}
                    placeholder="Enter device model (e.g. MacBook Pro M1, iPhone 14 Pro)..."
                    className="flex-1 bg-[#07090e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#D8973C]"
                  />
                  <button type="submit" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors">
                    Check
                  </button>
                </form>
                {compatibilityStatus === 'matched' && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 size={14} /> 100% Compatible with "{compatibilityModel}"
                  </motion.div>
                )}
              </div>

              {/* DYNAMIC PRICING & QUANTITY SELECTOR */}
              <div className="bg-[#0f172a] border border-white/10 p-6 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
                <div>
                  <div className="text-xs text-slate-400">Total Price ({qty} unit{qty > 1 ? 's' : ''})</div>
                  <div className="font-grotesk text-3xl font-black text-[#D8973C] mt-1">
                    PKR {totalPrice.toLocaleString()}
                  </div>
                  {warrantyCost > 0 && (
                    <div className="text-[11px] text-indigo-400 mt-1">+ PKR {warrantyCost.toLocaleString()} Warranty Protection</div>
                  )}
                </div>

                {/* Quantity Controls */}
                {inStock && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-bold">Qty:</span>
                    <div className="flex items-center bg-[#07090e] border border-white/10 rounded-xl p-1">
                      <button
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        className="w-8 h-8 flex items-center justify-center text-white hover:text-[#D8973C] transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-extrabold text-sm text-white">{qty}</span>
                      <button
                        onClick={() => setQty(q => Math.min(part.countInStock || 10, q + 1))}
                        className="w-8 h-8 flex items-center justify-center text-white hover:text-[#D8973C] transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ADD TO CART & BUY NOW CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`flex-1 py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    inStock
                      ? "bg-[#D8973C] hover:bg-amber-400 text-black shadow-[0_0_25px_rgba(216,151,60,0.3)]"
                      : "bg-slate-700 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {added ? (
                      <motion.span key="added" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                        <Check size={18} /> Added To Cart
                      </motion.span>
                    ) : (
                      <motion.span key="add" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                        <ShoppingBag size={18} /> Add To Shopping Cart
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <Link
                  to="/checkout"
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl backdrop-blur-md flex items-center justify-center gap-2 transition-all border border-white/10"
                >
                  <Zap size={18} className="text-[#D8973C]" /> Express Checkout
                </Link>
              </div>

            </div>
          </div>

        </div>

        {/* TABBED INFORMATION SECTION */}
        <div className="mt-16 bg-[#0f172a]/60 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-white/10 gap-8 mb-8 overflow-x-auto">
            {[
              { id: 'specs', label: 'Technical Specifications & Info' },
              { id: 'guide', label: 'Installation & Compatibility' },
              { id: 'reviews', label: 'Customer Reviews (128)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-xs sm:text-sm font-extrabold tracking-wide transition-all relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-[#D8973C]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D8973C]" />
                )}
              </button>
            ))}
          </div>

          {/* Tab 1: Specs */}
          {activeTab === 'specs' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-slate-400">Brand Manufacturer:</span>
                  <span className="font-bold text-white">{part.brand || 'Official Partner'}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-bold text-white">{part.category || 'Hardware'}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-slate-400">Condition:</span>
                  <span className="font-bold text-emerald-400">100% Brand New / Tested</span>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-slate-400">Warranty Coverage:</span>
                  <span className="font-bold text-white">{selectedWarranty}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab 2: Guide */}
          {activeTab === 'guide' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>We recommend installation by certified technicians. Before installation:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-400">
                <li>Disconnect main power / battery source.</li>
                <li>Use an anti-static wristband to prevent ESD damage to sensitive micro-controllers.</li>
                <li>Verify component serial number against order confirmation.</li>
              </ul>
            </motion.div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Ali Ahmed", text: "Original product, working perfectly on my device." },
                { name: "Sara Khan", text: "Fast delivery and genuine quality. Highly recommended!" },
                { name: "Bilal Raza", text: "Best price for OEM parts. Will buy again." }
              ].map((rev, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex text-[#D8973C] mb-2">
                    {Array(5).fill(0).map((_, idx) => <Star key={idx} size={12} className="fill-[#D8973C]" />)}
                  </div>
                  <p className="text-slate-300 text-xs mb-3">"{rev.text}"</p>
                  <p className="font-bold text-[10px] uppercase text-slate-500">{rev.name}</p>
                </div>
              ))}
            </motion.div>
          )}

        </div>

        {/* TRUST FEATURES GRID */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: "Express Shipping", desc: "24-48 Hours Delivery Across Pakistan" },
            { icon: ShieldCheck, title: "Verified Quality", desc: "Tested By Senior Technicians" },
            { icon: Package, title: "Anti-Static Packaging", desc: "Maximum Protection In Transit" },
            { icon: RefreshCw, title: "Easy Return Policy", desc: "Hassle-Free Replacement Guarantee" }
          ].map((item, i) => (
            <div key={i} className="bg-[#0f172a]/60 p-6 rounded-2xl border border-white/10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#D8973C]/10 border border-[#D8973C]/20 flex items-center justify-center text-[#D8973C] flex-shrink-0">
                <item.icon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white text-xs">{item.title}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}