import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchParts } from "../features/parts/partsSlice";
import { addToCart } from "../features/cart/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import AestheticLoader from "../components/AestheticLoader";
import Toast from "../components/Toast";
import { getImageUrl } from "../api/axiosConfig";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Truck,
  Headphones,
  Award,
  Star,
  Wrench,
  Monitor,
  Laptop,
  Smartphone,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ShoppingBag,
  Plus,
  X,
  MessageSquarePlus,
  Check
} from "lucide-react";

// Initial Customer Reviews Data
const INITIAL_REVIEWS = [
  {
    id: 1,
    name: "Hamza Iqbal",
    location: "Lahore",
    role: "Custom PC Builder",
    text: "Ordered an RTX 4080 Super. The packaging was top-notch and delivery took under 36 hours. 100% genuine part!",
    rating: 5,
    avatar: "HI"
  },
  {
    id: 2,
    name: "Sana Malik",
    location: "Karachi",
    role: "Freelance Editor",
    text: "My MacBook battery had swollen completely. Ordered an OEM replacement screen & battery. Installed smoothly, performance is like new!",
    rating: 5,
    avatar: "SM"
  },
  {
    id: 3,
    name: "Bilal Ahmed",
    location: "Rawalpindi",
    role: "Repair Shop Owner",
    text: "I buy wholesale mobile displays and motherboards from PartDoc. Market prices are competitive, zero defect rate, and fast customer response.",
    rating: 5,
    avatar: "BA"
  }
];

const MOCK_PRODUCTS = [
  {
    _id: "m1",
    name: "NVIDIA GeForce RTX 4080 Super 16GB",
    category: "Computer",
    price: 345000,
    rating: 4.9,
    countInStock: 10,
    image: "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=600&q=80",
    description: "Ultra-fast graphics card for high-end gaming and 4K rendering."
  },
  {
    _id: "m2",
    name: "Intel Core i9-14900K Processor",
    category: "Computer",
    price: 185000,
    rating: 4.9,
    countInStock: 15,
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&q=80",
    description: "24 cores and 32 threads for extreme desktop performance."
  },
  {
    _id: "m3",
    name: "Samsung 990 PRO 2TB NVMe SSD",
    category: "Computer",
    price: 48000,
    rating: 4.9,
    countInStock: 25,
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&q=80",
    description: "Read speeds up to 7450 MB/s for instant load times."
  },
  {
    _id: "m4",
    name: "iPhone 15 Pro Max Dynamic OLED Screen",
    category: "Mobile",
    price: 65000,
    rating: 5.0,
    countInStock: 8,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
    description: "Original Super Retina XDR OLED display assembly."
  },
  {
    _id: "m5",
    name: "Samsung Galaxy S24 Ultra Battery 5000mAh",
    category: "Mobile",
    price: 14500,
    rating: 4.8,
    countInStock: 20,
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&q=80",
    description: "Authentic replacement battery with 100% health grade."
  },
  {
    _id: "m6",
    name: "Corsair Vengeance RGB 32GB DDR5 RAM",
    category: "Computer",
    price: 38000,
    rating: 4.9,
    countInStock: 30,
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&q=80",
    description: "6000MHz CL36 high-speed desktop memory with dynamic RGB."
  }
];

