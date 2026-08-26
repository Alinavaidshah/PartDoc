import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import {
  Truck, ShieldCheck, Star, Package, RefreshCw, Minus, Plus, Heart,
  Share2, ShoppingBag, Check, Zap, Wrench, ChevronRight, AlertCircle,
  CheckCircle2, ArrowRight
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

  // Options State
  const [selectedVariant, setSelectedVariant] = useState('OEM Grade');
  const [selectedWarranty, setSelectedWarranty] = useState('Standard (Free)');
  const [activeTab, setActiveTab] = useState('specs');

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
    return <AestheticLoader text="Loading Specifications..." />;
  }

  if (!part) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 pt-32">
        <AlertCircle size={48} className="text-indigo-600 mb-4" />
        <h2 className="text-2xl font-bold font-grotesk">Part Not Found</h2>
        <p className="text-slate-500 text-sm mt-1 mb-6">The requested item could not be found.</p>
        <Link to="/computerparts" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl text-xs uppercase">
          Back To Catalog
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
    { id: 'OEM Grade', label: 'OEM Grade Original' },
    { id: 'Tested A+', label: 'Pre-Tested Grade A+' },
    { id: 'Sealed New', label: 'Factory Sealed Box' }
  ];

  const WARRANTY_OPTIONS = [
    { id: 'Standard (Free)', label: 'Standard Warranty (Included)' },
    { id: '1-Year Extended (+PKR 2,500)', label: '1-Year Comprehensive (+PKR 2,500)' },
    { id: '2-Year Priority (+PKR 4,800)', label: '2-Year Priority (+PKR 4,800)' }
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pt-28 pb-20 px-4 sm:px-8">
      
      <Toast message={`${part.name} added to cart!`} isOpen={showToast} onClose={() => setShowToast(false)} />

      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <ChevronRight size={14} className="text-slate-400" />
          <Link to="/computerparts" className="hover:text-indigo-600 transition-colors">{part.category || 'Catalog'}</Link>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="text-indigo-600 font-bold truncate max-w-[200px] sm:max-w-none">{part.name}</span>
        </div>

        {/* HERO PRODUCT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-14">

          {/* LEFT: IMAGE */}
          <div className="lg:col-span-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm relative group overflow-hidden">
              
              <div className="flex items-center justify-between mb-6">
                <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  inStock
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {inStock ? `● In Stock (${part.countInStock} Units)` : 'Out of Stock'}
                </span>

                <button
                  onClick={() => setLiked(!liked)}
                  className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
                >
                  <Heart size={18} className={liked ? 'fill-indigo-600 text-indigo-600' : 'text-slate-400'} />
                </button>
              </div>

              <img
                src={getImageUrl(part.image)}
                alt={part.name}
                className="w-full h-80 sm:h-96 object-contain group-hover:scale-105 transition-transform duration-300"
                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1591405351990-4726e331f141?w=600&q=80'}
              />

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-mono">
                <span>SKU: #{part._id?.slice(-8).toUpperCase()}</span>
                <span className="text-emerald-600 font-bold">100% Genuine Serial Verified</span>
              </div>
            </div>
          </div>

          {/* RIGHT: DETAILS */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 block">
                {part.category || 'Spare Part'}
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 font-grotesk leading-tight mb-3">
                {part.name}
              </h1>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className="fill-amber-400" />)}
                </div>
                <span className="text-xs font-bold text-slate-700">4.9</span>
                <span className="text-xs text-slate-400">(128 Verified Buyer Reviews)</span>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {part.description || "Authentic high-performance spare component with official serial verification."}
              </p>

              {/* VARIANT OPTIONS */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Grade Option</label>
                <div className="grid grid-cols-3 gap-2">
                  {VARIANTS.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.id)}
                      className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                        selectedVariant === v.id
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* WARRANTY OPTIONS */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Warranty Plan</label>
                <div className="space-y-2">
                  {WARRANTY_OPTIONS.map(w => (
                    <button
                      key={w.id}
                      onClick={() => setSelectedWarranty(w.id)}
                      className={`w-full p-3 rounded-xl border text-xs font-bold text-left flex justify-between transition-all ${
                        selectedWarranty === w.id
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{w.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* DYNAMIC PRICE & QTY */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl mb-6 flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-xs text-slate-400 font-semibold">Total Price</div>
                  <div className="font-grotesk text-3xl font-extrabold text-slate-900 mt-0.5">
                    PKR {totalPrice.toLocaleString()}
                  </div>
                </div>

                {inStock && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-bold">Qty:</span>
                    <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
                      <button
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-indigo-600"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm text-slate-900">{qty}</span>
                      <button
                        onClick={() => setQty(q => Math.min(part.countInStock || 10, q + 1))}
                        className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-indigo-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA BUTTONS */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`flex-1 py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    inStock
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                      : "bg-slate-300 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {added ? <Check size={18} /> : <ShoppingBag size={18} />}
                  <span>{added ? "Added To Cart" : "Add To Cart"}</span>
                </button>

                <Link
                  to="/checkout"
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl text-center shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Checkout Now</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

            </div>
          </div>

        </div>

        {/* TABBED DETAILS */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex border-b border-slate-200 gap-6 mb-6">
            {[
              { id: 'specs', label: 'Technical Specifications' },
              { id: 'reviews', label: 'Customer Reviews (128)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500">Manufacturer Brand:</span>
                <span className="font-bold text-slate-900">{part.brand || 'Official'}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-bold text-slate-900">{part.category || 'Hardware'}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500">Condition:</span>
                <span className="font-bold text-emerald-600">100% Brand New</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500">Selected Warranty:</span>
                <span className="font-bold text-slate-900">{selectedWarranty}</span>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Ali Ahmed", text: "Original product, working perfectly." },
                { name: "Sara Khan", text: "Fast delivery and genuine quality." },
                { name: "Bilal Raza", text: "Best price for OEM parts." }
              ].map((r, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex text-amber-400 mb-2">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} className="fill-amber-400" />)}
                  </div>
                  <p className="text-slate-700 text-xs mb-2">"{r.text}"</p>
                  <p className="font-bold text-[10px] text-slate-400 uppercase">{r.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}