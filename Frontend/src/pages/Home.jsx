import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchParts } from "../features/parts/partsSlice";
import { addToCart } from "../features/cart/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import AestheticLoader from "../components/AestheticLoader";
import Toast from "../components/Toast";
import PartCard from "../components/PartCard";
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
  Check,
  Zap,
  TrendingUp,
  Clock,
  ArrowUpRight
} from "lucide-react";

// Initial Reviews Data
const INITIAL_REVIEWS = [
  {
    id: 1,
    name: "Hamza Iqbal",
    location: "Lahore",
    role: "Custom PC Builder",
    text: "Ordered an RTX 4080 Super. Delivery took under 36 hours. 100% genuine part with official serial verification!",
    rating: 5,
    avatar: "HI"
  },
  {
    id: 2,
    name: "Sana Malik",
    location: "Karachi",
    role: "Freelance Editor",
    text: "My MacBook battery had swollen. Ordered OEM replacement screen & battery from PartDoc. Installed smoothly, performance is like new!",
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
  { id: "Computer", title: "Computer Parts", desc: "GPUs, CPUs, RAM & SSDs", count: "1,200+ Parts", icon: Monitor, path: "/computerparts" },
  { id: "Laptop", title: "Laptop Parts", desc: "Displays, Batteries & Keyboards", count: "850+ Parts", icon: Laptop, path: "/computerparts?category=laptop" },
  { id: "Mobile", title: "Mobile Parts", desc: "OLED Displays & Logic Boards", count: "1,500+ Parts", icon: Smartphone, path: "/mobileparts" },
  { id: "Repair", title: "Repair & Services", desc: "Professional Technician Booking", count: "24/7 Available", icon: Wrench, path: "/appointment" }
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

  // Estimator State
  const [calcDevice, setCalcDevice] = useState("Computer");
  const [calcPart, setCalcPart] = useState("GPU");

  // Reviews State
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", role: "Customer", location: "Pakistan", text: "", rating: 5 });

  // One-Time Loader Per Session
  const [showInitialLoader, setShowInitialLoader] = useState(() => {
    return !sessionStorage.getItem('hasSeenInitialLoader');
  });

  useEffect(() => {
    dispatch(fetchParts());
    fetchLiveReviews();

    if (showInitialLoader) {
      const timer = setTimeout(() => {
        setShowInitialLoader(false);
        sessionStorage.setItem('hasSeenInitialLoader', 'true');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [dispatch]);

  const fetchLiveReviews = async () => {
    try {
      const res = await api.get('/parts/reviews/all');
      if (Array.isArray(res.data)) {
        setReviewsList(res.data);
      }
    } catch (err) {
      console.error("Error fetching live reviews:", err);
    }
  };

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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;

    try {
      await api.post('/parts/store/reviews', {
        name: newReview.name,
        rating: Number(newReview.rating),
        comment: newReview.text
      });

      setReviewModalOpen(false);
      setNewReview({ name: "", role: "Customer", location: "Pakistan", text: "", rating: 5 });
      setToastMsg("Thank you! Your review has been saved and published.");
      setShowToast(true);

      // Refresh live reviews from DB
      fetchLiveReviews();
    } catch (err) {
      alert("Error posting review: " + (err.response?.data?.message || err.message));
    }
  };

  // Estimator Data
  const ESTIMATOR_DATA = {
    Computer: {
      GPU: { price: "PKR 45,000 - 450,000", time: "Same Day Dispatch", warranty: "1-3 Years Warranty" },
      CPU: { price: "PKR 22,000 - 180,000", time: "24h Express Ship", warranty: "3 Years Warranty" },
      RAM: { price: "PKR 6,500 - 48,000", time: "Instant Stock", warranty: "Lifetime Warranty" },
      Storage: { price: "PKR 8,000 - 65,000", time: "Same Day Ship", warranty: "5 Years Warranty" },
    },
    Laptop: {
      Display: { price: "PKR 12,500 - 55,000", time: "24-48h Delivery", warranty: "6 Months Warranty" },
      Battery: { price: "PKR 5,500 - 24,000", time: "In Stock", warranty: "6 Months Warranty" },
      Keyboard: { price: "PKR 3,200 - 12,000", time: "In Stock", warranty: "3 Months Warranty" },
      Charger: { price: "PKR 3,800 - 14,500", time: "Same Day Ship", warranty: "6 Months Warranty" },
    },
    Mobile: {
      Display: { price: "PKR 4,500 - 75,000", time: "Original OEM Grade", warranty: "Tested & Verified" },
      Battery: { price: "PKR 2,800 - 16,000", time: "100% Health Cell", warranty: "3 Months Warranty" },
      Motherboard: { price: "PKR 12,000 - 110,000", time: "Tested & Unlocked", warranty: "Tested Verified" },
      Camera: { price: "PKR 3,500 - 28,000", time: "Original Pulls", warranty: "7 Days Replacement" },
    }
  };

  const currentEst = ESTIMATOR_DATA[calcDevice]?.[calcPart] || { price: "PKR 5,000+", time: "24 Hours", warranty: "Warranty Included" };

  const filteredProducts = displayParts.filter((item) => {
    if (activeCategory === "all") return true;
    const cat = item.category?.toLowerCase() || '';
    const act = activeCategory.toLowerCase();
    return cat.includes(act) || act.includes(cat);
  });

  if (showInitialLoader) {
    return <AestheticLoader text="Loading PartDoc Experience..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-600 selection:text-white pt-20">
      
      <Toast message={toastMsg} isOpen={showToast} onClose={() => setShowToast(false)} />

      {/* Top Banner Announcement Strip */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="bg-indigo-600 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
          FAST DELIVERY
        </span>
        <span>Free Express Delivery Across Pakistan On Orders Above PKR 15,000 | 100% Genuine Guaranteed</span>
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (RICH 2-COLUMN MODERN LIGHT THEME) */}
      {/* ========================================================================= */}
      <section className="pt-10 pb-20 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-5 shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Official Tech Spare Parts & Priority Repair Portal</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-grotesk text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-5">
              Original Tech Parts & <br />
              <span className="text-indigo-600">Professional Repair</span> Services
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mb-8">
              Computer GPUs, CPUs, SSDs, screens, batteries, and logic boards — verified serial numbers with official warranty across Pakistan.
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link
                to="/computerparts"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-7 py-3.5 rounded-xl text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Explore Shop Catalog</span>
              </Link>

              <Link
                to="/appointment"
                className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold px-7 py-3.5 rounded-xl text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                <Wrench className="w-4 h-4 text-indigo-600" />
                <span>Book Repair Appointment</span>
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-6 border-t border-slate-200 w-full grid grid-cols-3 gap-4">
              <div>
                <div className="font-grotesk font-extrabold text-xl text-slate-900">10,000+</div>
                <div className="text-xs text-slate-500 mt-0.5">Parts Shipped</div>
              </div>
              <div>
                <div className="font-grotesk font-extrabold text-xl text-indigo-600">100%</div>
                <div className="text-xs text-slate-500 mt-0.5">Serial Verified</div>
              </div>
              <div>
                <div className="font-grotesk font-extrabold text-xl text-slate-900">24-48h</div>
                <div className="text-xs text-slate-500 mt-0.5">Express Delivery</div>
              </div>
            </div>

          </motion.div>

          {/* Right Hero Product Card Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Background Soft Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-100 rounded-full blur-3xl -z-10" />

            {/* Featured Light Card */}
            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 relative">
              
              {/* Product Badge Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>In Stock & Ready To Ship</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">SKU: #PD-4080S</span>
              </div>

              {/* Product Image */}
              <div className="w-full h-56 rounded-2xl bg-slate-100 overflow-hidden mb-5 relative group">
                <img
                  src="https://images.unsplash.com/photo-1591405351990-4726e331f141?w=600&q=80"
                  alt="RTX Graphics Card"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-slate-900 shadow-md">
                  ⭐ 4.9 (48 Reviews)
                </div>
              </div>

              {/* Product Info */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">Computer Parts</div>
                  <h3 className="font-grotesk font-extrabold text-slate-900 text-lg">RTX 4080 Super 16GB</h3>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Official Price</div>
                  <div className="font-grotesk text-xl font-extrabold text-slate-900">PKR 345,000</div>
                </div>
              </div>

              {/* Trust Status Strip */}
              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                <div className="bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100 flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <div>
                    <div className="text-[11px] font-bold text-slate-900">Express Shipping</div>
                    <div className="text-[10px] text-slate-500">Shipped in 24-48h</div>
                  </div>
                </div>

                <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-100 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <div className="text-[11px] font-bold text-slate-900">100% Genuine</div>
                    <div className="text-[10px] text-slate-500">Official Warranty</div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CATEGORY CARDS */}
      {/* ========================================================================= */}
      <section className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={cat.path}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      {cat.count}
                    </span>
                  </div>

                  <h3 className="font-grotesk font-extrabold text-slate-900 text-lg mb-1 group-hover:text-indigo-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{cat.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                  <span>Explore Parts</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. HARDWARE ESTIMATOR WIDGET */}
      {/* ========================================================================= */}
      <section className="py-14 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl mb-8">
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-3">
              INSTANT REPAIR & COST ESTIMATOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-grotesk">
              Estimate Component Costs & Repair Timeline
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Select your device and part type to instantly estimate costs, warranty, and dispatch time.
            </p>
          </div>

          {/* Device Tabs */}
          <div className="flex flex-wrap gap-3 mb-6">
            {["Computer", "Laptop", "Mobile"].map((dev) => (
              <button
                key={dev}
                onClick={() => {
                  setCalcDevice(dev);
                  setCalcPart(Object.keys(ESTIMATOR_DATA[dev])[0]);
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                  calcDevice === dev
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                }`}
              >
                {dev}
              </button>
            ))}
          </div>

          {/* Part Selector Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.keys(ESTIMATOR_DATA[calcDevice] || {}).map((partKey) => (
              <button
                key={partKey}
                onClick={() => setCalcPart(partKey)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  calcPart === partKey
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {partKey}
              </button>
            ))}
          </div>

          {/* Estimator Display Output Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 p-6 rounded-2xl mb-8">
            <div>
              <div className="text-xs text-slate-500 mb-1">Estimated Price Range</div>
              <div className="font-grotesk text-xl font-extrabold text-indigo-600">{currentEst.price}</div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1">Dispatch / Repair Window</div>
              <div className="font-grotesk text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                {currentEst.time}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1">Warranty Period</div>
              <div className="font-grotesk text-base font-bold text-emerald-600 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                {currentEst.warranty}
              </div>
            </div>
          </div>

          <Link
            to={`/appointment?device=${encodeURIComponent(calcDevice)}&part=${encodeURIComponent(calcPart)}`}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-7 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
          >
            <span>Book Priority Slot For {calcDevice} ({calcPart})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FEATURED PRODUCTS CATALOG */}
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 justify-items-center">
          {filteredProducts.slice(0, 3).map((item, idx) => (
            <div key={item._id || idx} className="w-full flex justify-center">
              <PartCard part={item} />
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE CUSTOMER REVIEWS & RATING SECTION */}
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
        {reviewsList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            No live customer reviews submitted yet. Click "Write A Review" to be the first!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviewsList.slice(0, 6).map((rev, idx) => {
              const text = rev.comment || rev.text;
              const initials = rev.name ? rev.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U';
              return (
                <div key={rev._id || idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 text-amber-400 mb-3">
                      {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed mb-6">"{text}"</p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                      {initials}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{rev.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {rev.partName ? `Review on ${rev.partName}` : 'Verified Customer'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 6. TRUST BADGES */}
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