const CATEGORIES = [
  { id: "Computer", title: "Computer Parts", desc: "GPUs, CPUs, RAM & SSDs", icon: Monitor, path: "/computerparts" },
  { id: "Laptop", title: "Laptop Parts", desc: "Displays, Batteries & Keyboards", icon: Laptop, path: "/computerparts?category=laptop" },
  { id: "Mobile", title: "Mobile Parts", desc: "OLED Displays & Batteries", icon: Smartphone, path: "/mobileparts" },
  { id: "Repair", title: "Repair Services", desc: "Professional Technician Booking", icon: Wrench, path: "/appointment" }
];

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: fetchedParts, loading } = useSelector((state) => state.parts);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [addedItem, setAddedItem] = useState(null);

  // Reviews State
  const [reviewsList, setReviewsList] = useState(INITIAL_REVIEWS);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", role: "Customer", location: "Pakistan", text: "", rating: 5 });

  useEffect(() => {
    dispatch(fetchParts());
  }, [dispatch]);

  const displayParts = (fetchedParts && fetchedParts.length > 0) ? fetchedParts : MOCK_PRODUCTS;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/computerparts?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAddToCart = (part) => {
    dispatch(addToCart({ ...part, qty: 1 }));
    setAddedItem(part._id);
    setToastMsg(`${part.name} added to cart!`);
    setShowToast(true);
    setTimeout(() => setAddedItem(null), 1800);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;

    const initials = newReview.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';
    const createdReview = {
      id: Date.now(),
      name: newReview.name,
      location: newReview.location || "Customer",
      role: newReview.role || "Verified Buyer",
      text: newReview.text,
      rating: Number(newReview.rating),
      avatar: initials
    };

    setReviewsList([createdReview, ...reviewsList]);
    setReviewModalOpen(false);
    setNewReview({ name: "", role: "Customer", location: "Pakistan", text: "", rating: 5 });
    setToastMsg("Thank you! Your review has been published.");
    setShowToast(true);
  };

  const filteredProducts = displayParts.filter((item) => {
    if (activeCategory === "all") return true;
    const cat = item.category?.toLowerCase() || '';
    const act = activeCategory.toLowerCase();
    return cat.includes(act) || act.includes(cat);
  });

  if (loading) {
    return <AestheticLoader text="Loading Catalog..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pt-20">
      
      <Toast message={toastMsg} isOpen={showToast} onClose={() => setShowToast(false)} />

      {/* Top Banner Announcement Strip */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="bg-indigo-600 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase">Fast Delivery</span>
        <span>Free Express Shipping Across Pakistan On Orders Above PKR 15,000</span>
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (CLEAN & SIMPLE LIGHT THEME) */}
      {/* ========================================================================= */}
      <section className="pt-10 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-5 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>100% Original Tech Spare Parts & Repair Portal</span>
          </div>

          <h1 className="font-grotesk text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
            Original Tech Parts & <br />
            <span className="text-indigo-600">Professional Repair</span> Services
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mb-8">
            Genuine GPUs, CPUs, SSDs, screens, and batteries with official warranty and fast nationwide 24-48h delivery across Pakistan.
          </p>

          {/* Simple Clean Search Bar */}
          <form onSubmit={handleSearchSubmit} className="w-full max-w-xl mb-8">
            <div className="relative flex items-center bg-white border border-slate-300 rounded-2xl p-1.5 shadow-md focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search parts e.g. 'RTX 4080', 'iPhone Screen'..."
                className="w-full bg-transparent text-slate-900 text-sm placeholder-slate-400 focus:outline-none py-2 pr-2"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
              >
                Search
              </button>
            </div>
          </form>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/computerparts"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-7 py-3.5 rounded-xl text-sm flex items-center gap-2 shadow-md transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-indigo-400" />
              <span>Browse Catalog</span>
            </Link>

            <Link
              to="/appointment"
              className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold px-7 py-3.5 rounded-xl text-sm flex items-center gap-2 shadow-sm transition-all"
            >
              <Wrench className="w-4 h-4 text-indigo-600" />
              <span>Book Appointment</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SIMPLE CATEGORIES TILES */}
      {/* ========================================================================= */}
      <section className="py-10 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={cat.path}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-grotesk font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">{cat.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FEATURED PRODUCTS CATALOG */}
      {/* ========================================================================= */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-grotesk">Featured Catalog</h2>
            <p className="text-slate-500 text-xs mt-1">Authentic replacement parts in stock.</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
            {["all", "Computer", "Mobile"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {cat === "all" ? "All Parts" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((item, idx) => (
            <div
              key={item._id || idx}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-full h-44 rounded-xl bg-slate-100 overflow-hidden mb-4 relative">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1591405351990-4726e331f141?w=600&q=80'}
                  />
                  <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">
                    {item.category || "Part"}
                  </span>
                </div>

                <h3 className="font-grotesk font-extrabold text-slate-900 text-base mb-1 truncate">
                  {item.name}
                </h3>
                <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                  {item.description || "Original grade replacement component."}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">In Stock</div>
                  <div className="font-grotesk font-extrabold text-base text-slate-900">
                    PKR {Number(item.price).toLocaleString()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/product/${item._id}`}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    Details
                  </Link>

                  <button
                    onClick={() => handleAddToCart(item)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      addedItem === item._id
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    }`}
                  >
                    {addedItem === item._id ? <Check size={14} /> : <ShoppingBag size={14} />}
                    <span>{addedItem === item._id ? "Added" : "Add"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE CUSTOMER REVIEWS & RATING SECTION */}
      {/* ========================================================================= */}
      <section className="py-14 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-1 text-amber-500 mb-1">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className="fill-amber-400 text-amber-400" />)}
              <span className="text-xs font-extrabold text-slate-900 ml-2">4.9 / 5.0 Rating</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 font-grotesk">Verified Customer Reviews</h2>
            <p className="text-slate-500 text-xs mt-1">Read feedback from our customers or share your own experience.</p>
          </div>

          {/* Button to Open Review Submission Modal */}
          <button
            onClick={() => setReviewModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <MessageSquarePlus size={16} />
            <span>Write A Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviewsList.map((rev) => (
            <div key={rev.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-400 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-xs leading-relaxed mb-6">"{rev.text}"</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                  {rev.avatar}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs">{rev.name}</div>
                  <div className="text-[10px] text-slate-400">{rev.role} · {rev.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. TRUST BADGES */}
      {/* ========================================================================= */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: ShieldCheck, title: "100% Genuine Guarantee", desc: "Verified serial numbers & official warranty." },
            { icon: Truck, title: "Express Shipping", desc: "Delivered in 24-48 hours across Pakistan." },
            { icon: Award, title: "Official Warranty", desc: "Peace of mind manufacturer warranty protection." },
            { icon: Headphones, title: "24/7 Expert Support", desc: "Talk directly with technicians for compatibility." }
          ].map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">{b.title}</h3>
                  <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SUBMIT REVIEW MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {reviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setReviewModalOpen(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
                <h3 className="font-grotesk font-extrabold text-slate-900 text-lg">Submit Your Rating & Review</h3>
                <button onClick={() => setReviewModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Star Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="p-1 text-amber-400 focus:outline-none"
                      >
                        <Star size={24} className={star <= newReview.rating ? "fill-amber-400" : "text-slate-300"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City / Location</label>
                  <input
                    type="text"
                    value={newReview.location}
                    onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                    placeholder="e.g. Lahore, Karachi"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Review *</label>
                  <textarea
                    required
                    rows="3"
                    value={newReview.text}
                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    placeholder="Share your experience with PartDoc parts or services..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all mt-2"
                >
                  Publish Review
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}