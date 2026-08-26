import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import {
  Truck, ShieldCheck, Star, Package, RefreshCw, Minus, Plus, Heart,
  Share2, ShoppingBag, Check, Zap, Wrench, ChevronRight, AlertCircle,
  CheckCircle2, ArrowRight, MessageSquarePlus, User, CornerDownRight
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
  const [toastMsg, setToastMsg] = useState("");
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  // User Specified Options
  const [selectedGrade, setSelectedGrade] = useState('Refurbished (Grade A)');
  const [selectedColor, setSelectedColor] = useState('Space Black');
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' | 'specs'

  // Live Review Form State
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/parts/${id}`);
      const data = response.data;
      setPart(data);
      if (data.colors && data.colors.length > 0) {
        setSelectedColor(data.colors[0]);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) return;

    setSubmittingReview(true);
    try {
      const res = await api.post(`/parts/${id}/reviews`, reviewForm);
      setToastMsg("Review submitted successfully!");
      setShowToast(true);
      setReviewForm({ name: '', rating: 5, comment: '' });

      // Refresh product data live from backend DB
      const updated = await api.get(`/parts/${id}`);
      setPart(updated.data);
    } catch (err) {
      alert("Error submitting review: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmittingReview(false);
    }
  };

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
  const refurbPrice = part.refurbishedPrice ? Number(part.refurbishedPrice) : basePrice;
  const brandNewPrice = part.brandNewPrice ? Number(part.brandNewPrice) : (basePrice + 5000);

  const isBrandNew = selectedGrade.includes('Brand New');
  const unitPrice = part.hasGrades !== false ? (isBrandNew ? brandNewPrice : refurbPrice) : basePrice;
  const totalPrice = unitPrice * qty;
  const inStock = (part.countInStock || 0) > 0;

  const defaultColors = part.colors && part.colors.length > 0 ? part.colors : [];

  const handleAddToCart = () => {
    dispatch(addToCart({
      ...part,
      price: unitPrice,
      selectedGrade: part.hasGrades !== false ? selectedGrade : 'Standard',
      selectedColor: part.hasColors && defaultColors.length > 0 ? selectedColor : 'Default',
      warrantyOption: isBrandNew ? 'Company Official Manufacturer Warranty' : 'Standard 1 Year Warranty',
      qty
    }));
    setToastMsg(`${part.name} added to cart!`);
    setShowToast(true);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const reviewsList = part.reviews || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pt-28 pb-20 px-4 sm:px-8">
      
      <Toast message={toastMsg} isOpen={showToast} onClose={() => setShowToast(false)} />

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
                <span className="text-emerald-600 font-bold">100% Verified Serial</span>
              </div>
            </div>
          </div>

          {/* RIGHT: DETAILS & DYNAMIC OPTIONS */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 block">
                {part.category || 'Spare Part'}
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 font-grotesk leading-tight mb-3">
                {part.name}
              </h1>

              {/* Rating Summary */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={16} className={i <= Math.round(part.rating || 5) ? "fill-amber-400" : "text-slate-300"} />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">{(part.rating || 5).toFixed(1)}</span>
                <span className="text-xs text-slate-400">({part.numReviews || reviewsList.length} Live Reviews)</span>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {part.description || "Authentic high-performance spare component with official serial verification."}
              </p>

              {/* 1. GRADE OPTIONS */}
              {part.hasGrades !== false && (
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Select Condition & Warranty Grade
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* Option A: Refurbished Grade A (Default) */}
                    <button
                      onClick={() => setSelectedGrade('Refurbished (Grade A)')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        selectedGrade === 'Refurbished (Grade A)'
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-extrabold flex items-center justify-between">
                        <span>Refurbished (Grade A)</span>
                        {selectedGrade === 'Refurbished (Grade A)' && <CheckCircle2 size={14} className="text-indigo-600" />}
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-900 mt-1">
                        PKR {refurbPrice.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">1 Year Standard Warranty</div>
                    </button>

                    {/* Option B: Brand New (Official Warranty) */}
                    <button
                      onClick={() => setSelectedGrade('Brand New (Official Warranty)')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        selectedGrade === 'Brand New (Official Warranty)'
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-extrabold flex items-center justify-between">
                        <span>Brand New (Sealed)</span>
                        {selectedGrade.includes('Brand New') && <CheckCircle2 size={14} className="text-indigo-600" />}
                      </div>
                      <div className="text-xs font-mono font-bold text-indigo-600 mt-1">
                        PKR {brandNewPrice.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Official Company Warranty</div>
                    </button>

                  </div>
                </div>
              )}

              {/* 2. COLOR OPTIONS */}
              {part.hasColors && defaultColors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Select Color Variant
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {defaultColors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                          selectedColor === color
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* DYNAMIC PRICE & QTY */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl mb-6 flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-xs text-slate-400 font-semibold">Total Price ({qty} unit{qty > 1 ? 's' : ''})</div>
                  <div className="font-grotesk text-3xl font-extrabold text-slate-900 mt-0.5">
                    PKR {totalPrice.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                    ✓ {isBrandNew ? 'Official Company Warranty Included' : '1 Year Standard Warranty Included'}
                  </div>
                </div>

                {/* Quantity Controls */}
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

        {/* LIVE REVIEWS & SUBMISSION SECTION */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-12">
          
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
            <div>
              <h2 className="font-grotesk font-extrabold text-slate-900 text-xl flex items-center gap-2">
                <MessageSquarePlus className="text-indigo-600" size={20} />
                Customer Reviews & Ratings ({reviewsList.length})
              </h2>
              <p className="text-xs text-slate-500 mt-1">Live customer feedback submitted directly from buyers.</p>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-extrabold text-sm bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
              <Star size={16} className="fill-amber-400" />
              <span>{(part.rating || 5).toFixed(1)} / 5.0</span>
            </div>
          </div>

          {/* SUBMIT REVIEW FORM FOR THIS PRODUCT */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl mb-8">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-3">
              Write A Review For {part.name}
            </h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rating (1 to 5 Stars)</label>
                  <div className="flex gap-2 items-center pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star size={22} className={star <= reviewForm.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">{reviewForm.rating} Stars</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Review Comment *</label>
                <textarea
                  required
                  rows="3"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share details about performance, packaging, or compatibility..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>

          {/* LIVE REVIEWS DISPLAY GRID */}
          {reviewsList.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No reviews submitted yet for this product. Be the first to write a review above!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviewsList.map((rev, i) => (
                <div key={rev._id || i} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                        <User size={14} className="text-indigo-600" />
                        {rev.name}
                      </div>
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={12} className={s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-700 text-xs leading-relaxed">"{rev.comment}"</p>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-200">
                    Verified Customer · {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Just now'}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}